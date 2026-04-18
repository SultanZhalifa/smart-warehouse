# Daily Standup Log — Sprint 1

**Project:** Smart Warehouse (Object Detection)  
**Sprint:** Sprint 1 (Week 1)  
**Facilitator:** Sultan Zhalifunnas Musyaffa (Scrum Master)

---

## Day 1 — Monday, April 14, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** N/A — Sprint start
- **Today:** Define all 8 product backlogs with detailed user stories, goals, features, and acceptance criteria. Assign priority levels (High/Medium/Low).
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** N/A — Sprint start
- **Today:** Facilitate sprint planning session. Set up project repository, initialize Vite + React, install dependencies, create folder structure.
- **Blockers:** PowerShell execution policy may block npm commands — need to investigate.

### Misha Andalusia (Developer)
- **Yesterday:** N/A — Sprint start
- **Today:** Research modern warehouse dashboard designs for UI inspiration. Begin wireframing login page layout.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** N/A — Sprint start
- **Today:** Research object detection visualization approaches (Canvas vs SVG). Set up React Router and context architecture.
- **Blockers:** None

---

## Day 2 — Tuesday, April 15, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** Completed all 8 product backlogs with detailed stories. Prioritized and assigned story points.
- **Today:** Review design system tokens and approve color palette. Validate acceptance criteria with team.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Successfully initialized project. Resolved PowerShell execution policy issue. Created design system with 50+ CSS custom properties.
- **Today:** Build layout components — Sidebar navigation, Header with search bar, Layout wrapper with responsive sidebar collapse.
- **Blockers:** None — all environment issues resolved.

### Misha Andalusia (Developer)
- **Yesterday:** Completed login page wireframe.
- **Today:** Implement login page with glassmorphism design, animated background, quick-access buttons, form validation.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Set up React Router v6 routing structure and created AuthContext with login/logout logic.
- **Today:** Create WarehouseContext with useReducer for global state management. Build mock data layer for all entities.
- **Blockers:** None

---

## Day 3 — Wednesday, April 16, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** Approved design system and color palette. Validated acceptance criteria.
- **Today:** Review dashboard implementation against acceptance criteria. Test login flow with all 4 demo accounts.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Completed Sidebar, Header, Layout, and ToastContainer components.
- **Today:** Support team with any blockers. Begin working on Zone Management page — interactive floor plan.
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Login page completed and tested.
- **Today:** Build Dashboard page — KPI cards with animations, live camera feed grid with detection overlays, activity timeline, system health bars.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** WarehouseContext and mock data completed.
- **Today:** Build Object Detection page — canvas simulation with bounding boxes, detection log sidebar, camera selector, play/pause controls.
- **Blockers:** Import path issue found — pages using `../../context/` instead of `../context/`. Will fix immediately.

---

## Day 4 — Thursday, April 17, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** Tested dashboard and login — all acceptance criteria met.
- **Today:** Final sprint review — test all 8 pages. Approve sprint deliverables. Prepare sprint report materials.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Zone Management page completed with floor plan and zone cards.
- **Today:** Compile Sprint 1 Report, Sprint Retrospective, and Daily Standup logs. Prepare for weekly sprint review session.
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Dashboard completed. Built Alert Center with severity filtering and Inventory Management with full CRUD.
- **Today:** Build Analytics page with Chart.js — 5 chart types (line, bar, doughnut). Fix any remaining UI issues.
- **Blockers:** Chart.js v4 requires explicit module registration — researching the correct imports.

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Object Detection canvas simulation completed with animated bounding boxes. Fixed all import path issues.
- **Today:** Build Activity Log page with timeline view and type-based filtering. Help Misha with Chart.js configuration.
- **Blockers:** None

---

## Sprint 1 Standup Summary

| Metric | Value |
|--------|-------|
| Total Standups Held | 4 |
| Blockers Reported | 2 (PowerShell policy, import paths) |
| Blockers Resolved | 2 (100% resolution rate) |
| Average Standup Duration | ~12 minutes |

---

*Log maintained by: Sultan Zhalifunnas Musyaffa (Scrum Master)*
