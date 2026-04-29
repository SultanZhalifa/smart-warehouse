# Architecture Overview -- Smart Warehouse

This document describes the technical architecture of the Smart Warehouse application.

---

## System Architecture

```
+---------------------------------------------------+
|                    Browser (Client)              |
|  React (Vite) + React Router + Context           |
|  Supabase JS client  +  HTTP to FastAPI          |
+---------------------------------------------------+
          |                              |
          v                              v
+------------------+            +-------------------+
| Supabase         |            | FastAPI backend   |
| PostgreSQL + Auth|            | /api/detect       |
| REST + Realtime  |            | -> Roboflow API   |
+------------------+            +-------------------+
```

---

## State Management

We use React Context API with useReducer for global state. There are two contexts:

### AuthContext
- Manages user authentication state
- Stores current user object (name, email, role, avatar)
- Provides login() and logout() functions
- Used by LoginPage, Sidebar, RoleRoute, and all pages that need user info

### WarehouseContext
- Holds operational data loaded from Supabase after authentication (zones, cameras, inventory, alerts, and related views)
- Uses a reducer for UI actions such as toasts, sidebar state, and merging refreshed query results into state
- Page components call `web-frontend/src/lib/database.js` for CRUD and analytics; successful writes refresh context state where needed

```
WarehouseContext
  |
  |-- inventory[] -----> InventoryPage (CRUD via Supabase)
  |-- alerts[] --------> AlertsPage
  |-- activities[] ----> ActivityPage
  |-- toasts[] --------> ToastContainer
  |-- zones[] ---------> ZonesPage
  |-- cameras[] -------> DashboardPage, AIDetectionPage
```

---

## Routing

Routes are defined in App.jsx. We use two wrapper components:

- **PrivateRoute** -- Checks if user is logged in. Redirects to /login if not.
- **RoleRoute** -- Checks if logged-in user has the required role. Redirects to /dashboard if not authorized.

```
/login          -> LoginPage (public)
/               -> DashboardPage (any role)
/detection      -> DetectionPage (any role)
/inventory      -> InventoryPage (any role)
/alerts         -> AlertsPage (any role)
/analytics      -> AnalyticsPage (admin, manager only)
/zones          -> ZonesPage (any role)
/activity       -> ActivityPage (admin, manager only)
/settings       -> SettingsPage (any role)
```

---

## Data Flow

Typical CRUD or alert action:

```
User action on a page
       |
       v
Page calls database helper (web-frontend/src/lib/database.js)
       |
       v
Supabase PostgREST (RLS applies per authenticated user)
       |
       v
Context refresh + toast + UI update
```

AI pest scan:

```
AIDetectionPage -> POST /api/detect (FastAPI, multipart or base64)
       |
       v
Roboflow hosted inference (YOLOv8)
       |
       v
Backend persists detections, detection_results, alerts, activity_log via Supabase REST (service role)
       |
       v
Frontend refreshes warehouse data from Supabase
```

---

## Folder Structure

```
web-frontend/
 |-- src/
 |    |-- components/
 |    |    |-- common/
 |    |    |    |-- ToastContainer.jsx       # Toast notification display
 |    |    |-- layout/
 |    |    |    |-- Header.jsx              # Top bar with search
 |    |    |    |-- Layout.jsx              # Main wrapper
 |    |    |    |-- Sidebar.jsx             # Side navigation
 |    |    |-- icons/
 |    |    |    |-- PestIcons.jsx           # Snake, Cat, Gecko SVG components
 |    |
 |    |-- context/
 |    |    |-- AuthContext.jsx              # User auth state
 |    |    |-- WarehouseContext.jsx         # App data state
 |    |
 |    |-- lib/
 |    |    |-- firebase.js                  # Firebase client
 |    |    |-- database.js                  # Firestore queries (CRUD, analytics)
 |    |
 |    |-- pages/
 |    |    |-- Dashboard/
 |    |    |-- Detection/                   # Canvas visualization (not Roboflow)
 |    |    |-- AIDetection/                 # Real inference via backend
 |    |    |-- Inventory/                   # CRUD + export
 |    |    |-- Alerts/
 |    |    |-- Analytics/                   # Chart.js
 |    |    |-- Zones/                       # Floor plan
 |    |    |-- Activity/                    # Audit log + export
 |    |    |-- Settings/                    # 4-tab settings
 |    |    |-- Login/                       # Auth page
 |    |
 |    |-- services/
 |    |    |-- auth.js                      # Auth helpers
 |    |
 |    |-- utils/
 |    |    |-- exportUtils.js               # CSV/JSON/PDF export
 |    |
 |    |-- index.css                         # Design system tokens
 |    |-- App.jsx                           # Router + guards
 |    |-- main.jsx                          # Entry point
 |
 |-- public/                                # Static assets
 |-- package.json
 |-- vite.config.js
 |-- .env

ai-engine/
 |-- app.py                            # FastAPI + /api/detect endpoint
 |-- train.py                          # Model training script
 |-- requirements.txt                  # Python dependencies
 |-- models/                           # Directory for trained .pt models
 |-- .env.example
```

---

## Use Case Diagram

```
                    Smart Warehouse System
    +----------------------------------------------+
    |                                              |
    |   +--------+                                 |
    |   | Admin  |-----> View Dashboard            |
    |   |        |-----> Object Detection          |
    |   |        |-----> Manage Inventory          |
    |   |        |-----> View Alerts               |
    |   |        |-----> View Analytics            |
    |   |        |-----> Manage Zones              |
    |   |        |-----> View Activity Log         |
    |   |        |-----> Edit Settings             |
    |   |        |-----> Export Data (CSV)          |
    |   +--------+                                 |
    |                                              |
    |   +---------+                                |
    |   | Manager |-----> View Dashboard           |
    |   |         |-----> Object Detection         |
    |   |         |-----> Manage Inventory         |
    |   |         |-----> View Alerts              |
    |   |         |-----> View Analytics           |
    |   |         |-----> Manage Zones             |
    |   |         |-----> Edit Settings            |
    |   +---------+                                |
    |                                              |
    |   +----------+                               |
    |   | Operator |-----> View Dashboard          |
    |   |          |-----> Object Detection        |
    |   |          |-----> Manage Inventory        |
    |   |          |-----> View Alerts             |
    |   |          |-----> Manage Zones            |
    |   |          |-----> Edit Settings           |
    |   +----------+                               |
    |                                              |
    |   +--------+                                 |
    |   | System |-----> Generate Notifications    |
    |   |        |-----> Auto-log Activities       |
    |   |        |-----> Update Alert Counts       |
    |   +--------+                                 |
    |                                              |
    +----------------------------------------------+
```

---

## Technology Decisions

| Decision | Rationale |
|----------|-----------|
| Vite over CRA | Faster dev server startup and hot reload |
| Vanilla CSS over Tailwind | More control over the dark theme, plus the team was more familiar with CSS |
| useReducer over Redux | App state is not that complex, Context + useReducer is simpler and doesnt need extra dependencies |
| Chart.js over D3 | Easier to use for standard chart types, good React wrapper available |
| Canvas on DetectionPage | Smooth animation for the warehouse visualization prototype |
| Supabase PostgreSQL | Managed Postgres, auth, and RLS in one place |
| FastAPI + Roboflow | Hosted YOLOv8 inference without bundling weights in the browser |

---

Date: April 28, 2026
