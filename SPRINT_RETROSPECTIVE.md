# Sprint 1 Retrospective — Smart Warehouse

**Sprint:** Sprint 1 (Week 1)  
**Date:** April 17, 2026  
**Facilitator:** Sultan Zhalifunnas Musyaffa (Scrum Master)  
**Attendees:** Risly, Misha, Fathir, Sultan

---

## 🟢 What Went Well

1. **Rapid Project Setup**
   - Vite + React scaffolding was completed in under 10 minutes, allowing the team to focus on feature development quickly.

2. **Design System First Approach**
   - Creating the CSS design system with 50+ tokens before building any components ensured visual consistency across all pages. Every component uses the shared tokens, resulting in a cohesive premium look.

3. **Exceeded Sprint Commitment**
   - The team committed to 21 story points but delivered 60 — all 8 product backlog items were completed in a single sprint. This shows strong team collaboration and efficient task distribution.

4. **Clear Role Separation**
   - Product Owner (Risly) focused on defining acceptance criteria and priorities while developers focused purely on implementation. Scrum Master (Sultan) kept the process running smoothly.

5. **Component Reusability**
   - The shared component library (Toast, Badge, Card, Modal) was used across multiple pages, reducing code duplication and speeding up development.

6. **Real-Time Detection Simulation**
   - The canvas-based object detection simulation exceeded expectations — animated bounding boxes with confidence scores, scanlines, and corner markers created a convincing demo.

---

## 🔴 What Didn't Go Well

1. **Environment Configuration Issues**
   - PowerShell execution policy blocked npm commands at the start, causing a 15-minute delay. This was unexpected and could have been prevented with a pre-setup checklist.

2. **Import Path Errors**
   - Multiple files had incorrect relative import paths (`../../` vs `../`). These were caught during runtime but could have been prevented with a path alias configuration in Vite (`@/` prefix).

3. **No Automated Testing**
   - Due to the aggressive timeline, no unit tests or integration tests were written. All testing was manual, which is not sustainable for future sprints.

4. **Mock Data Only**
   - The application uses only mock data with no persistence. Data resets on page refresh, which limits the demo experience.

5. **Limited Mobile Responsiveness**
   - While the sidebar collapses, some pages (especially the Detection canvas and Zone floor plan) are not fully optimized for mobile viewports.

---

## 🔵 What to Improve

| Improvement | Action Item | Owner | Target Sprint |
|-------------|------------|-------|---------------|
| **Path Aliases** | Configure `@/` alias in vite.config.js to prevent import path errors | Sultan | Sprint 2 |
| **Automated Testing** | Set up Vitest + React Testing Library, write tests for core components | Fathir | Sprint 2 |
| **Data Persistence** | Implement localStorage or IndexedDB to persist state across refreshes | Fathir | Sprint 2 |
| **Pre-Setup Checklist** | Create developer setup guide with environment requirements | Sultan | Sprint 2 |
| **Mobile Responsiveness** | Add responsive breakpoints for detection canvas and zone map | Misha | Sprint 2 |
| **Code Review Process** | Require PR reviews before merging to main branch | All | Sprint 2 |

---

## 📊 Sprint 1 Satisfaction Score

Each team member rated their satisfaction (1-5):

| Member | Score | Comment |
|--------|-------|---------|
| Risly | ⭐⭐⭐⭐⭐ (5) | "All backlog items delivered with premium quality — exceeded expectations" |
| Misha | ⭐⭐⭐⭐ (4) | "Great velocity but wish we had more time for testing" |
| Fathir | ⭐⭐⭐⭐ (4) | "Code quality is high but no tests makes me nervous for future sprints" |
| Sultan | ⭐⭐⭐⭐⭐ (5) | "Process ran smoothly, team collaboration was excellent" |

**Average:** 4.5 / 5.0

---

## 🎯 Key Takeaway

> Sprint 1 was a resounding success in terms of delivery velocity and feature completeness. However, the team needs to invest in quality infrastructure (testing, CI/CD, code reviews) in Sprint 2 to maintain this momentum sustainably. Speed without quality assurance is a technical debt risk.

---

*Documented by: Sultan Zhalifunnas Musyaffa (Scrum Master)*  
*Date: April 17, 2026*
