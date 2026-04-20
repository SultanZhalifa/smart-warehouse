# Sprint 2 Report -- Smart Warehouse (Object Detection)

**Sprint Period:** April 18 - April 21, 2026  
**Sprint Goal:** Add settings management, data export, real-time notifications, role-based access, and better inventory filtering.

---

## 1. Sprint Goal

The focus for Sprint 2 was to build on top of what we delivered in Sprint 1. Since all 8 core pages were already done, this sprint was about polishing the app and adding features that make it feel more complete -- things like a proper settings page, the ability to export data, live notifications, and restricting access based on user roles.

---

## 2. Progress Completed

### Settings and Profile Page
We added a full settings page with four tabs. The Profile tab lets users view and edit their info (name, email, phone). The Notifications tab has toggle switches for controlling which alerts you want to receive. Appearance lets you pick a theme and accent color. And the Security tab has a password change form plus a list of active sessions.

Assigned to: Sultan  
Status: Done

### Export Functionality
Built a utility module that handles exporting data to CSV, JSON, and PDF formats. We wired the CSV export into the Inventory page (there's an "Export CSV" button now) and the Activity Log page (the "Export Log" button). The export respects whatever filters are currently active, so if you filter by zone, only those items get exported.

Assigned to: Misha  
Status: Done

### Real-Time Notification System
We created a LiveEventSimulator component that runs in the background and randomly generates detection events, camera status updates, zone warnings, and inventory notifications. It fires a toast notification every 25 to 45 seconds and also logs the event into the Activity Log automatically. The timing is randomized so it feels more natural.

Assigned to: Fathir  
Status: Done

### Role-Based Access Control (RBAC)
Added a RoleRoute component that checks the user's role before allowing access to a page. Also updated the sidebar so it only shows navigation items that the logged-in user is allowed to access. Admins can see everything. Managers can see most things but not user management. Operators only get the basic pages -- they cant access Analytics or Activity Log.

Assigned to: Risly  
Status: Done

### Advanced Inventory Filters
Added a zone filter dropdown to the Inventory page so you can filter items by warehouse zone. This works together with the existing search bar and category pills, so you can combine all three filters at once.

Assigned to: Sultan  
Status: Done

---

## 3. Task Distribution

| Team Member | Role | Tasks | Story Points |
|-------------|------|-------|:---:|
| Risly Maria Theresia Worung | Product Owner | RBAC, route guards, sidebar filtering | 5 |
| Misha Andalusia | Scrum Master | Export utilities (CSV/JSON/PDF), export integration | 5 |
| Fathir Barhouti Awlya | Developer | Real-time notification system, event simulator | 5 |
| Sultan Zhalifunnas Musyaffa | Developer | Settings page (4 tabs), zone filter | 8 |

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

For the next sprint we want to focus on making the app more production-ready:

1. Replace the mock data with a proper REST API using Node.js and Express
2. Set up MongoDB for data persistence so things dont reset on refresh
3. Swap out the event simulator with actual WebSocket connections for real-time updates
4. Write unit tests using Vitest and React Testing Library for the core components
5. Set up a CI/CD pipeline with GitHub Actions
6. Deploy the app to Vercel or Netlify

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

Report prepared by: Sultan Zhalifunnas Musyaffa (Scrum Master)  
Date: April 21, 2026
