# Architecture Overview -- Smart Warehouse

This document describes the technical architecture of the Smart Warehouse application.

---

## System Architecture

```
+---------------------------------------------------+
|                    Browser (Client)                |
|                                                   |
|  +-------+  +----------+  +-------------------+  |
|  | React |  | React    |  | Chart.js          |  |
|  | Router|  | Context  |  | (Visualizations)  |  |
|  +-------+  +----------+  +-------------------+  |
|       |          |                |                |
|  +-------------------------------------------------+
|  |            Component Tree                       |
|  |                                                 |
|  |  App.jsx                                        |
|  |    |-- LoginPage (public)                       |
|  |    |-- Layout                                   |
|  |         |-- Sidebar                             |
|  |         |-- Header                              |
|  |         |-- ToastContainer                      |
|  |         |-- LiveEventSimulator                  |
|  |         |-- [Page Component]                    |
|  |              |-- DashboardPage                  |
|  |              |-- DetectionPage                  |
|  |              |-- InventoryPage                  |
|  |              |-- AlertsPage                     |
|  |              |-- AnalyticsPage (admin/manager)  |
|  |              |-- ZonesPage                      |
|  |              |-- ActivityPage (admin/manager)   |
|  |              |-- SettingsPage                   |
|  +-------------------------------------------------+
|                                                   |
+---------------------------------------------------+
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
- Manages all application data
- Uses a reducer with these action types:
  - ADD_INVENTORY_ITEM, UPDATE_INVENTORY_ITEM, DELETE_INVENTORY_ITEM
  - MARK_ALERT_READ, MARK_ALL_ALERTS_READ
  - ADD_ACTIVITY
  - ADD_TOAST, REMOVE_TOAST
- Automatically logs activities when inventory changes happen

```
WarehouseContext
  |
  |-- inventory[] -----> InventoryPage (CRUD)
  |-- alerts[] --------> AlertsPage (read/filter)
  |-- activities[] ----> ActivityPage (timeline)
  |-- toasts[] --------> ToastContainer (auto-dismiss)
  |-- zones[] ---------> ZonesPage (read-only)
  |-- cameras[] -------> DashboardPage, DetectionPage
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

```
User Action (click, form submit)
       |
       v
Page Component calls dispatch()
       |
       v
WarehouseContext Reducer processes action
       |
       +---> Updates inventory/alerts/activities state
       +---> Auto-creates activity log entry (for CRUD)
       +---> Fires toast notification
       |
       v
React re-renders affected components
```

For the real-time notification system:

```
LiveEventSimulator (runs in Layout)
       |
       | setInterval (25-45 seconds, randomized)
       v
Generates random event (detection, alert, camera, inventory)
       |
       +---> dispatch(ADD_ACTIVITY) -> updates Activity Log
       +---> dispatch(ADD_TOAST) -> shows toast popup
```

---

## Folder Structure

```
src/
 |-- components/
 |    |-- common/
 |    |    |-- LiveEventSimulator.jsx   # Headless event generator
 |    |    |-- ToastContainer.jsx       # Toast notification display
 |    |-- layout/
 |         |-- Header.jsx              # Top bar with search
 |         |-- Layout.jsx              # Main wrapper
 |         |-- Sidebar.jsx             # Side navigation
 |
 |-- context/
 |    |-- AuthContext.jsx              # User auth state
 |    |-- WarehouseContext.jsx         # App data state
 |
 |-- data/
 |    |-- mockData.js                  # All sample data
 |
 |-- pages/
 |    |-- DashboardPage.jsx
 |    |-- DetectionPage.jsx            # Canvas simulation
 |    |-- InventoryPage.jsx            # CRUD + export
 |    |-- AlertsPage.jsx
 |    |-- AnalyticsPage.jsx            # Chart.js
 |    |-- ZonesPage.jsx                # Floor plan
 |    |-- ActivityPage.jsx             # Audit log + export
 |    |-- SettingsPage.jsx             # 4-tab settings
 |
 |-- utils/
 |    |-- exportUtils.js               # CSV/JSON/PDF export
 |
 |-- index.css                         # Design system tokens
 |-- App.jsx                           # Router + guards
 |-- main.jsx                          # Entry point
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
| Canvas over SVG for detection | Better performance for animated bounding boxes at 30fps |
| Mock data over backend | Time constraint -- building a proper backend would take another sprint |

---

Date: April 21, 2026
