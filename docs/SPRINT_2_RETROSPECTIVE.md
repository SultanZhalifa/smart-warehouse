# Sprint 2 Retrospective -- Smart Warehouse

**Sprint:** Sprint 2 (Week 2)  
**Date:** April 21, 2026  
**Facilitator:** Sultan Zhalifunnas Musyaffa (Scrum Master)  
**Attendees:** Risly, Misha, Fathir, Sultan

---

## What Went Well

1. **Clear feature ownership**  
   Each person owned a specific feature from start to finish. Sultan did the Settings page, Misha handled exports, Fathir built the notification system, and Risly implemented RBAC. There was very little overlap or confusion.

2. **Smooth integration**  
   All the Sprint 2 features plugged into the existing codebase without breaking anything. The LiveEventSimulator, for example, just dropped into the Layout component and immediately worked because the toast and activity log systems from Sprint 1 were designed well.

3. **RBAC worked on the first try**  
   We were worried the role-based access control would be tricky, but the RoleRoute wrapper plus sidebar filtering worked right away. We tested it by logging in as all 4 users and everything behaved correctly.

4. **Export feature is genuinely useful**  
   The CSV export on the Inventory page actually works -- you can filter by category or zone and export only what you see. For a demo this is impressive because most student projects dont have working export.

5. **Documentation was kept up to date**  
   Unlike Sprint 1 where we wrote all the docs at the end, this time we updated the standup log daily. It felt more natural and accurate.

---

## What Didnt Go Well

1. **GitHub authentication problems again**  
   Even though we already dealt with this in Sprint 1, the PAT token caused issues when pushing Sprint 2 commits. The remote had changes we didnt have locally, which meant we had to rebase before pushing. We should have pulled first.

2. **No automated testing still**  
   We said in Sprint 1 retro that we would add tests in Sprint 2. We didnt. This is now two sprints without any automated testing. We need to actually prioritize this next time.

3. **The Settings page doesnt persist anything**  
   You can change your profile info, toggle notifications, pick a theme -- but none of it actually saves. If you refresh the page, everything goes back to default. This is because we dont have a backend or localStorage yet.

4. **useCallback memoization issue took longer than expected**  
   Fathir spent some time debugging why the LiveEventSimulator was causing re-renders. Turns out the callback wasnt wrapped in useCallback so React was recreating the function every render. Simple fix but it wasnt obvious at first.

---

## What to Improve

| What | Action | Who | When |
|------|--------|-----|------|
| Write actual tests | Set up Vitest, write at least 5 unit tests for core components | Fathir | Sprint 3 |
| Persist settings | Use localStorage to save theme preference, notification settings, profile data | Sultan | Sprint 3 |
| Pull before push | Always run git pull --rebase before git push | Everyone | Sprint 3 |
| Backend API | Start building a Node.js + Express backend to replace mock data | Fathir, Sultan | Sprint 3 |
| Deploy to Vercel | Get the app deployed so we can share a link instead of running locally | Sultan | Sprint 3 |

---

## Satisfaction Scores

| Member | Score | Comment |
|--------|-------|---------|
| Risly | 5/5 | "All features work as expected, the app feels much more complete now" |
| Misha | 4/5 | "Export is solid but we really need to add persistence, the Settings page feels incomplete without it" |
| Fathir | 4/5 | "Notification system is cool but I'm still worried about no tests" |
| Sultan | 4/5 | "Happy with the Settings page but we need to start saving data properly" |

**Average:** 4.25 / 5.0

---

## Takeaway

Sprint 2 added the kind of features that make the app feel real -- settings, notifications, exports, and access control. But we need to acknowledge that we keep pushing testing to the next sprint. The app is getting complex enough now that manual testing alone isnt sustainable. Sprint 3 really needs to be the sprint where we add at least basic test coverage and data persistence.

---

Date: April 21, 2026
