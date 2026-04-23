# Sprint Review Meeting Notes -- Smart Warehouse

---

## Sprint 1 Review

**Date:** April 17, 2026  
**Attendees:** Risly (PO), Sultan (SM), Misha (Dev), Fathir (Dev)  
**Duration:** 25 minutes

### What Was Presented

Sultan walked through all 8 pages of the application:

1. **Login Page** -- Showed the glassmorphism design, form validation, and all 4 quick-access buttons. Each button fills in the correct credentials for that user.

2. **Dashboard** -- Demonstrated the KPI cards, live camera feed grid, and recent activity timeline. Highlighted the system health bars at the bottom.

3. **Object Detection** -- Live demo of the canvas simulation with animated bounding boxes. Showed the detection log updating in real time and the camera selector dropdown.

4. **Inventory** -- Added a new item, edited it, then deleted it. Showed how the stock status auto-updates (In Stock / Low Stock / Out of Stock) based on quantity vs minimum.

5. **Alert Center** -- Filtered by severity types. Showed the Mark as Read functionality and the unread badge count in the sidebar.

6. **Analytics** -- Showed all 5 charts loading with Chart.js. Switched between Day/Week/Month/Year tabs.

7. **Zone Management** -- Pointed out the 6 zones on the floor plan with animated dots showing activity. Scrolled down to show the zone detail cards with utilization bars.

8. **Activity Log** -- Searched for specific actions, filtered by type, and showed how CRUD operations automatically create log entries.

### Product Owner Feedback

Risly approved all 8 features and noted that the design quality exceeded initial expectations. The only concern was the lack of data persistence (everything resets on refresh), which she asked to be addressed in Sprint 2.

### Decision

All Sprint 1 deliverables accepted. No items rejected. Team agreed to focus Sprint 2 on enhancements rather than new pages.

---

## Sprint 2 Review

**Date:** April 21, 2026  
**Attendees:** Risly (PO), Sultan (SM), Misha (Dev), Fathir (Dev)  
**Duration:** 20 minutes

### What Was Presented

Each team member demoed the feature they built:

1. **Sultan -- Settings Page**  
   Walked through all 4 tabs. Showed the Profile form, toggled notification preferences on and off, changed the appearance theme, and demonstrated the password change form. Noted that persistence isnt implemented yet.

2. **Misha -- Export Functionality**  
   Clicked the "Export CSV" button on the Inventory page and showed the downloaded CSV file opening correctly in a spreadsheet app. Also showed the export button on the Activity Log page.

3. **Fathir -- Real-time Notifications**  
   The team waited about 30 seconds and a toast notification popped up on its own. Fathir explained the randomized 25-45 second interval and showed how the events automatically appear in the Activity Log.

4. **Risly -- Role-Based Access Control**  
   Logged in as Fathir (Operator) to show that Analytics and Activity Log are hidden from the sidebar. Then logged in as Risly (Admin) to show full access. Also tried navigating directly to /analytics while logged in as Operator to confirm the route guard redirects to dashboard.

5. **Sultan -- Zone Filter**  
   Selected "Zone B" from the dropdown on the Inventory page and showed the table filtering down to only Zone B items. Then combined it with the "Mechanical" category filter.

### Product Owner Feedback

Risly was satisfied with all 5 features. She specifically called out the RBAC demo as convincing because it showed both the sidebar hiding and the route protection. She again mentioned that Settings should persist data eventually but accepted it as-is for Sprint 2.

### Decision

All Sprint 2 deliverables accepted. Sprint 2 is closed. Team will plan Sprint 3 goals in the next session.

---

Date: April 21, 2026
