# Sprint 2 Report -- Smart Warehouse (Object Detection)

**Sprint Period:** April 18 - April 21, 2026  
**Sprint Goal:** Add settings management, data export, real-time notifications, role-based access, and better inventory filtering.

---

## 1. Sprint Goal

Sprint 2 focused on strengthening quality and usability after the fast delivery in Sprint 1. Instead of creating many new pages, the team concentrated on operational improvements: settings, export support, role-based access hardening, and better filtering.

---

## 2. Progress Completed

### Settings and Profile Page
We implemented a complete settings area with four tabs. Users can edit profile data, configure notification preferences, adjust appearance options, and access account security actions.

Assigned to: Sultan  
Status: Done

### Export Functionality
We built an export utility module for CSV, JSON, and PDF. Export actions were integrated into Inventory and Activity Log, and the output follows active filters so users only download what they are currently reviewing.

Assigned to: Misha  
Status: Done

### Real-Time Notification System
We added a background event simulator to generate realistic operational events (detection updates, camera status, zone warnings, and inventory notifications). Events appear as toast messages and are recorded in Activity Log automatically.

Assigned to: Fathir  
Status: Done

### Role-Based Access Control (RBAC)
We added a `RoleRoute` guard for page-level access control and updated navigation visibility by role. This closed the gap where restricted pages were hidden from the menu but still reachable through direct URLs.

Assigned to: Risly  
Status: Done

### Advanced Inventory Filters
We introduced a zone filter on Inventory and made it work with existing search and category filters.

Assigned to: Sultan  
Status: Done

---

## 3. Task Distribution

| Team Member | Role | Tasks | Story Points |
|-------------|------|-------|:---:|
| Risly Maria Theresia Worung | Product Owner | RBAC, route guards, sidebar filtering | 5 |
| Sultan Zhalifunnas Musyaffa | Scrum Master | Settings page (4 tabs), zone filter | 8 |
| Misha Andalusia | Developer | Export utilities (CSV/JSON/PDF), export integration | 5 |
| Fathir Barhouti Awlya | Developer | Real-time notification system, event simulator | 5 |

Total Completed: 23 out of 23 story points

---

## 4. Challenges

| Challenge | Impact | Root Cause |
|-----------|--------|------------|
| GitHub push kept failing with authentication error | Couldnt deploy code to remote repo | GitHub deprecated password auth, we needed a PAT token instead |
| Real-time events were causing too many re-renders | Slight UI lag when notifications fire | The event handler wasnt memoized properly |
| Operator users could still navigate to restricted pages via URL | Security gap | We only hid the sidebar links but didnt guard the routes themselves |
| Special characters in item names broke CSV export | Corrupted CSV output | Commas and quotes inside field values werent escaped |

---

## 5. Solutions

| Challenge | What We Did |
|-----------|-------------|
| GitHub authentication | Generated a Personal Access Token with repo scope and used that for pushing |
| Re-render issue | Wrapped the event simulator callback in useCallback so React doesnt recreate it every render |
| RBAC route bypass | Created a RoleRoute wrapper component that checks the user role and redirects unauthorized users back to dashboard |
| CSV encoding | Added proper escaping -- wrapping values in double quotes and escaping any existing quotes inside the value |

---

## 6. Plan for Sprint 3

For Sprint 3, the team agreed to move from simulation-heavy behavior toward production-style architecture and real integration:

1. Replace mock data with real Supabase PostgreSQL data across all core pages
2. Build a Python FastAPI backend for AI detection, then connect the frontend to backend endpoints
3. Integrate Roboflow YOLOv8 inference for snake, cat, and gecko detection
4. Remove simulated event generation and shift to real database-driven updates
5. Strengthen authentication flow (including password recovery) for demo readiness
6. Prepare deployment checklist and environment configuration for public demo hosting

---

## Sprint Metrics

| Metric | Value |
|--------|-------|
| Sprint Velocity | 23 story points |
| Features Delivered | 5 out of 5 |
| Bug Fixes | 3 |
| New Files Created | 4 |
| Files Modified | 6 |

---

Sprint 2 closed with stronger access control, cleaner operational tools, and a solid base for backend integration in Sprint 3.

Date: April 21, 2026
