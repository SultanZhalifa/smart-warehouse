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

# Daily Standup Log — Sprint 2

**Project:** Smart Warehouse (Object Detection)  
**Sprint:** Sprint 2 (Week 2)  
**Facilitator:** Sultan Zhalifunnas Musyaffa (Scrum Master)

---

## Day 5 — Friday, April 18, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** Completed Sprint 1 review and approved all deliverables.
- **Today:** Define Sprint 2 acceptance criteria. Plan RBAC requirements — which pages each role can access.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Compiled Sprint 1 documentation. Pushed codebase to GitHub.
- **Today:** Design Settings page UI — tabs for Profile, Notifications, Appearance, Security. Create wireframes.
- **Blockers:** GitHub push required PAT token setup — resolved during sprint planning.

### Misha Andalusia (Developer)
- **Yesterday:** Completed Sprint 1 analytics page.
- **Today:** Begin export utility module — CSV, JSON, and PDF export functions. Research browser Blob API.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Completed Activity Log page.
- **Today:** Design real-time notification architecture. Research event simulation patterns using setInterval with randomized timing.
- **Blockers:** None

---

## Day 6 — Saturday, April 19, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** RBAC requirements defined — Admin (full), Manager (no user management), Operator (basic views only).
- **Today:** Implement RoleRoute component. Add role-based sidebar filtering logic.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Completed Settings page wireframes.
- **Today:** Implement Settings page — Profile tab with avatar card, form fields, and save functionality.
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Export utility module completed with CSV, JSON, and PDF support.
- **Today:** Wire export buttons into Inventory page (Export CSV) and Activity Log page (Export Log).
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Designed event simulation architecture.
- **Today:** Build LiveEventSimulator component — headless component that generates detection, alert, and system events with random intervals.
- **Blockers:** Need to ensure useCallback memoization to prevent infinite re-render loops.

---

## Day 7 — Sunday, April 20, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** RBAC implementation completed and tested with all 4 user roles.
- **Today:** Final review of all Sprint 2 features. Test Settings page, export buttons, and notification system.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Settings page Profile tab completed.
- **Today:** Complete remaining Settings tabs — Notifications (toggle switches), Appearance (theme/accent picker), Security (password/sessions).
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Export buttons wired into Inventory and Activity Log.
- **Today:** Add zone filter dropdown to Inventory page. Ensure filtered export works correctly.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** LiveEventSimulator component completed and integrated into Layout.
- **Today:** Fine-tune notification timing (25-45s intervals). Test toast notifications across all pages.
- **Blockers:** None

---

## Day 8 — Monday, April 21, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** All Sprint 2 features reviewed and approved.
- **Today:** Final acceptance testing. Approve Sprint 2 deliverables. Prepare for sprint review session.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** All 4 Settings tabs completed.
- **Today:** Compile Sprint 2 Report and update documentation. Git commit and push all Sprint 2 changes.
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Zone filter and export integration completed.
- **Today:** Bug fixes and code cleanup. Help prepare Sprint 2 demo.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Notification system polished — events now include emojis and descriptive messages.
- **Today:** Cross-page testing. Verify all real-time events appear in Activity Log. Help with documentation.
- **Blockers:** None

---

## Sprint 2 Standup Summary

| Metric | Value |
|--------|-------|
| Total Standups Held | 4 |
| Blockers Reported | 2 (PAT token, useCallback memoization) |
| Blockers Resolved | 2 (100% resolution rate) |
| Average Standup Duration | ~10 minutes |

---

*Log maintained by: Sultan Zhalifunnas Musyaffa (Scrum Master)*
