"""
Quick database seeder using Supabase REST API.
Run: python seed.py
"""

import os
import httpx
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta

load_dotenv()

URL = os.getenv("SUPABASE_URL", "")
KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

HEADERS = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}


def insert(table, data):
    r = httpx.post(f"{URL}/rest/v1/{table}", json=data, headers=HEADERS)
    if r.status_code in (200, 201):
        print(f"  Inserted {len(r.json()) if isinstance(r.json(), list) else 1} row(s) into {table}")
        return r.json()
    else:
        print(f"  ERROR {table}: {r.status_code} {r.text[:200]}")
        return []


def delete(table):
    h = {**HEADERS, "Prefer": "return=minimal"}
    r = httpx.delete(f"{URL}/rest/v1/{table}?id=neq.00000000-0000-0000-0000-000000000000", headers=h)
    print(f"  Cleaned {table}: {r.status_code}")


def main():
    print("SmartWH Database Seeder")
    print("=" * 40)

    # Clean existing data
    print("\n1. Cleaning existing data...")
    for t in ["detection_results", "detections", "activity_log", "alerts", "inventory", "cameras", "zones"]:
        delete(t)

    # Zones
    print("\n2. Seeding zones...")
    zones_data = [
        {"name": "Zone A -- Inbound Dock", "description": "Receiving area for incoming shipments", "color": "#4a90d9", "capacity": 500, "current_load": 120, "status": "active", "x": 0.02, "y": 0.02, "width": 0.30, "height": 0.45},
        {"name": "Zone B -- Cold Storage", "description": "Temperature controlled storage for perishables", "color": "#3db8a9", "capacity": 300, "current_load": 85, "status": "active", "x": 0.34, "y": 0.02, "width": 0.30, "height": 0.45},
        {"name": "Zone C -- General Storage", "description": "Main warehouse storage area for general goods", "color": "#e5a035", "capacity": 800, "current_load": 340, "status": "active", "x": 0.66, "y": 0.02, "width": 0.30, "height": 0.45},
        {"name": "Zone D -- Packing Area", "description": "Order processing and packing station", "color": "#7c6cf0", "capacity": 200, "current_load": 60, "status": "active", "x": 0.02, "y": 0.52, "width": 0.30, "height": 0.45},
        {"name": "Zone E -- Outbound Dock", "description": "Shipping and dispatch staging area", "color": "#d95459", "capacity": 400, "current_load": 150, "status": "active", "x": 0.34, "y": 0.52, "width": 0.30, "height": 0.45},
        {"name": "Zone F -- Admin Office", "description": "Office space and system monitoring room", "color": "#64748b", "capacity": 50, "current_load": 10, "status": "active", "x": 0.66, "y": 0.52, "width": 0.30, "height": 0.45},
    ]
    zones = insert("zones", zones_data)
    zone_map = {z["name"]: z["id"] for z in zones} if zones else {}

    if not zone_map:
        print("FAILED to insert zones. Aborting.")
        return

    # Cameras
    print("\n3. Seeding cameras...")
    cameras = [
        {"zone_id": zone_map["Zone A -- Inbound Dock"], "name": "CAM-01 Dock Entry", "status": "online", "resolution": "1920x1080", "fps": 30},
        {"zone_id": zone_map["Zone A -- Inbound Dock"], "name": "CAM-02 Dock Overview", "status": "online", "resolution": "1920x1080", "fps": 30},
        {"zone_id": zone_map["Zone B -- Cold Storage"], "name": "CAM-03 Cold Room", "status": "online", "resolution": "1280x720", "fps": 24},
        {"zone_id": zone_map["Zone C -- General Storage"], "name": "CAM-04 Aisle North", "status": "online", "resolution": "1920x1080", "fps": 30},
        {"zone_id": zone_map["Zone C -- General Storage"], "name": "CAM-05 Aisle South", "status": "online", "resolution": "1920x1080", "fps": 30},
        {"zone_id": zone_map["Zone D -- Packing Area"], "name": "CAM-06 Packing Station", "status": "online", "resolution": "1280x720", "fps": 24},
        {"zone_id": zone_map["Zone E -- Outbound Dock"], "name": "CAM-07 Shipping Lane", "status": "online", "resolution": "1920x1080", "fps": 30},
        {"zone_id": zone_map["Zone F -- Admin Office"], "name": "CAM-08 Office Monitor", "status": "offline", "resolution": "1280x720", "fps": 24},
    ]
    insert("cameras", cameras)

    # Inventory
    print("\n4. Seeding inventory...")
    inventory = [
        {"zone_id": zone_map["Zone A -- Inbound Dock"], "item_code": "PT-001", "name": "Snake Trap Type A", "category": "Pest Control", "quantity": 12, "min_stock": 5, "status": "in-stock", "weight": 2.5},
        {"zone_id": zone_map["Zone A -- Inbound Dock"], "item_code": "PT-002", "name": "Rodent Bait Station", "category": "Pest Control", "quantity": 8, "min_stock": 4, "status": "in-stock", "weight": 1.8},
        {"zone_id": zone_map["Zone B -- Cold Storage"], "item_code": "EQ-001", "name": "Thermal Camera Sensor", "category": "Equipment", "quantity": 3, "min_stock": 2, "status": "in-stock", "weight": 0.4},
        {"zone_id": zone_map["Zone C -- General Storage"], "item_code": "PT-003", "name": "Gecko Glue Board", "category": "Pest Control", "quantity": 24, "min_stock": 10, "status": "in-stock", "weight": 0.3},
        {"zone_id": zone_map["Zone C -- General Storage"], "item_code": "PT-004", "name": "UV Insect Killer", "category": "Pest Control", "quantity": 6, "min_stock": 3, "status": "in-stock", "weight": 3.2},
        {"zone_id": zone_map["Zone D -- Packing Area"], "item_code": "SF-001", "name": "Safety Gloves (Box)", "category": "Safety Gear", "quantity": 15, "min_stock": 5, "status": "in-stock", "weight": 1.0},
        {"zone_id": zone_map["Zone D -- Packing Area"], "item_code": "SF-002", "name": "First Aid Kit", "category": "Safety Gear", "quantity": 4, "min_stock": 2, "status": "in-stock", "weight": 2.0},
        {"zone_id": zone_map["Zone E -- Outbound Dock"], "item_code": "EQ-002", "name": "Motion Sensor Alarm", "category": "Equipment", "quantity": 5, "min_stock": 2, "status": "in-stock", "weight": 0.6},
        {"zone_id": zone_map["Zone E -- Outbound Dock"], "item_code": "PT-005", "name": "Cat Deterrent Spray", "category": "Pest Control", "quantity": 10, "min_stock": 4, "status": "in-stock", "weight": 0.5},
        {"zone_id": zone_map["Zone F -- Admin Office"], "item_code": "AD-001", "name": "Pest Incident Logbook", "category": "Documentation", "quantity": 2, "min_stock": 1, "status": "in-stock", "weight": 0.8},
    ]
    insert("inventory", inventory)

    # Alerts
    print("\n5. Seeding alerts...")
    now = datetime.now(timezone.utc)
    alerts = [
        {"type": "critical", "severity": "high", "title": "Snake Detected via AI Scan", "message": "AI detected snake (96.2% confidence) in Zone A. Immediate response recommended.", "zone_id": zone_map["Zone A -- Inbound Dock"], "animal_type": "snake", "status": "unread", "created_at": (now - timedelta(hours=2)).isoformat()},
        {"type": "warning", "severity": "medium", "title": "Cat Detected via AI Scan", "message": "AI detected cat (91.5% confidence) in Zone C. Monitor and respond.", "zone_id": zone_map["Zone C -- General Storage"], "animal_type": "cat", "status": "unread", "created_at": (now - timedelta(hours=5)).isoformat()},
        {"type": "warning", "severity": "medium", "title": "Gecko Detected via AI Scan", "message": "AI detected gecko (88.3% confidence) in Zone D. Low risk, monitor situation.", "zone_id": zone_map["Zone D -- Packing Area"], "animal_type": "gecko", "status": "read", "created_at": (now - timedelta(hours=12)).isoformat()},
        {"type": "critical", "severity": "high", "title": "Snake Detected via AI Scan", "message": "AI detected snake (94.7% confidence) in Zone E. Immediate response recommended.", "zone_id": zone_map["Zone E -- Outbound Dock"], "animal_type": "snake", "status": "read", "created_at": (now - timedelta(hours=24)).isoformat()},
        {"type": "info", "severity": "low", "title": "System Health Check", "message": "All 7 cameras online. AI model YOLOv8 running normally.", "zone_id": zone_map["Zone F -- Admin Office"], "animal_type": None, "status": "read", "created_at": (now - timedelta(hours=48)).isoformat()},
        {"type": "warning", "severity": "medium", "title": "Cat Detected via AI Scan", "message": "AI detected cat (89.1% confidence) in Zone B. Cold storage area, high priority.", "zone_id": zone_map["Zone B -- Cold Storage"], "animal_type": "cat", "status": "read", "created_at": (now - timedelta(hours=72)).isoformat()},
    ]
    insert("alerts", alerts)

    # Detections
    print("\n6. Seeding detections...")
    det_data = [
        {"total_objects": 2, "inference_time_ms": 142, "model_version": "YOLOv8", "created_at": (now - timedelta(hours=2)).isoformat()},
        {"total_objects": 1, "inference_time_ms": 98, "model_version": "YOLOv8", "created_at": (now - timedelta(hours=5)).isoformat()},
        {"total_objects": 1, "inference_time_ms": 115, "model_version": "YOLOv8", "created_at": (now - timedelta(hours=12)).isoformat()},
        {"total_objects": 3, "inference_time_ms": 187, "model_version": "YOLOv8", "created_at": (now - timedelta(days=1)).isoformat()},
        {"total_objects": 1, "inference_time_ms": 105, "model_version": "YOLOv8", "created_at": (now - timedelta(days=2)).isoformat()},
        {"total_objects": 2, "inference_time_ms": 134, "model_version": "YOLOv8", "created_at": (now - timedelta(days=3)).isoformat()},
    ]
    dets = insert("detections", det_data)

    if dets and len(dets) >= 6:
        print("\n7. Seeding detection results...")
        results = [
            {"detection_id": dets[0]["id"], "class_name": "snake", "confidence": 0.962, "x": 120.5, "y": 85.3, "width": 210.0, "height": 95.0, "created_at": (now - timedelta(hours=2)).isoformat()},
            {"detection_id": dets[0]["id"], "class_name": "gecko", "confidence": 0.883, "x": 450.2, "y": 220.1, "width": 80.0, "height": 55.0, "created_at": (now - timedelta(hours=2)).isoformat()},
            {"detection_id": dets[1]["id"], "class_name": "cat", "confidence": 0.915, "x": 200.0, "y": 150.0, "width": 180.0, "height": 200.0, "created_at": (now - timedelta(hours=5)).isoformat()},
            {"detection_id": dets[2]["id"], "class_name": "gecko", "confidence": 0.871, "x": 380.0, "y": 300.0, "width": 70.0, "height": 50.0, "created_at": (now - timedelta(hours=12)).isoformat()},
            {"detection_id": dets[3]["id"], "class_name": "snake", "confidence": 0.947, "x": 100.0, "y": 60.0, "width": 230.0, "height": 85.0, "created_at": (now - timedelta(days=1)).isoformat()},
            {"detection_id": dets[3]["id"], "class_name": "cat", "confidence": 0.891, "x": 500.0, "y": 180.0, "width": 160.0, "height": 190.0, "created_at": (now - timedelta(days=1)).isoformat()},
            {"detection_id": dets[3]["id"], "class_name": "gecko", "confidence": 0.845, "x": 320.0, "y": 350.0, "width": 65.0, "height": 45.0, "created_at": (now - timedelta(days=1)).isoformat()},
            {"detection_id": dets[4]["id"], "class_name": "snake", "confidence": 0.934, "x": 150.0, "y": 90.0, "width": 200.0, "height": 80.0, "created_at": (now - timedelta(days=2)).isoformat()},
            {"detection_id": dets[5]["id"], "class_name": "cat", "confidence": 0.908, "x": 280.0, "y": 200.0, "width": 170.0, "height": 185.0, "created_at": (now - timedelta(days=3)).isoformat()},
            {"detection_id": dets[5]["id"], "class_name": "snake", "confidence": 0.876, "x": 50.0, "y": 50.0, "width": 240.0, "height": 100.0, "created_at": (now - timedelta(days=3)).isoformat()},
        ]
        insert("detection_results", results)

    # Activity log
    print("\n8. Seeding activity log...")
    logs = [
        {"user_name": "Sultan", "action": "AI Pest Scan: 2 detections", "target": "Snake, Gecko", "type": "detection", "created_at": (now - timedelta(hours=2)).isoformat()},
        {"user_name": "Sultan", "action": "AI Pest Scan: 1 detection", "target": "Cat", "type": "detection", "created_at": (now - timedelta(hours=5)).isoformat()},
        {"user_name": "System", "action": "Camera CAM-08 went offline", "target": "Office Monitor", "type": "system", "created_at": (now - timedelta(hours=8)).isoformat()},
        {"user_name": "Sultan", "action": "AI Pest Scan: 1 detection", "target": "Gecko", "type": "detection", "created_at": (now - timedelta(hours=12)).isoformat()},
        {"user_name": "Misha", "action": "Added inventory item", "target": "Snake Trap Type A", "type": "create", "created_at": (now - timedelta(days=1)).isoformat()},
        {"user_name": "Sultan", "action": "AI Pest Scan: 3 detections", "target": "Snake, Cat, Gecko", "type": "detection", "created_at": (now - timedelta(days=1)).isoformat()},
        {"user_name": "Fathir", "action": "Marked alert as read", "target": "Snake Detected in E", "type": "update", "created_at": (now - timedelta(days=1)).isoformat()},
        {"user_name": "Sultan", "action": "AI Pest Scan: 1 detection", "target": "Snake", "type": "detection", "created_at": (now - timedelta(days=2)).isoformat()},
        {"user_name": "Risly", "action": "Exported alerts report", "target": "CSV Export", "type": "export", "created_at": (now - timedelta(days=2)).isoformat()},
        {"user_name": "Sultan", "action": "AI Pest Scan: 2 detections", "target": "Cat, Snake", "type": "detection", "created_at": (now - timedelta(days=3)).isoformat()},
    ]
    insert("activity_log", logs)

    print("\n" + "=" * 40)
    print("Database seeded successfully!")
    print(f"  6 zones, 8 cameras, 10 inventory items")
    print(f"  6 alerts, 6 detections, 10 detection results")
    print(f"  10 activity log entries")


if __name__ == "__main__":
    main()
