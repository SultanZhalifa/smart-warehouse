# Sprint 1 Report -- Smart Warehouse (Object Detection)

**Project:** Smart Warehouse -- AI-Powered Object Detection & Inventory Management  
**Team:** Group 5  
**Sprint:** Sprint 1 (Week 1)  
**Duration:** April 14 - April 17, 2026  

---

## Team Roles

| Role | Name | Student ID |
|------|------|------------|
| Product Owner | Risly Maria Theresia Worung | 001202400069 |
| Scrum Master | Sultan Zhalifunnas Musyaffa | 001202400200 |
| Developer | Misha Andalusia | 001202400040 |
| Developer | Fathir Barhouti Awlya | 001202400054 |

---

## 1. Sprint Goal

Our main goal for Sprint 1 was to get the entire project foundation in place and deliver the core features that users will interact with. Specifically, we aimed to:

- Set up the project architecture using Vite and React
- Build a custom dark themed UI with a consistent design system
- Implement user authentication with login page and role-based access
- Develop the main Dashboard with live stats and camera previews
- Create the app layout including sidebar navigation, header, and toast notifications
- Write out all 8 Product Backlog items with proper user stories

**Sprint Backlog:**
| # | Backlog Item | Story Points | Priority |
|---|-------------|-------------|----------|
| 1 | Dashboard Overview | 8 | High |
| 7 | User Authentication & Roles | 5 | Low (but needed first) |
| -- | Project Setup & Architecture | 3 | High |
| -- | Design System & Layout | 5 | High |

**Total Committed:** 21 story points

---

## 2. Progress Completed

All Sprint 1 items were completed on time. No items were carried over.

| Task | Status | Notes |
|------|--------|-------|
| Project Scaffolding | Done | Vite + React setup, installed react-router-dom, chart.js, lucide-react |
| Design System | Done | Created 50+ CSS custom properties for colors, spacing, typography, and animations |
| Login Page | Done | Glassmorphism design, form validation, 4 quick-access demo buttons |
| Dashboard Page | Done | 4 KPI cards with animations, stats row, 8-camera grid with detection overlays, activity timeline, system health section |
| Sidebar | Done | Collapsible with active state indicators, alert badge, user profile, logout |
| Header | Done | Page titles, search bar, notification bell, system status indicator |
| Toast System | Done | Success/warning/error/info toasts with auto-dismiss |
| Auth Context | Done | Login/logout, role management (Admin, Manager, Operator) |
| Warehouse Context | Done | useReducer-based state for inventory, alerts, activity log, zones |
| Mock Data | Done | 12 inventory items, 6 zones, 8 alerts, 8 cameras, 4 users |
| Routing | Done | Protected and public routes with React Router v6 |

### Extra -- Delivered Ahead of Schedule

The foundation went up quicker than expected so we kept going and finished the remaining backlog items too:

| Task | Was Planned For | Status |
|------|----------------|--------|
| Object Detection Page (canvas simulation) | Sprint 2 | Done |
| Inventory Management (full CRUD) | Sprint 2 | Done |
| Alert Center | Sprint 3 | Done |
| Analytics & Reporting (5 charts) | Sprint 3 | Done |
| Zone Management (floor plan) | Sprint 4 | Done |
| Activity Log (timeline view) | Sprint 4 | Done |

**Total Delivered:** 60 story points out of 21 committed (285% velocity)

---

## 3. Task Distribution

### Risly Maria Theresia Worung -- Product Owner
| Task | What She Did |
|------|-------------|
| Product Backlogs | Wrote all 8 backlogs with user stories, acceptance criteria, goals, and risk assessments |
| Prioritization | Ranked items into High, Medium, and Low priority tiers |
| Sprint Review | Tested every feature against the acceptance criteria and signed off |
| Documentation | Helped prepare sprint report materials |

### Sultan Zhalifunnas Musyaffa -- Scrum Master
| Task | What He Did |
|------|-------------|
| Sprint Planning | Ran the planning session, decided on 21 story points |
| Standup Coordination | Made sure everyone was aligned and unblocked |
| Project Setup | Initialized Vite + React, set up folder structure and routing |
| Design System | Built the entire CSS design system with 50+ tokens |
| Layout Components | Created Sidebar, Header, and the main Layout wrapper |

### Misha Andalusia -- Developer
| Task | What She Did |
|------|-------------|
| Login Page | Built the login UI with animated background, form validation, quick-access buttons |
| Dashboard | Developed KPI cards, camera feed grid with detection overlays, activity feed |
| Alert Center | Built the alert system with severity filtering and read/unread functionality |
| Zone Management | Created the interactive floor plan and zone detail cards |

### Fathir Barhouti Awlya -- Developer
| Task | What He Did |
|------|-------------|
| Auth System | Built AuthContext with login/logout and role-based user handling |
| Object Detection | Created the canvas simulation with moving bounding boxes and detection log |
| Inventory | Developed the CRUD interface with search, filters, sorting, and modal forms |
| Analytics | Integrated Chart.js with 5 different chart types |
| Activity Log | Built the timeline view with type filtering and search |

---

## 4. Challenges

| # | Problem | Impact | Severity |
|---|---------|--------|----------|
| 1 | PowerShell blocked npm commands because of execution policy | Couldnt run anything at the start | High |
| 2 | Some pages had wrong import paths (../../ instead of ../) | Pages crashed on load | High |
| 3 | Canvas performance with many animated objects | Could cause memory leaks if cleanup wasnt done right | Medium |
| 4 | Chart.js v4 needs you to register every module manually | Charts didnt render at first | Medium |
| 5 | Putting inventory, alerts, activity log, and toasts all in one context | Complex reducer, easy to introduce bugs | Medium |
| 6 | Sidebar collapse animation needed to sync with main content area | Visual glitch during transition | Low |
| 7 | Text readability on glass-effect backgrounds | Some text was hard to read on certain backgrounds | Low |

---

## 5. Solutions

| # | Problem | How We Fixed It |
|---|---------|----------------|
| 1 | PowerShell policy | Ran `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` to allow scripts in the current session |
| 2 | Wrong import paths | Went through every page file and fixed the relative paths manually |
| 3 | Canvas memory | Used useRef for animation frame IDs and cleaned up in useEffect return. Used useCallback for handlers |
| 4 | Chart.js registration | Explicitly registered CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend |
| 5 | Complex state | Designed the reducer with clear action types and auto-logging -- whenever you add or delete an item, it automatically creates an activity log entry |
| 6 | Sidebar animation | Used CSS transition on both the sidebar width and the main content margin-left so they move together |
| 7 | Text contrast | Used solid dark backgrounds behind text areas, semi-transparent card backgrounds, and bright accent colors to keep everything readable |

---

## 6. Plan for Week 2

Since we finished all 8 backlog items early, Sprint 2 is going to focus on enhancements and polish:

| # | Task | Priority | Assigned To | Points |
|---|------|----------|-------------|--------|
| 1 | Settings & Profile Page | Medium | Sultan | 8 |
| 2 | Export Functionality (CSV/PDF) | High | Misha | 5 |
| 3 | Real-time Notification System | High | Fathir | 5 |
| 4 | Role-Based Access Control | High | Risly | 5 |
| 5 | Advanced Inventory Filters | Medium | Sultan | 3 |

**Total Sprint 2 Points:** 23 (estimated)

---

## Sprint 1 Metrics

| Metric | Value |
|--------|-------|
| Story Points Committed | 21 |
| Story Points Completed | 60 |
| Sprint Velocity | 285% |
| Total Files Created | 22 |
| Lines of Code | ~3,500+ |
| Pages Delivered | 8 (Login + 7 app pages) |
| Components Built | 15+ |
| Bugs Found | 2 |
| Bugs Fixed | 2 |
| Unresolved Issues | 0 |

---

Report prepared by: Sultan Zhalifunnas Musyaffa (Scrum Master)  
Date: April 17, 2026
