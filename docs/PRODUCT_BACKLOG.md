# Product Backlog — Smart Warehouse (Object Detection)

**Product Owner:** Risly Maria Theresia Worung  
**Last Updated:** April 17, 2026

---

## Backlog #1 — Dashboard Overview

| Field | Detail |
|-------|--------|
| **ID** | PBI-001 |
| **Priority** | ⭐ HIGH |
| **Story Points** | 8 |
| **Sprint** | Sprint 1 |
| **Status** | ✅ Done |

**User Story:**  
> As a warehouse manager, I want to see a real-time dashboard so I can monitor operations at a glance.

**Goal:**  
Create the main dashboard showing warehouse KPIs, live stats, camera feeds, and system health indicators.

**Features:**
- 4 KPI cards: Detections Today, Total Inventory, Active Alerts, Cameras Online
- Stats pill row: Accuracy, Processing Time, Weekly/Monthly counts
- Live camera feed grid (8 cameras) with detection overlays
- Recent activity timeline
- System health bars (CPU, Memory, GPU, Storage)

**Acceptance Criteria:**
- [ ] Dashboard loads in under 2 seconds
- [ ] All KPI cards show accurate data with trend indicators
- [ ] Camera feeds display detection bounding boxes
- [ ] Activity feed shows the latest 8 events
- [ ] Responsive on tablet and desktop viewports

**Bug Risks:**
- Data not refreshing in real-time
- Layout breaking on smaller screens
- Camera feed grid misalignment

---

## Backlog #2 — Object Detection Interface

| Field | Detail |
|-------|--------|
| **ID** | PBI-002 |
| **Priority** | ⭐ HIGH |
| **Story Points** | 13 |
| **Sprint** | Sprint 2 (delivered Sprint 1) |
| **Status** | ✅ Done |

**User Story:**  
> As a warehouse operator, I want to see detected objects with bounding boxes so I can verify inventory placement.

**Goal:**  
Build the core object detection visualization with camera feed simulation using HTML5 Canvas.

**Features:**
- Simulated camera feed with animated objects
- Bounding box overlays with corner markers
- Object labels with confidence scores (YOLOv8 style)
- Detection log sidebar with real-time entries
- Camera selection dropdown
- Play/Pause and Grid toggle controls
- Model statistics (accuracy, inference time, FPS)

**Acceptance Criteria:**
- [ ] Detection simulation runs at 30fps smoothly
- [ ] Objects labeled with class name and confidence percentage
- [ ] Detection log updates in real-time
- [ ] Camera can be switched via dropdown
- [ ] Play/Pause controls work correctly

**Bug Risks:**
- Canvas rendering performance issues with many objects
- Bounding boxes misaligned with animated objects
- Memory leak if animation frame not properly cleaned up

---

## Backlog #3 — Inventory Management

| Field | Detail |
|-------|--------|
| **ID** | PBI-003 |
| **Priority** | ⭐ HIGH |
| **Story Points** | 8 |
| **Sprint** | Sprint 2 (delivered Sprint 1) |
| **Status** | ✅ Done |

**User Story:**  
> As a warehouse staff member, I want to manage inventory items so I can keep track of stock levels.

**Goal:**  
Full CRUD system for warehouse inventory with search, filtering, and sorting capabilities.

**Features:**
- Stats row: Unique Items, Total Units, Low Stock, Out of Stock
- Search by name or ID
- Category filter pills (9 categories)
- Sortable columns (ID, Name, Quantity)
- Add/Edit items via modal form
- Delete with confirmation
- Status badges (In Stock, Low Stock, Out of Stock)
- Toast notifications for all actions

**Acceptance Criteria:**
- [ ] All CRUD operations work correctly
- [ ] Search returns results in under 500ms
- [ ] Status auto-updates based on quantity vs minimum stock
- [ ] Toast notification appears for every action
- [ ] Table is sortable by multiple columns

**Bug Risks:**
- Race conditions on concurrent state updates
- Search not filtering correctly with special characters
- Status not recalculating after quantity edit

---

## Backlog #4 — Real-Time Alert System

| Field | Detail |
|-------|--------|
| **ID** | PBI-004 |
| **Priority** | 🟡 MEDIUM |
| **Story Points** | 5 |
| **Sprint** | Sprint 3 (delivered Sprint 1) |
| **Status** | ✅ Done |

**User Story:**  
> As a manager, I want to receive alerts when unusual objects are detected or thresholds are exceeded so I can take immediate action.

**Goal:**  
Notification system for detection events, stock alerts, and warehouse anomalies.

**Features:**
- Severity stats cards (Critical, Warnings, Unread, Resolved)
- Filter tabs: All, Critical, Warning, Info
- Alert cards with severity left border and icons
- Mark as Read / Mark All Read functionality
- Show/Hide read alerts toggle
- Zone-linked alert details with timestamps
- Severity badges (Critical, Warning, Info)

**Acceptance Criteria:**
- [ ] Alerts display with correct severity color coding
- [ ] Unread alerts show blue dot indicator
- [ ] Mark as Read works on individual and bulk
- [ ] Filter tabs correctly filter by severity
- [ ] Alert count badge appears in sidebar navigation

**Bug Risks:**
- Alert flooding when many detections occur simultaneously
- Notifications not dismissed properly
- Badge count not syncing with actual unread count

---

## Backlog #5 — Analytics and Reporting

| Field | Detail |
|-------|--------|
| **ID** | PBI-005 |
| **Priority** | 🟡 MEDIUM |
| **Story Points** | 8 |
| **Sprint** | Sprint 3 (delivered Sprint 1) |
| **Status** | ✅ Done |

**User Story:**  
> As a manager, I want to view analytics so I can make data-driven decisions about warehouse operations.

**Goal:**  
Charts and reports for detection patterns, inventory trends, and operational efficiency using Chart.js.

**Features:**
- Detection trend line chart (hourly)
- Weekly distribution bar chart (color-coded)
- Object classification doughnut chart
- Zone activity bar chart
- Inventory flow line chart (items in vs items out)
- Date range tabs (Day / Week / Month / Year)
- Export button

**Acceptance Criteria:**
- [ ] All 5 charts render correctly with sample data
- [ ] Date range tabs switch data context
- [ ] Charts are responsive and resize properly
- [ ] Tooltips show detailed data on hover
- [ ] Export button is present and styled

**Bug Risks:**
- Charts not rendering with large datasets
- Incorrect aggregation calculations
- Chart.js module registration errors

---

## Backlog #6 — Zone Management

| Field | Detail |
|-------|--------|
| **ID** | PBI-006 |
| **Priority** | 🟡 MEDIUM |
| **Story Points** | 8 |
| **Sprint** | Sprint 4 (delivered Sprint 1) |
| **Status** | ✅ Done |

**User Story:**  
> As a warehouse planner, I want to define and monitor zones so objects are tracked in their correct locations.

**Goal:**  
Define and manage warehouse zones with detection rules and utilization tracking per zone.

**Features:**
- Interactive warehouse floor plan with labeled zones
- 6 zones: Receiving, Storage, Processing, Shipping, Hazardous, Cold Storage
- Animated activity dots showing simulated movement
- Utilization percentage per zone
- Zone detail cards with capacity/used/available stats
- Color-coded zones with status indicators (Active, Warning)
- Utilization progress bars

**Acceptance Criteria:**
- [ ] Floor plan renders all 6 zones correctly
- [ ] Zones show accurate utilization percentages
- [ ] Hover effect highlights zones
- [ ] Zone cards match floor plan data
- [ ] Warning status displays for zones exceeding thresholds

**Bug Risks:**
- Zone boundaries overlapping on the map
- Map not scaling properly on different screen sizes
- Utilization calculation errors

---

## Backlog #7 — User Authentication and Roles

| Field | Detail |
|-------|--------|
| **ID** | PBI-007 |
| **Priority** | 🔵 LOW |
| **Story Points** | 5 |
| **Sprint** | Sprint 1 |
| **Status** | ✅ Done |

**User Story:**  
> As an admin, I want to manage user access so only authorized personnel can modify settings.

**Goal:**  
Login system with role-based access control for different user types.

**Features:**
- Login page with email/password form
- Show/hide password toggle
- Form validation with error messages
- Loading state with spinner animation
- Quick-access demo buttons for all 4 team members
- Role-based user context (Admin, Manager, Operator)
- Protected routes — redirect to login if not authenticated
- Logout functionality
- Session state in React context

**Acceptance Criteria:**
- [ ] Login works with correct credentials
- [ ] Invalid credentials show error message
- [ ] Protected routes redirect to login when not authenticated
- [ ] User avatar and role display in sidebar
- [ ] Logout clears session and redirects to login

**Bug Risks:**
- Session token expiry not handled
- Unauthorized access to admin-only routes
- Login form not clearing on error

---

## Backlog #8 — Activity Log and Audit Trail

| Field | Detail |
|-------|--------|
| **ID** | PBI-008 |
| **Priority** | 🔵 LOW |
| **Story Points** | 5 |
| **Sprint** | Sprint 4 (delivered Sprint 1) |
| **Status** | ✅ Done |

**User Story:**  
> As an auditor, I want to review all system activities so I can ensure compliance and trace actions.

**Goal:**  
Complete logging of all system activities in a timeline format for audit purposes.

**Features:**
- Timeline view with type-based icons and colors
- Search by user, action, or target
- Type filter pills (Detection, Create, Update, Delete, Alert, Export, System, Approval)
- Activity count summary at bottom
- Automatic logging on CRUD operations (via WarehouseContext reducer)
- Timestamp formatting

**Acceptance Criteria:**
- [ ] All user actions are logged automatically
- [ ] Search returns matching activities
- [ ] Type filters correctly filter the timeline
- [ ] New CRUD actions appear in the log immediately
- [ ] Timestamps are formatted correctly

**Bug Risks:**
- Log entries missing for some action types
- Performance degradation with very large log volumes
- Search not matching partial strings

---

## Backlog Priority Matrix

```
           HIGH IMPACT
              │
    ┌─────────┼─────────┐
    │  PBI-001 │ PBI-002 │
    │  PBI-003 │         │  HIGH PRIORITY
    ├─────────┼─────────┤
    │  PBI-004 │ PBI-005 │
    │  PBI-006 │         │  MEDIUM PRIORITY
    ├─────────┼─────────┤
    │  PBI-007 │ PBI-008 │  LOW PRIORITY
    └─────────┼─────────┘
              │
           LOW IMPACT
```

---

*Maintained by: Risly Maria Theresia Worung (Product Owner)*  
*Last Updated: April 17, 2026*
