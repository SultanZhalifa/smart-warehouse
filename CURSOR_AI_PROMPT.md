# Cursor AI - SmartWH Project Handoff Prompt

Copy this entire document and paste it into Cursor AI as the initial prompt.

---

## Who I Am

I am Sultan, an Informatics student at President University (5th semester). This is my Software Engineering course project built with Scrum methodology. I am also submitting this to a hackathon competition. My goals:
1. Get a perfect score (100) from my professor
2. Win 1st place at the hackathon
3. Have a fully working live demo with webcam and uploaded photo pest detection

## Project Overview

**SmartWH** is a full-stack warehouse pest detection system that uses AI (YOLOv8 via Roboflow) to detect snakes, cats, and geckos in warehouse environments. The system has a React frontend and a Python FastAPI backend.

**GitHub:** https://github.com/SultanZhalifa/smart-warehouse
**Project Path:** `c:\Users\sulta\OneDrive\Desktop\Project Software Engineer`

## Architecture

```
[React Frontend (Vite, port 5173)]
        |
        | HTTP POST /api/detect (image upload)
        v
[Python FastAPI Backend (port 8000)]
        |
        |--- Roboflow API (YOLOv8 inference)
        |--- Supabase REST API (save results, alerts, logs)
        v
[Supabase PostgreSQL Database (cloud)]
```

## Current File Structure

```
Project Software Engineer/
├── backend/
│   ├── app.py              # FastAPI server - AI inference endpoint
│   ├── train.py            # YOLOv8 training script (Roboflow + Ultralytics)
│   ├── seed.py             # Database seeder via REST API
│   ├── check_users.py      # Auth user management script (create or update demo user)
│   ├── requirements.txt    # Python deps: fastapi, uvicorn, httpx, python-dotenv
│   └── .env                # Backend secrets (NOT in git)
├── src/
│   ├── components/
│   │   ├── common/         # Toast notifications
│   │   ├── icons/PestIcons.jsx  # Custom SVG icons (snake, cat, gecko)
│   │   └── layout/         # Sidebar, Header, Layout
│   ├── context/
│   │   ├── AuthContext.jsx  # Supabase auth (login, register, forgot password)
│   │   └── WarehouseContext.jsx  # Global data (zones, cameras, alerts, inventory, logs)
│   ├── lib/
│   │   ├── supabase.js     # Supabase client with custom localStorage adapter
│   │   └── database.js     # 20+ CRUD and analytics query functions
│   ├── pages/              # 10 pages (see below)
│   ├── utils/              # CSV export utilities
│   ├── index.css           # Design system (dark theme, glassmorphism)
│   ├── App.jsx             # Root component with React Router
│   └── main.jsx            # Entry point
├── scripts/
│   ├── schema.sql          # Full database schema with RLS policies
│   └── seed-data.sql       # SQL version of seed data
├── docs/                   # Scrum docs (sprint reports, retrospectives, backlog)
├── .env                    # Frontend env vars (NOT in git)
├── .env.example            # Template for env vars
└── README.md               # Full project documentation
```

## Pages (10 total)

| Page | File | Status |
|------|------|--------|
| Login | LoginPage.jsx | Working (sign in, register, forgot password) |
| Dashboard | DashboardPage.jsx | Working but shows 0s when not logged in |
| AI Detection | AIDetectionPage.jsx | NEEDS FIX - still calls Roboflow directly instead of backend |
| Pest Simulator | DetectionPage.jsx | Working (canvas animation demo) |
| Inventory | InventoryPage.jsx | Working (full CRUD) |
| Alerts | AlertsPage.jsx | Working (severity filter, read/unread) |
| Analytics | AnalyticsPage.jsx | Working (5 chart types from real DB) |
| Zones | ZonesPage.jsx | Working (interactive floor plan) |
| Activity Log | ActivityPage.jsx | Working (timeline, CSV export) |
| Settings | SettingsPage.jsx | Working (profile, notifications, theme) |

## Environment Variables

### Frontend `.env` (project root)
Copy from `.env.example` in the repo root. Never commit real keys.

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:8000
```

### Backend `backend/.env`
Copy from `backend/.env.example`. Never commit real keys.

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
ROBOFLOW_API_KEY=your_roboflow_api_key
ROBOFLOW_MODEL=your_roboflow_model_slug
ROBOFLOW_VERSION=1
HOST=0.0.0.0
PORT=8000
```

## Database Tables (Supabase PostgreSQL)

| Table | Key Columns | RLS |
|-------|------------|-----|
| profiles | id (UUID, FK auth.users), full_name, role, student_id, avatar_initials | Yes |
| zones | id, name, description, color, capacity, current_load, status, x, y, width, height | Yes |
| cameras | id, zone_id (FK zones), name, status, resolution, fps | Yes |
| inventory | id, zone_id, item_code (unique), name, category, quantity, min_stock, status, weight | Yes |
| alerts | id, type, severity, title, message, zone_id, animal_type, status | Yes |
| detections | id, user_id, total_objects, inference_time_ms, model_version, created_at | Yes |
| detection_results | id, detection_id (FK detections), class_name, confidence, x, y, width, height | Yes |
| activity_log | id, user_id, user_name, action, target, details, type | Yes |
| user_settings | id, user_id, setting_key, setting_value | Yes |

All tables have RLS enabled with policies allowing all operations for authenticated users.
There is a trigger `on_auth_user_created` that auto-creates a profile when a new user signs up.

## Database Current State

The database has been seeded with:
- 6 zones (may have duplicates from earlier manual inserts, total could be 12)
- 8 cameras
- 10 inventory items
- 6 alerts
- 6 detection sessions with 10 detection results
- 10 activity log entries

**Potential issue:** There might be duplicate zones if seed was run multiple times. Run `SELECT count(*) FROM zones;` to check. If > 6, clean with `DELETE FROM zones;` and re-run `python backend/seed.py`.

## What Works Right Now

1. Backend starts: `cd backend && python app.py` -> http://localhost:8000
2. Health check: `GET /api/health` returns `{"status":"online","database":"connected"}`
3. Frontend starts: `npm run dev` -> http://localhost:5173
4. Database is seeded with demo data
5. All pages render correctly with the dark theme UI
6. Supabase real-time subscriptions work for alerts and activity log

## CRITICAL ISSUES TO FIX (Priority Order)

### Issue 1: AIDetectionPage.jsx still calls Roboflow directly (HIGHEST PRIORITY)
**File:** `src/pages/AIDetectionPage.jsx`
**Problem:** Lines 13-17 still have `ROBOFLOW_API_KEY` and direct Roboflow API URL. The `runDetection` function around line 91-146 sends images directly to Roboflow from the browser instead of going through the Python backend.
**Fix needed:** Change the detection function to POST to `http://localhost:8000/api/detect` (using `VITE_BACKEND_URL` from env). Send the image as FormData with fields: `image` (file), `user_name`, `zone_id`, `confidence_threshold`, `overlap_threshold`. The backend handles Roboflow, saves to DB, and returns predictions.

### Issue 2: No Supabase auth user exists for demo login
**Problem:** The login page works but there is no user account created in Supabase Auth. The demo credentials `sultan@smartwh.io / admin123` do not exist yet.
**Fix:** Either:
- Create the user via Supabase Dashboard > Authentication > Users > Add User
- Or finish `backend/check_users.py` and run it to create the user via Admin API
- The user must be created with `email_confirm: true` so they can log in immediately
- user_metadata should include `{"full_name": "Sultan", "role": "admin"}`

### Issue 3: Dashboard shows 0s when not authenticated
**Problem:** RLS policies require authenticated users. The WarehouseContext fetches data on mount, but if the user is not logged in, Supabase returns empty arrays. The dashboard then shows 0 for everything.
**Fix:** This is actually expected behavior. Once Issue 2 is fixed and the user can log in, the dashboard will show real data. No code change needed, just need a working auth user.

### Issue 4: ROBOFLOW_MODEL is empty
**Problem:** Both frontend and backend `.env` files have `ROBOFLOW_MODEL=` (empty). Without a model slug, the detection endpoint returns 503.
**Fix:** Train or deploy a model on Roboflow (pest or animal detection dataset), then set `ROBOFLOW_MODEL` and `ROBOFLOW_API_KEY` in `backend/.env`. The backend is intentionally strict: without these variables it returns HTTP 503 and does not fabricate detections.

### Issue 5: Duplicate data risk
**Problem:** The seed script was run at least once via `python backend/seed.py` and possibly also manually in SQL Editor, creating duplicate zones.
**Fix:** Run cleanup first: go to Supabase SQL Editor and run:
```sql
DELETE FROM detection_results;
DELETE FROM detections;
DELETE FROM activity_log;
DELETE FROM alerts;
DELETE FROM inventory;
DELETE FROM cameras;
DELETE FROM zones;
```
Then re-run `python backend/seed.py` once.

## NICE-TO-HAVE IMPROVEMENTS

1. **Webcam capture support** in AIDetectionPage - capture frame from webcam, send to backend
2. **Deploy frontend to Vercel** and backend to Railway or Render
3. **Train custom YOLOv8 model** on Roboflow with snake/cat/gecko images
4. **Add loading skeletons** to dashboard cards while data loads
5. **Responsive design polish** for mobile/tablet views

## How to Run the Project

### Terminal 1 (Backend):
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Terminal 2 (Frontend):
```bash
npm install
npm run dev
```

### Seed Database (if empty):
```bash
cd backend
python seed.py
```

## Tech Stack

- **Frontend:** React 19, Vite 8, React Router v6, Chart.js, Lucide Icons, Vanilla CSS
- **Backend:** Python 3.14, FastAPI 0.115, Uvicorn, httpx (for Supabase + Roboflow calls)
- **Database:** Supabase PostgreSQL with RLS
- **AI:** Roboflow YOLOv8 inference API
- **Auth:** Supabase Auth (email/password)

## Important Technical Notes

1. **supabase-py does NOT work** with the new `sb_secret_` key format. That's why the backend uses `httpx` to call the Supabase REST API directly instead of the `supabase` Python library.
2. **Auth session timeout:** The Supabase JS client has a 3-second timeout for session check (in AuthContext.jsx). If it times out, it shows the login page. This prevents the app from getting stuck on the loading screen.
3. **Custom localStorage adapter:** In `src/lib/supabase.js`, we use a custom storage adapter that wraps localStorage in try/catch to avoid Navigator Lock API issues during hot module reloads.
4. **No emoji in docs:** The professor specifically asked that documentation files (.md) should NOT contain emoji or AI-like formatting. Keep docs humanized and natural.
5. **Git:** All secrets are in .gitignore. Never commit .env files. The `scripts/check-db.mjs` and `scripts/setup-database.mjs` files were deleted because they had hardcoded secrets that triggered GitHub Push Protection.

## Sprint Context (for professor)

- Sprint 1: UI foundation, authentication, core pages
- Sprint 2: Settings, export, RBAC hardening, operational polish
- Sprint 3: Supabase PostgreSQL, FastAPI detection service, Roboflow integration, documentation
- Professor cares about: Sprint Goal, Progress Completed, Task Distribution, Challenges, Solutions, Plan for next sprint
- Sprint docs are in `docs/` folder

## Maintenance checklist (post-handoff)

1. **AIDetectionPage** must POST to `VITE_BACKEND_URL/api/detect` (not Roboflow from the browser).
2. **Demo user** `sultan@smartwh.io` should exist in Supabase Auth with confirmed email; use `backend/check_users.py` if needed.
3. **Roboflow** `ROBOFLOW_MODEL` + `ROBOFLOW_API_KEY` must be set in `backend/.env` for real inference.
4. **Database** seed with `python backend/seed.py` or SQL scripts when you need a clean baseline.
5. **Documentation** in `docs/` and `README.md` should stay aligned with the real stack (no claim of synthetic AI output).
