# SMART WAREHOUSE (Object Detection) — Sprint 1 Report

**Project:** Smart Warehouse — AI-Powered Object Detection & Inventory Management System  
**Team:** Group 5  
**Sprint:** Sprint 1 (Week 1)  
**Sprint Duration:** April 14 – April 17, 2026  

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

The primary goal of Sprint 1 was to **establish the project foundation and deliver the core user-facing infrastructure**, including:

- Set up the complete project architecture (Vite + React)
- Implement the design system with a premium dark cyber-themed UI
- Build the authentication system (Login page with role-based access)
- Develop the main Dashboard with KPI cards, live camera feed previews, and activity feed
- Create the application layout (Sidebar navigation, Header, Toast notification system)
- Define and document all 8 Product Backlogs with detailed user stories

**Sprint Backlog Items:**
| # | Backlog Item | Story Points | Priority |
|---|-------------|-------------|----------|
| 1 | Dashboard Overview | 8 | ⭐ High |
| 7 | User Authentication & Roles | 5 | 🔵 Low (but foundational) |
| — | Project Setup & Architecture | 3 | ⭐ High |
| — | Design System & Layout | 5 | ⭐ High |

**Total Story Points Committed:** 21

---

## 2. Progress Completed

### ✅ All Sprint 1 items were completed successfully.

| Task | Status | Details |
|------|--------|---------|
| Project Scaffolding | ✅ Done | Vite + React initialized, dependencies installed (react-router-dom, chart.js, lucide-react) |
| Design System | ✅ Done | Complete CSS design tokens — 50+ custom properties for colors, gradients, spacing, typography, animations |
| Login Page | ✅ Done | Glassmorphism design, form validation, quick-access demo users for all 4 team members |
| Dashboard Page | ✅ Done | 4 animated KPI cards, stats pill row, 8-camera live feed grid with detection overlays, recent activity timeline, system health bars |
| Sidebar Navigation | ✅ Done | Collapsible sidebar with active indicators, alert badge counter, user profile section, logout button |
| Header Component | ✅ Done | Dynamic page titles, search bar, notification bell with unread count, system status indicator |
| Toast Notification System | ✅ Done | Success/warning/error/info toasts with auto-dismiss and severity icons |
| Auth Context | ✅ Done | Login/logout flow, role-based user management (Admin, Manager, Operator) |
| Warehouse Context | ✅ Done | Global state management with useReducer for inventory, alerts, activity log, zones |
| Mock Data Layer | ✅ Done | Comprehensive mock data for inventory (12 items), zones (6), alerts (8), cameras (8), users (4) |
| Routing Setup | ✅ Done | Protected routes, public routes, React Router v6 configuration |

### Additional pages completed ahead of schedule:

Since the foundation was set up efficiently, the team pushed ahead and completed Sprint 2–4 backlog items:

| Task | Original Sprint | Status |
|------|----------------|--------|
| Object Detection Page (canvas simulation) | Sprint 2 | ✅ Done |
| Inventory Management (full CRUD) | Sprint 2 | ✅ Done |
| Alert Center | Sprint 3 | ✅ Done |
| Analytics & Reporting (5 charts) | Sprint 3 | ✅ Done |
| Zone Management (floor plan) | Sprint 4 | ✅ Done |
| Activity Log (timeline view) | Sprint 4 | ✅ Done |

**Total Story Points Completed:** 60 / 21 committed (285% velocity)

---

## 3. Task Distribution

### Risly Maria Theresia Worung — Product Owner
| Task | Description |
|------|-------------|
| Product Backlog Definition | Defined all 8 product backlogs with user stories, goals, bugs, features, and acceptance criteria |
| Priority Assignment | Ranked backlog items into High / Medium / Low priority tiers |
| Sprint Review | Reviewed and accepted all completed features against acceptance criteria |
| Stakeholder Communication | Documented sprint reports and prepared presentation materials |

### Sultan Zhalifunnas Musyaffa — Scrum Master
| Task | Description |
|------|-------------|
| Sprint Planning | Facilitated sprint planning session, committed to 21 story points |
| Daily Standup Coordination | Ensured team alignment and removed blockers |
| Project Architecture | Set up Vite + React project, routing, and folder structure |
| Design System | Created the complete CSS design system with 50+ design tokens |
| Layout Components | Built Sidebar, Header, and Layout wrapper with responsive design |

### Misha Andalusia — Developer
| Task | Description |
|------|-------------|
| Login Page | Implemented login UI with animated background, form validation, quick-access buttons |
| Dashboard Page | Built KPI cards, live camera feed grid with detection overlays, activity feed |
| Alert Center | Developed alert system with severity filtering, read/unread state, and alert cards |
| Zone Management | Created interactive warehouse floor plan and zone detail cards |

### Fathir Barhouti Awlya — Developer
| Task | Description |
|------|-------------|
| Auth System | Implemented AuthContext with login/logout and role-based access control |
| Object Detection Page | Built canvas simulation with animated bounding boxes, detection log, model stats |
| Inventory Management | Developed full CRUD system with search, category filters, sortable table, modal forms |
| Analytics Page | Integrated Chart.js with 5 visualizations (line, bar, doughnut charts) |
| Activity Log | Created timeline view with type-based filtering and search |

---

## 4. Challenges

| # | Challenge | Impact | Severity |
|---|-----------|--------|----------|
| 1 | **PowerShell execution policy blocked npm/npx commands** | Could not run project scaffolding or install dependencies initially | High |
| 2 | **Relative import paths incorrect** | Pages using `../../context/` instead of `../context/` caused module resolution failures | High |
| 3 | **Canvas performance for object detection simulation** | requestAnimationFrame + multiple animated objects caused potential memory leaks if not cleaned up properly | Medium |
| 4 | **Chart.js module registration** | Chart.js v4+ requires explicit registration of scales, elements, and plugins — initial renders failed | Medium |
| 5 | **State management complexity** | Managing inventory CRUD, alerts, activity log, and toast notifications in a single context required careful reducer design | Medium |
| 6 | **Responsive layout with collapsible sidebar** | CSS transitions for sidebar width + main content margin needed precise coordination | Low |
| 7 | **Glassmorphism + dark theme contrast** | Ensuring text readability on glass-effect backgrounds with varying opacity levels | Low |

---

## 5. Solutions

| # | Challenge | Solution Applied |
|---|-----------|-----------------|
| 1 | PowerShell execution policy | Applied `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` to enable script execution within the current session without modifying system-wide policy |
| 2 | Incorrect import paths | Systematically audited all page files and corrected paths from `../../context/` to `../context/` and `../../data/` to `../data/` to match the actual directory structure |
| 3 | Canvas performance | Used `useRef` for animation frame IDs and proper cleanup in `useEffect` return function; used `useCallback` for event handlers to prevent unnecessary re-renders |
| 4 | Chart.js registration | Explicitly registered all required components: `CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend` at the top of the Analytics page |
| 5 | State management | Designed a centralized `warehouseReducer` with clearly defined action types (`ADD_INVENTORY_ITEM`, `UPDATE_INVENTORY_ITEM`, etc.) and derived state (auto-logging activities on CRUD operations) |
| 6 | Responsive sidebar | Used CSS custom properties (`--sidebar-width`, `--sidebar-collapsed`) with CSS `transition` on both sidebar width and main content `margin-left` for smooth coordination |
| 7 | Dark theme contrast | Implemented a multi-layer approach: dark solid backgrounds (`#0a0e1a`), semi-transparent card backgrounds (`rgba(17,24,39,0.7)`), and bright accent colors (`#00d4ff`) with sufficient contrast ratios |

---

## 6. Plan for Week 2

### Sprint 2 Goals

Since all 8 backlog items were completed ahead of schedule in Sprint 1, Sprint 2 will focus on **enhancement, polish, and advanced features**:

| # | Task | Priority | Assigned To | Story Points |
|---|------|----------|-------------|-------------|
| 1 | **Real-time WebSocket Integration** | ⭐ High | Fathir | 8 |
|   | Replace mock data polling with simulated WebSocket events for live detection updates | | | |
| 2 | **Export Functionality** | ⭐ High | Misha | 5 |
|   | Implement CSV/PDF export for analytics reports, inventory lists, and activity logs | | | |
| 3 | **Dark/Light Theme Toggle** | 🟡 Medium | Sultan | 5 |
|   | Add theme switcher with persistent preference in localStorage | | | |
| 4 | **Advanced Inventory Filters** | 🟡 Medium | Fathir | 3 |
|   | Add date range filtering, multi-select zone filter, and stock level slider | | | |
| 5 | **Notification Sound System** | 🟡 Medium | Misha | 3 |
|   | Add audio alerts for critical notifications with volume control | | | |
| 6 | **User Profile Page** | 🔵 Low | Sultan | 3 |
|   | Build user profile editing page with avatar, settings, and activity history | | | |
| 7 | **Unit Testing Setup** | 🔵 Low | Fathir | 5 |
|   | Set up Vitest + React Testing Library with tests for critical components | | | |
| 8 | **Documentation & README** | 🔵 Low | Risly | 3 |
|   | Complete README.md with setup instructions, architecture diagram, and screenshots | | | |

**Total Sprint 2 Story Points:** 35

### Sprint 2 Schedule

| Day | Activity |
|-----|----------|
| Monday | Sprint Planning + Task assignment |
| Tue–Thu | Development (Daily standups at 9:00 AM) |
| Friday | Sprint Review + Sprint Retrospective |

---

## Sprint 1 Metrics Summary

| Metric | Value |
|--------|-------|
| Story Points Committed | 21 |
| Story Points Completed | 60 |
| Sprint Velocity | 285% |
| Total Files Created | 22 |
| Total Lines of Code | ~3,500+ |
| Pages Delivered | 8 (Login + 7 app pages) |
| Components Built | 15+ |
| Bugs Found | 2 (import paths, PowerShell policy) |
| Bugs Fixed | 2 |
| Unresolved Issues | 0 |

---

*Report prepared by: Sultan Zhalifunnas Musyaffa (Scrum Master)*  
*Date: April 17, 2026*
