# Sprint 1 Retrospective -- Smart Warehouse

**Sprint:** Sprint 1 (Week 1)  
**Date:** April 17, 2026  
**Facilitator:** Sultan Zhalifunnas Musyaffa (Scrum Master)  
**Attendees:** Risly, Misha, Fathir, Sultan

---

## What Went Well

1. **Project setup was fast**  
   We got Vite + React running in under 10 minutes which gave us a head start on the actual feature work.

2. **Starting with the design system paid off**  
   We created all the CSS design tokens (colors, spacing, typography, etc) before writing any components. This meant every page ended up looking consistent without us having to go back and fix styling later.

3. **We delivered way more than planned**  
   The commitment was 21 story points but we ended up completing all 60. Basically all 8 product backlog items got done in one sprint. Everyone was working efficiently and we divided the work well.

4. **Roles were clear from the start**  
   Risly handled all the backlog definitions and acceptance criteria. The developers just focused on building. Sultan kept track of the schedule and blockers. There was no confusion about who should do what.

5. **Reusable components saved time**  
   We built shared components early on (Toast, Badge, Card, Modal) and used them across multiple pages. This cut down on duplicate code and sped things up.

6. **The detection simulation turned out better than expected**  
   The canvas-based object detection with animated bounding boxes, confidence scores, and scanlines looked pretty convincing. It was originally planned for Sprint 2 but we pulled it into Sprint 1.

---

## What Didnt Go Well

1. **Environment issues at the start**  
   PowerShell blocked npm commands because of the execution policy. It only took about 15 minutes to fix but it was annoying and we could have avoided it if we had a setup checklist ready.

2. **Import path mistakes**  
   A few files had the wrong relative paths for imports (using `../../` instead of `../`). These only showed up at runtime. We probably should have configured path aliases in Vite so this kind of mistake cant happen.

3. **No automated tests**  
   We were moving fast and didnt write any tests. All testing was done manually by clicking through the app. This works for now but its going to be a problem if we keep adding features.

4. **Everything resets on refresh**  
   The app only uses mock data with no persistence layer. When you refresh the page, any changes you made are gone. Its fine for a demo but not ideal.

5. **Mobile responsiveness is limited**  
   The sidebar collapses on smaller screens but some pages like the Detection canvas and the Zone floor plan dont look great on mobile. We need to add better breakpoints.

---

## What to Improve

| What | Action | Who | When |
|------|--------|-----|------|
| Path aliases | Configure `@/` alias in vite.config.js so imports are cleaner | Sultan | Sprint 2 |
| Testing | Set up Vitest and React Testing Library, write tests for the main components | Fathir | Sprint 2 |
| Data persistence | Use localStorage or IndexedDB so state survives page refresh | Fathir | Sprint 2 |
| Setup documentation | Write a developer setup guide so new members dont run into the same env issues | Sultan | Sprint 2 |
| Mobile support | Add responsive breakpoints for detection canvas and zone map | Misha | Sprint 2 |
| Code reviews | Start doing PR reviews before merging to main | Everyone | Sprint 2 |

---

## Satisfaction Scores

Each person rated how they felt about the sprint on a scale of 1-5:

| Member | Score | Comment |
|--------|-------|---------|
| Risly | 5/5 | "Everything got delivered and the quality is really good, honestly exceeded my expectations" |
| Misha | 4/5 | "We moved fast which was great, but I wish we had time to write tests" |
| Fathir | 4/5 | "Happy with the code quality but no tests makes me a bit worried going forward" |
| Sultan | 5/5 | "The process worked well and the team communicated clearly throughout" |

**Average:** 4.5 / 5.0

---

## Takeaway

Sprint 1 went really well in terms of how much we delivered. We basically finished the entire application in one week. But we need to be honest that we skipped some important things like testing and code reviews. If we want to maintain this pace without accumulating technical debt, Sprint 2 needs to include some investment in quality infrastructure.

---

  
Date: April 17, 2026
