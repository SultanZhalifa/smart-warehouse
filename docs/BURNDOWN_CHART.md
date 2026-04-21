# Burndown Charts -- Smart Warehouse

This document tracks the sprint progress using burndown data.

---

## Sprint 1 Burndown

**Committed:** 21 Story Points (but we ended up completing 60)

| Day | Date | Planned Remaining | Actual Remaining | Notes |
|-----|------|:-----------------:|:----------------:|-------|
| 0 | Apr 14 | 21 | 60 | Sprint start. We decided to pull in extra backlog items since setup went fast |
| 1 | Apr 14 | 18 | 52 | Project scaffolding done, design system created, backlogs defined |
| 2 | Apr 15 | 13 | 37 | Login page, layout components, auth context, warehouse context all done |
| 3 | Apr 16 | 7 | 16 | Dashboard, detection page, inventory, zones completed |
| 4 | Apr 17 | 0 | 0 | Alerts, analytics, activity log done. All items complete |

```
Story Points Remaining
60 |*
   |  \
50 |   *
   |    \
40 |     \
   |      *
30 |       \
   |        \
20 |         \
   |          *
10 |           \
   |            \
 0 |             *
   +--+--+--+--+--
     D0 D1 D2 D3 D4

   * = Actual progress
```

Notes: The burndown shows a steep decline because the team was very productive. We pulled in backlog items from later sprints once we realized we had momentum. The "Planned Remaining" line was adjusted after Day 0 when we expanded scope.

---

## Sprint 2 Burndown

**Committed:** 23 Story Points

| Day | Date | Planned Remaining | Actual Remaining | Notes |
|-----|------|:-----------------:|:----------------:|-------|
| 0 | Apr 18 | 23 | 23 | Sprint start, tasks assigned |
| 1 | Apr 18 | 17 | 18 | Export module done, Settings wireframes done, RBAC requirements defined |
| 2 | Apr 19 | 12 | 10 | RoleRoute implemented, Settings Profile tab done, export buttons wired, LiveEventSimulator built |
| 3 | Apr 20 | 6 | 5 | Remaining Settings tabs done, zone filter added, notifications polished |
| 4 | Apr 21 | 0 | 0 | Final testing, documentation, git push. All items complete |

```
Story Points Remaining
24 |
   |
20 |*
   | \  *
16 |  \/
   |   \
12 |    \
   |     *
 8 |      \
   |       \
 4 |        *
   |         \
 0 |          *
   +--+--+--+--+--
     D0 D1 D2 D3 D4

   * = Actual progress
```

Notes: Sprint 2 had a more predictable burndown compared to Sprint 1. The scope was fixed from the start and we didnt pull in extra items. The slight bump on Day 1 was because the PAT token issue slowed down the workflow for a bit.

---

## Velocity Chart

| Sprint | Committed | Delivered | Velocity |
|--------|:---------:|:---------:|:--------:|
| Sprint 1 | 21 | 60 | 285% |
| Sprint 2 | 23 | 23 | 100% |

Sprint 1 had unusually high velocity because we pulled in work from future sprints. Sprint 2 is more representative of our normal pace -- we committed to 23 points and delivered exactly 23.

---

Date: April 21, 2026
