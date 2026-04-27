import os
import httpx
from dotenv import load_dotenv

load_dotenv()

URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_KEY")
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
TARGET_EMAIL = "sultan@smartwh.io"
TARGET_PASSWORD = "admin123"
TARGET_METADATA = {"full_name": "Sultan", "role": "admin"}

# Check existing auth users
r = httpx.get(f"{URL}/auth/v1/admin/users", headers=H)
if r.status_code == 200:
    users = r.json().get("users", [])
    print(f"Found {len(users)} user(s):")
    for u in users:
        email = u.get("email", "no email")
        created = u.get("created_at", "unknown")[:10]
        print(f"  - {email} (created {created})")
else:
    print(f"Error: {r.status_code} {r.text[:200]}")

# Create or normalize demo user
emails = [u.get("email") for u in r.json().get("users", [])] if r.status_code == 200 else []
if TARGET_EMAIL not in emails:
    print(f"\nCreating {TARGET_EMAIL}...")
    create_r = httpx.post(f"{URL}/auth/v1/admin/users", json={
        "email": TARGET_EMAIL,
        "password": TARGET_PASSWORD,
        "email_confirm": True,
        "user_metadata": TARGET_METADATA,
    }, headers=H)
    if create_r.status_code in (200, 201):
        print("User created successfully!")
    else:
        print(f"Create error: {create_r.status_code} {create_r.text[:200]}")
else:
    print(f"\n{TARGET_EMAIL} already exists. Updating metadata/password for demo consistency...")
    users = r.json().get("users", [])
    existing = next((u for u in users if u.get("email") == TARGET_EMAIL), None)
    if existing:
        update_r = httpx.put(
            f"{URL}/auth/v1/admin/users/{existing['id']}",
            json={
                "email": TARGET_EMAIL,
                "password": TARGET_PASSWORD,
                "email_confirm": True,
                "user_metadata": TARGET_METADATA,
            },
            headers=H,
        )
        if update_r.status_code == 200:
            print("User updated successfully!")
        else:
            print(f"Update error: {update_r.status_code} {update_r.text[:200]}")
