# Final Submission Summary -- Smart Warehouse

This document is prepared to match the course deliverable format requested by the lecturer.

---

## 1) Team Roles

| Role | Name | Student ID |
|------|------|------------|
| Product Owner | Risly Maria Theresia Worung | 001202400069 |
| Scrum Master | Sultan Zhalifunnas Musyaffa | 001202400200 |
| Developer | Misha Andalusia | 001202400040 |
| Developer | Fathir Barhouti Awlya | 001202400054 |

---

## 2) Product Backlogs (Minimum 8)

All backlog details are documented in `PRODUCT_BACKLOG.md` with user story, goal, features, acceptance criteria, known risks, and story points.

| ID | Backlog Item | Type | Priority | Story Points |
|----|--------------|------|----------|--------------|
| PBI-001 | Dashboard Overview | Feature | High | 8 |
| PBI-002 | AI Pest Detection Interface | Feature | High | 13 |
| PBI-003 | Inventory Management | Feature | High | 8 |
| PBI-004 | Real-Time Alert System | Feature | Medium | 5 |
| PBI-005 | Analytics and Reporting | Feature | Medium | 8 |
| PBI-006 | Zone Management | Feature | Medium | 8 |
| PBI-007 | User Authentication and Roles | Feature/Security | Low | 5 |
| PBI-008 | Activity Log and Audit Trail | Feature/Audit | Low | 5 |

Backlog refinement and fixes were performed continuously during standups and sprint reviews, including bugs related to import paths, Chart.js setup, RBAC route protection, and export formatting.

---

## 3) Backlog Priority Decision

- High Priority: PBI-001, PBI-002, PBI-003
- Medium Priority: PBI-004, PBI-005, PBI-006
- Low Priority: PBI-007, PBI-008

Priority rationale:
- High items were required for the main user flow and demo impact.
- Medium items improved decision support and operations quality.
- Low items were still important but could be implemented after core workflow was stable.

---

## 4) Daily Sprint Execution (Repository Evidence)

Daily scrum records are available in `DAILY_STANDUP_LOG.md`, containing:
- What each member completed
- What each member planned for the day
- Active blockers and resolution updates

Standup notes cover Sprint 1 and Sprint 2 in detail, including blocker resolution (PowerShell setup, route guards, CSV formatting, and UI consistency cleanup).

---

## 5) Weekly Sprint Sessions (Sprint 1, 2, 3)

## Week 1 / Sprint 1

### Sprint Goal
Set up the project foundation and deliver the core application structure, authentication, layout, and primary pages.

### Progress Completed
- Project architecture and routing implemented
- Login and role-based access foundation completed
- Dashboard, inventory, alerts, analytics, zones, and activity views implemented
- Team completed all committed items and delivered additional scope ahead of plan

### Task Distribution
- PO: backlog writing, prioritization, acceptance checks
- SM: sprint planning, project setup, architecture and layout coordination
- Devs: page implementation, state logic, charts, and interaction features

### Challenges
- Environment setup constraints in PowerShell
- Import path issues during rapid page development
- Chart.js registration and integration details

### Solutions
- Temporary execution policy handling for local setup
- Systematic path correction pass
- Proper Chart.js module registration and validation

### Plan for Next Week
Focus on enhancement sprint: settings, export, RBAC hardening, and real-time notification improvements.

---

## Week 2 / Sprint 2

### Sprint Goal
Improve product completeness with settings management, export tools, role-based route protection, and better operational filtering.

### Progress Completed
- Settings page (profile, notifications, appearance, security)
- Data export features integrated into operational pages
- RBAC strengthened at menu and route level
- Inventory filters improved with zone support

### Task Distribution
- PO: access rules and acceptance testing
- SM: settings and feature coordination
- Devs: export implementation, real-time event simulation, and integration testing

### Challenges
- Git authentication migration to PAT
- Event callback optimization to avoid unnecessary re-renders
- Route security gaps from menu-only restrictions

### Solutions
- PAT-based Git workflow
- Stable callback handling and cleanup
- Dedicated role-based route guard component

### Plan for Next Week
Transition from simulation to production-style flow with real database integration and backend-driven AI detection.

---

## Week 3 / Sprint 3

### Sprint Goal
Integrate real backend and database services, connect AI detection flow end-to-end, and prepare the system for live demonstration.

### Progress Completed
- Supabase integration across key modules with RLS-aware data access
- FastAPI backend integration for detection endpoint
- Roboflow inference integration path established
- Authentication and session reliability improved
- Documentation and project setup materials refined

### Task Distribution
- SM: backend integration, AI pipeline integration, technical documentation
- PO: backlog refinement and sprint acceptance
- Devs: UI validation, responsive checks, alert and zone testing, end-to-end flow verification

### Challenges
- Session lock behavior during development
- Analytics migration from static values to live queries
- Model readiness for pest-specific categories

### Solutions
- Custom storage/session handling strategy
- Dedicated query functions and empty-state handling
- Prepared fallback and staged model integration plan

### Plan for Final Delivery
- Final end-to-end demo rehearsal
- Final data seed and validation
- Deployment preparation and environment verification
- Final report alignment with lecturer submission format

---

## Supporting Documents

- `PRODUCT_BACKLOG.md`
- `SPRINT_1_REPORT.md`
- `SPRINT_2_REPORT.md`
- `SPRINT_3_REPORT.md`
- `DAILY_STANDUP_LOG.md`
- `SPRINT_REVIEW_NOTES.md`
- `SPRINT_RETROSPECTIVE.md`

