# Product Backlog -- Smart Warehouse (Object Detection)

**Product Owner:** Risly Maria Theresia Worung  
**Last Updated:** April 21, 2026

---

## Backlog #1 -- Dashboard Overview

| Field | Detail |
|-------|--------|
| **ID** | PBI-001 |
| **Priority** | HIGH |
| **Story Points** | 8 |
| **Sprint** | Sprint 1 |
| **Status** | Done |

**User Story:**  
> As a warehouse manager, I want to see a real-time dashboard so I can monitor operations at a glance.

**Goal:**  
Create the main dashboard that shows warehouse KPIs, live camera feeds, and system health at a glance.

**Features:**
- 4 KPI cards showing Detections Today, Total Inventory, Active Alerts, Cameras Online
- Stats row with Accuracy, Processing Time, Weekly and Monthly counts
- Live camera feed grid (8 cameras) with detection overlays
- Recent activity timeline
- System health bars for CPU, Memory, GPU, Storage

**Acceptance Criteria:**
- Dashboard loads in under 2 seconds
- All KPI cards display accurate data with trend indicators
- Camera feeds show detection bounding boxes
- Activity feed shows the latest 8 events
- Layout works on both tablet and desktop screens

**Known Risks:**
- Data might not refresh in real-time without WebSocket
- Layout could break on smaller screens
- Camera feed grid alignment issues

---

## Backlog #2 -- Object Detection Interface

| Field | Detail |
|-------|--------|
| **ID** | PBI-002 |
| **Priority** | HIGH |
| **Story Points** | 13 |
| **Sprint** | Sprint 2 (delivered in Sprint 1) |
| **Status** | Done |

**User Story:**  
> As a warehouse operator, I want to see detected objects with bounding boxes so I can verify inventory placement.

**Goal:**  
Build the object detection visualization using HTML5 Canvas to simulate a live camera feed with detected objects.

**Features:**
- Simulated camera feed with animated objects moving around
- Bounding box overlays with corner markers
- Labels showing object class and confidence score (like YOLOv8)
- Detection log sidebar that updates in real time
- Camera selection dropdown
- Play/Pause and Grid toggle controls
- Model statistics panel (accuracy, inference time, FPS)

**Acceptance Criteria:**
- Simulation runs smoothly at 30fps
- Each detected object has a label and confidence percentage
- Detection log updates as new objects appear
- Camera switching works via dropdown
- Play/Pause toggle functions correctly

**Known Risks:**
- Canvas rendering could slow down with too many objects
- Bounding boxes might drift from animated object positions
- Potential memory leak if animation frames arent cleaned up

---

## Backlog #3 -- Inventory Management

| Field | Detail |
|-------|--------|
| **ID** | PBI-003 |
| **Priority** | HIGH |
| **Story Points** | 8 |
| **Sprint** | Sprint 2 (delivered in Sprint 1) |
| **Status** | Done |

**User Story:**  
> As a warehouse staff member, I want to manage inventory items so I can keep track of stock levels.

**Goal:**  
Full CRUD system for warehouse inventory with search, filtering, sorting, and export.

**Features:**
- Summary row: Unique Items, Total Units, Low Stock, Out of Stock counts
- Search bar (by name or ID)
- Category filter pills (9 categories)
- Zone filter dropdown (6 zones)
- Sortable table columns (ID, Name, Quantity)
- Add and Edit items via modal form
- Delete with toast confirmation
- Status badges that update automatically based on quantity vs minimum
- Export to CSV

**Acceptance Criteria:**
- All CRUD operations work without errors
- Search responds quickly (under 500ms)
- Status recalculates automatically when quantity changes
- Toast notification appears for every action
- Table sorting works on multiple columns
- CSV export includes only the currently filtered items

**Known Risks:**
- Possible race conditions if multiple state updates happen at once
- Search might not handle special characters well
- Status calculation could be wrong after editing quantity

---

## Backlog #4 -- Real-Time Alert System

| Field | Detail |
|-------|--------|
| **ID** | PBI-004 |
| **Priority** | MEDIUM |
| **Story Points** | 5 |
| **Sprint** | Sprint 3 (delivered in Sprint 1) |
| **Status** | Done |

**User Story:**  
> As a manager, I want to receive alerts when unusual things are detected or thresholds are exceeded so I can take action.

**Goal:**  
Alert system for detection events, stock warnings, and warehouse anomalies.

**Features:**
- Summary cards for Critical, Warnings, Unread, and Resolved counts
- Filter tabs: All, Critical, Warning, Info
- Alert cards with severity color on the left border
- Mark as Read for individual alerts
- Mark All Read button
- Toggle to show or hide read alerts
- Zone information and timestamps on each alert
- Unread count badge in sidebar

**Acceptance Criteria:**
- Alerts show correct severity colors (red for critical, yellow for warning, blue for info)
- Unread alerts have a dot indicator
- Mark as Read works for single and bulk operations
- Filter tabs correctly show only the selected severity
- Sidebar badge reflects the actual unread count

**Known Risks:**
- Too many alerts at once could flood the UI
- Notification dismissal might not work consistently
- Badge count could desync from the actual unread count

---

## Backlog #5 -- Analytics and Reporting

| Field | Detail |
|-------|--------|
| **ID** | PBI-005 |
| **Priority** | MEDIUM |
| **Story Points** | 8 |
| **Sprint** | Sprint 3 (delivered in Sprint 1) |
| **Status** | Done |

**User Story:**  
> As a manager, I want to view analytics so I can make data-driven decisions about warehouse operations.

**Goal:**  
Charts and reports for detection patterns, inventory trends, and zone activity using Chart.js.

**Features:**
- Hourly detection trend (line chart)
- Weekly distribution (bar chart with color coding)
- Object classification breakdown (doughnut chart)
- Zone activity comparison (bar chart)
- Inventory flow over time (line chart -- items in vs items out)
- Date range tabs (Day / Week / Month / Year)
- Export button

**Acceptance Criteria:**
- All 5 charts render with sample data
- Date range tabs switch the data context
- Charts resize properly on different screen sizes
- Tooltips show detailed values on hover
- Export button is visible and styled correctly

**Known Risks:**
- Charts could be slow with large datasets
- Aggregation calculations might be off
- Chart.js module registration errors (v4+ requires explicit registration)

---

## Backlog #6 -- Zone Management

| Field | Detail |
|-------|--------|
| **ID** | PBI-006 |
| **Priority** | MEDIUM |
| **Story Points** | 8 |
| **Sprint** | Sprint 4 (delivered in Sprint 1) |
| **Status** | Done |

**User Story:**  
> As a warehouse planner, I want to define and monitor zones so objects get tracked in the right locations.

**Goal:**  
Interactive zone management with a visual floor plan and utilization tracking.

**Features:**
- Warehouse floor plan with 6 labeled zones
- Zones: Receiving, Storage, Processing, Shipping, Hazardous, Cold Storage
- Animated dots showing simulated activity in each zone
- Utilization percentage displayed inside each zone
- Detail cards below the map with capacity, used, and available stats
- Color-coded zones with active/warning status indicators
- Progress bars for utilization

**Acceptance Criteria:**
- Floor plan renders all 6 zones with labels
- Utilization percentages are accurate
- Hovering over a zone highlights it
- Zone cards match the data shown on the floor plan
- Warning indicator shows for zones above threshold

**Known Risks:**
- Zone boundaries could overlap on the map
- Map might not scale well on different screen sizes
- Utilization calculation errors

---

## Backlog #7 -- User Authentication and Roles

| Field | Detail |
|-------|--------|
| **ID** | PBI-007 |
| **Priority** | LOW |
| **Story Points** | 5 |
| **Sprint** | Sprint 1 |
| **Status** | Done |

**User Story:**  
> As an admin, I want to manage user access so only authorized people can modify settings.

**Goal:**  
Login system with role-based access control for three user types.

**Features:**
- Login page with email and password fields
- Show/hide password toggle
- Form validation with error messages
- Loading spinner during authentication
- Quick-access buttons for all 4 team members (demo mode)
- Three roles: Admin, Manager, Operator
- Protected routes that redirect to login if not authenticated
- Role-based route guards (added in Sprint 2)
- Logout functionality
- Session state stored in React context

**Acceptance Criteria:**
- Login works with valid credentials
- Wrong credentials show an error message
- Unauthenticated users get redirected to the login page
- User avatar and role display in the sidebar
- Logout clears the session and goes back to login
- Operators cannot access Analytics or Activity Log pages

**Known Risks:**
- No token expiry handling (since theres no real backend)
- Users could bypass route guards by typing URLs directly (fixed in Sprint 2)
- Login form might not clear properly after an error

---

## Backlog #8 -- Activity Log and Audit Trail

| Field | Detail |
|-------|--------|
| **ID** | PBI-008 |
| **Priority** | LOW |
| **Story Points** | 5 |
| **Sprint** | Sprint 4 (delivered in Sprint 1) |
| **Status** | Done |

**User Story:**  
> As an auditor, I want to review all system activities so I can ensure compliance and trace actions back to users.

**Goal:**  
Logging system that records everything that happens in the app, displayed in a timeline format.

**Features:**
- Timeline view with different icons and colors per action type
- Search by user, action, or target
- Filter pills for types: Detection, Create, Update, Delete, Alert, Export, System, Approval
- Activity count summary
- Automatic logging whenever someone does a CRUD operation (handled in the reducer)
- Timestamp formatting
- Export to CSV

**Acceptance Criteria:**
- All user actions get logged automatically
- Search finds matching activities
- Type filters work correctly
- New actions show up in the log right away
- Timestamps are formatted in a readable way
- Export button downloads the filtered log as CSV

**Known Risks:**
- Some action types might not get logged
- Performance could drop with a very large log
- Search might miss partial string matches

---

## Priority Matrix

```
           HIGH IMPACT
               |
     +---------+---------+
     |  PBI-001 | PBI-002 |
     |  PBI-003 |         |  HIGH PRIORITY
     +---------+---------+
     |  PBI-004 | PBI-005 |
     |  PBI-006 |         |  MEDIUM PRIORITY
     +---------+---------+
     |  PBI-007 | PBI-008 |  LOW PRIORITY
     +---------+---------+
               |
           LOW IMPACT
```

---

Maintained by: Risly Maria Theresia Worung (Product Owner)  
Last Updated: April 21, 2026
