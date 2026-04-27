# Daily Standup Log -- Sprint 1

**Project:** Smart Warehouse (Object Detection)  
**Sprint:** Sprint 1 (Week 1)  
**Facilitator:** Sultan Zhalifunnas Musyaffa (Scrum Master)

These notes reflect what the team did at the time. Early sprints used in-memory sample data; production data later moved to Supabase PostgreSQL (see Sprint 3 documentation).

---

## Day 1 -- Monday, April 14, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** Nothing, this is day one
- **Today:** Writing all 8 product backlogs with detailed user stories, features, and acceptance criteria. Also need to assign priority levels.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Nothing, first day
- **Today:** Running the sprint planning session. Setting up the project repo, initializing Vite + React, installing packages, creating the folder structure.
- **Blockers:** PowerShell execution policy might block npm commands, need to check.

### Misha Andalusia (Developer)
- **Yesterday:** Nothing, sprint just started
- **Today:** Looking at modern warehouse dashboard designs for inspiration. Going to start wireframing the login page.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Nothing, first day
- **Today:** Researching whether to use Canvas or SVG for the detection visualization. Also setting up React Router and the context architecture.
- **Blockers:** None

---

## Day 2 -- Tuesday, April 15, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** Finished writing all 8 product backlogs with stories and assigned story points.
- **Today:** Reviewing the design system tokens that Sultan created. Need to approve the color palette and check the acceptance criteria with the team.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Got the project initialized. Fixed the PowerShell issue. Created the design system with 50+ CSS custom properties.
- **Today:** Building the layout components -- sidebar navigation, header with search bar, and the main layout wrapper with sidebar collapse.
- **Blockers:** None, environment stuff is sorted out.

### Misha Andalusia (Developer)
- **Yesterday:** Finished the login page wireframe.
- **Today:** Implementing the actual login page -- glassmorphism style, animated background, quick-access buttons for demo, form validation.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Set up React Router v6 routing and created the AuthContext with login/logout logic.
- **Today:** Building the WarehouseContext with useReducer for global state. Also creating the mock data layer for all the entities.
- **Blockers:** None

---

## Day 3 -- Wednesday, April 16, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** Approved the design system and color palette. Went through acceptance criteria with the team.
- **Today:** Testing the dashboard against the acceptance criteria. Also going to test the login flow with all 4 demo accounts.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Finished the Sidebar, Header, Layout, and ToastContainer components.
- **Today:** Helping the team with any issues that come up. Starting on the Zone Management page with the interactive floor plan.
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Login page is done and tested.
- **Today:** Building the Dashboard -- KPI cards with animations, live camera grid with detection overlays, activity timeline, and system health bars.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** WarehouseContext and mock data are done.
- **Today:** Working on the Object Detection page -- canvas simulation with bounding boxes, detection log, camera selector, play/pause.
- **Blockers:** Found an import path issue -- some pages are using `../../context/` when it should be `../context/`. Fixing it now.

---

## Day 4 -- Thursday, April 17, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** Tested dashboard and login, everything passes the acceptance criteria.
- **Today:** Final review of all 8 pages. Approving the sprint deliverables and putting together materials for the sprint report.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Zone Management page is done with the floor plan and zone cards.
- **Today:** Writing the Sprint 1 Report, Sprint Retrospective, and these standup logs. Getting ready for the sprint review session.
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Dashboard is done. Also built the Alert Center with severity filtering and the Inventory Management page with full CRUD.
- **Today:** Building the Analytics page with Chart.js -- 5 different chart types (line, bar, doughnut). Fixing any leftover UI bugs.
- **Blockers:** Chart.js v4 requires explicit module registration, looking into the right way to do the imports.

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Object Detection canvas simulation is complete with animated bounding boxes. Fixed all the import path issues.
- **Today:** Building the Activity Log page with timeline view and type-based filtering. Also going to help Misha with the Chart.js setup.
- **Blockers:** None

---

## Sprint 1 Standup Summary

| Metric | Value |
|--------|-------|
| Total Standups | 4 |
| Blockers Reported | 2 (PowerShell policy, import paths) |
| Blockers Resolved | 2 (100%) |
| Average Duration | Around 12 minutes |

---

# Daily Standup Log -- Sprint 2

**Project:** Smart Warehouse (Object Detection)  
**Sprint:** Sprint 2 (Week 2)  
**Facilitator:** Sultan Zhalifunnas Musyaffa (Scrum Master)

---

## Day 5 -- Friday, April 18, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** Finished Sprint 1 review and approved everything.
- **Today:** Defining acceptance criteria for Sprint 2. Planning out the RBAC requirements -- figuring out which pages each role should be able to access.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Compiled all the Sprint 1 documentation and pushed the code to GitHub.
- **Today:** Designing the Settings page UI. It needs tabs for Profile, Notifications, Appearance, and Security. Starting with wireframes.
- **Blockers:** Had to set up a PAT token for GitHub push because password auth doesnt work anymore. Got it sorted during sprint planning.

### Misha Andalusia (Developer)
- **Yesterday:** Finished the Sprint 1 analytics page.
- **Today:** Starting on the export utility module. Need to implement CSV, JSON, and PDF export. Doing some research on the browser Blob API.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Finished the Activity Log page.
- **Today:** Designing how the real-time notification system should work. Looking into using setInterval with randomized timing to simulate events.
- **Blockers:** None

---

## Day 6 -- Saturday, April 19, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** RBAC requirements are defined. Admin gets full access, Manager gets most things, Operator only gets the basic views.
- **Today:** Implementing the RoleRoute component and adding role-based filtering to the sidebar.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Settings page wireframes are done.
- **Today:** Implementing the Settings page, starting with the Profile tab -- avatar card, form fields, save button.
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Export utility module is done with CSV, JSON, and PDF support.
- **Today:** Connecting the export buttons to the actual pages. Adding "Export CSV" to Inventory and "Export Log" to Activity Log.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Finished the event simulation architecture design.
- **Today:** Building the LiveEventSimulator component. Its a headless component that generates random detection, alert, and system events at random intervals.
- **Blockers:** Need to make sure the callback is properly memoized with useCallback to avoid infinite re-render loops.

---

## Day 7 -- Sunday, April 20, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** RBAC is implemented and tested with all 4 user roles.
- **Today:** Final review of all Sprint 2 features. Testing the Settings page, export buttons, and notification system.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Settings Profile tab is done.
- **Today:** Finishing the remaining tabs -- Notifications (toggle switches), Appearance (theme picker and accent colors), Security (password change and session management).
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Export buttons are wired up on Inventory and Activity Log.
- **Today:** Adding the zone filter dropdown to the Inventory page and making sure the filtered export works correctly.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** LiveEventSimulator is built and integrated into the Layout component.
- **Today:** Adjusting the notification timing to fire every 25-45 seconds. Testing that toast notifications work properly on all pages.
- **Blockers:** None

---

## Day 8 -- Monday, April 21, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** All Sprint 2 features reviewed and approved.
- **Today:** Final acceptance testing. Signing off on Sprint 2. Preparing for the sprint review session.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** All 4 Settings tabs are complete.
- **Today:** Writing the Sprint 2 Report and updating all the documentation. Committing and pushing everything to GitHub.
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Zone filter and export integration are done.
- **Today:** Bug fixes and cleanup. Helping prepare the Sprint 2 demo.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Notification system is polished, events now have descriptive messages.
- **Today:** Testing across all pages to make sure real-time events show up in the Activity Log correctly. Helping with documentation.
- **Blockers:** None

---

## Sprint 2 Standup Summary

| Metric | Value |
|--------|-------|
| Total Standups | 6 |
| Blockers Reported | 3 (PAT token setup, useCallback memoization, emoji inconsistency across OS) |
| Blockers Resolved | 3 (100%) |
| Average Duration | Around 10 minutes |

---

## Day 9 -- Tuesday, April 22, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** Signed off on all Sprint 2 deliverables.
- **Today:** Reviewing the UI after the theme overhaul. Checking if all pages still look consistent with the new light theme. Also verifying the product backlog documentation matches the dosen's requirements.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Finished Sprint 2 documentation and pushed everything to GitHub.
- **Today:** Major UI/UX overhaul -- switching from the old dark theme to a modern light theme (Apple/Linear-inspired). Updating all CSS design tokens, removing decorative blobs, refining shadows and borders. Also replacing all emojis with Lucide SVG icons for a more professional look.
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Finished bug fixes and export integration polishing.
- **Today:** Helping test the new light theme across all pages. Checking if any hardcoded dark-theme colors got missed during the migration.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** Notification system testing is done.
- **Today:** Updating the LiveEventSimulator toast titles -- removing emoji characters and replacing with clean text. Also checking that the Detection Page legend renders SVG icons properly instead of the old emoji strings.
- **Blockers:** Some emojis render differently on Windows vs Mac, which is another reason we decided to switch everything to SVG icons.

---

## Day 10 -- Wednesday, April 23, 2026

### Risly Maria Theresia Worung (Product Owner)
- **Yesterday:** Reviewed the new light theme on all 8 pages, everything looks clean and professional.
- **Today:** Final check on all documentation files (product backlog, sprint reports, daily standup logs). Making sure the role assignments are consistent across all docs. Preparing materials for the weekly sprint review session.
- **Blockers:** None

### Sultan Zhalifunnas Musyaffa (Scrum Master)
- **Yesterday:** Completed the full UI/UX premium upgrade -- refined typography, softer shadows, removed borders, upgraded micro-interactions. Also created the AI Handoff document.
- **Today:** Fixing a role inconsistency we found in the Sprint 2 Report (Misha was accidentally listed as Scrum Master). Adding the missing daily standup entries for Days 9 and 10. Pushing final docs to GitHub.
- **Blockers:** None

### Misha Andalusia (Developer)
- **Yesterday:** Confirmed all pages look good with the new theme. No missed dark-theme colors.
- **Today:** Helping prepare the demo for the sprint review. Testing the full user flow from login through all pages on a clean browser.
- **Blockers:** None

### Fathir Barhouti Awlya (Developer)
- **Yesterday:** SVG icon migration is confirmed working on Detection Page and toast notifications.
- **Today:** Final round of cross-page testing. Making sure all interactive elements (hover states, active states, transitions) feel smooth and consistent with the new premium UI.
- **Blockers:** None

---

