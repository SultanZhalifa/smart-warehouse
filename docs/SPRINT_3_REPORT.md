# Sprint 3 Report

**Sprint Duration:** April 21 to April 27, 2026  
**Sprint Goal:** Integrate real Supabase backend, implement AI pest detection with Roboflow, and remove all simulated data to prepare the system for live demonstration and competition submission.

---

## Sprint Goal

Sprint 3 was the transition sprint from prototype behavior to real system behavior. The team focused on connecting the frontend to live Supabase data, integrating AI detection through backend services, and preparing the project for a reliable live demo.

This sprint also included cleanup and documentation updates to meet course submission and competition presentation standards.

---

## Progress Completed

### Backend Integration (Supabase)
- Connected all six primary data sources (zones, cameras, alerts, inventory, activity log, detection stats) to the Supabase PostgreSQL database.
- Implemented Row Level Security policies on all tables to ensure data access is scoped to authenticated users.
- Built a centralized database helper module (`database.js`) with 20+ CRUD and analytics query functions.
- Created a schema migration script (`schema.sql`) and a seed data script (`seed-data.sql`) for reproducible database setup.

### AI Detection System (Roboflow)
- Implemented AI detection flow with image upload and YOLOv8 inference integration through backend orchestration.
- Detection results are automatically persisted to the `detections` and `detection_results` tables in Supabase.
- The system creates alerts in the database whenever pests are identified, categorized by severity (high for snakes, medium for cats and geckos).
- Each scan event is logged to the activity log with the operator's name and detected species.

### Authentication Improvements
- Added password reset functionality using `supabase.auth.resetPasswordForEmail()`.
- The login page now supports three modes: sign in, create account, and forgot password.
- Resolved session lock contention issues by implementing a custom storage adapter and a 3 second timeout fallback.

### UI and Branding
- Replaced all Unicode emoji characters across the codebase with custom minimalist SVG icon components (`PestIcons.jsx`).
- Created vector icons for snake, cat, gecko, and generic pest silhouettes, plus a reusable status dot indicator component.
- Updated all page headers, labels, and metadata to consistently use the pest detection terminology.

### Analytics Overhaul
- Rewrote the Analytics page to fetch all chart data from Supabase in real time.
- Five chart types (hourly trend, weekly distribution, species breakdown, zone activity, and threat resolution) now query actual database records.
- When no data is available, the page displays a meaningful empty state instead of hardcoded placeholder numbers.

### Cleanup
- Removed the LiveEventSimulator component, which was generating fake database entries on a timer.
- Deleted the legacy `mockData.js` file.
- Updated environment usage to support backend-driven detection configuration.

---

## Task Distribution

| Team Member | Tasks Completed |
|-------------|----------------|
| Sultan | Supabase integration, AI Detection page, authentication fixes, SVG icon system, analytics rewrite, seed data script, sprint documentation |
| Risly | Product backlog refinement, acceptance testing for each feature |
| Misha | Login page styling, CSS polish, responsive layout testing |
| Fathir | Alert system testing, detection flow validation, zone management verification |

---

## Challenges

1. **Supabase auth lock contention.** The default Supabase JS client uses the browser Navigator Lock API for session management. In development, multiple tabs or hot module reloads caused lock timeouts that prevented session resolution, resulting in an empty dashboard. We solved this by implementing a custom localStorage adapter that bypasses the lock mechanism entirely.

2. **Analytics data sourcing.** The original analytics page used inline hardcoded arrays for chart data. Replacing these with real database queries required building five new aggregation functions that handle edge cases like empty datasets, timezone differences, and missing zone references.

3. **Emoji cross-platform inconsistency.** Unicode emoji render differently across operating systems and browsers, which would have been a problem during the competition demo on an unfamiliar machine. Switching to SVG icons ensures pixel-perfect rendering regardless of the environment.

4. **Roboflow model readiness.** The team needed a pest-focused YOLOv8 deployment on Roboflow with a stable model slug and API access so every scan returns real inference output, not placeholder logic.

---

## Solutions

| Challenge | Solution Applied |
|-----------|-----------------|
| Auth lock timeout | Custom localStorage adapter with implicit flow type and 3 second fallback timer |
| Hardcoded analytics | Five new database query functions that aggregate from detection_results and alerts tables |
| Emoji rendering | Custom PestIcons.jsx component with SVG paths for each species |
| Model readiness gap | Finalize Roboflow project, train or deploy the model, then set `ROBOFLOW_MODEL` and `ROBOFLOW_API_KEY` in `backend/.env` |

---

## Plan for Final Delivery

1. **Train the Roboflow model.** Collect and annotate snake, cat, and gecko images on Roboflow Universe, then train a YOLOv8 model using Roboflow Train. Deploy the model and set `ROBOFLOW_MODEL` and `ROBOFLOW_API_KEY` in `backend/.env` (the frontend calls the backend only).

2. **Live demonstration preparation.** Test the full detection workflow end to end with the webcam and uploaded photos. Ensure alert creation, activity logging, and analytics chart updates work in real time during the demo.

3. **Seed the production database.** Run the `seed-data.sql` script in the Supabase SQL Editor to populate the dashboard with realistic initial data for the competition presentation.

4. **Deploy to production hosting.** Configure Vercel or Netlify with the required VITE environment variables and deploy the application to a public URL for the judges to access.

5. **Update documentation and screenshots.** Capture fresh screenshots of all pages with populated data and update the README and sprint documentation accordingly.

6. **Final code review.** Ensure all files pass linting, there are no console errors, and the application handles edge cases gracefully.

---

Sprint 3 closed with the core architecture already connected to live services and a workable demo path prepared for final presentation.
