# Smart Warehouse — AI Handoff Document
> Copy-paste seluruh isi file ini ke chat pertama di akun baru supaya AI langsung ngerti konteks project tanpa ada yang kelewat.

---

## Project Overview

**Smart Warehouse** adalah web app untuk manajemen gudang berbasis AI object detection. Dibangun sebagai tugas kuliah Software Engineering di President University oleh Group 5 (Risly, Misha, Fathir, Sultan).

- **Repo GitHub**: https://github.com/SultanZhalifa/smart-warehouse
- **Tech Stack**: React 19 + Vite 8, Lucide React (icons), Chart.js, React Router v7
- **Lokasi Project**: `c:\Users\sulta\OneDrive\Desktop\Project Software Engineer`
- **Run Command**: `cmd /c "npm run dev"` (PowerShell punya issue execution policy, jadi selalu pakai `cmd /c`)

---

## Architecture & File Structure

```
src/
├── components/
│   ├── common/          # ToastContainer, LiveEventSimulator
│   └── layout/          # Header, Sidebar, Layout (+ CSS masing-masing)
├── context/
│   ├── AuthContext.jsx   # Login/auth state (demo users, no backend)
│   └── WarehouseContext.jsx  # Global state: inventory, alerts, activity log, toasts
├── data/
│   └── mockData.js       # OBJECT_CLASSES, ZONES, CAMERAS, INVENTORY, etc.
├── pages/
│   ├── DashboardPage     # KPI cards, live camera feeds, activity feed, system health
│   ├── DetectionPage     # Real-time canvas animation simulating YOLOv8 detection
│   ├── InventoryPage     # CRUD table with categories, zone filters, search
│   ├── AlertsPage        # Alert management with severity levels
│   ├── AnalyticsPage     # Charts (Chart.js) for detection trends
│   ├── ZonesPage         # Warehouse zone management
│   ├── ActivityPage      # Activity log timeline with type filters
│   ├── SettingsPage      # User profile, preferences, theme settings
│   └── LoginPage         # Auth page with quick-access demo users
├── utils/
│   └── exportUtils.js    # CSV, JSON, PDF export functions
├── index.css             # ** DESIGN SYSTEM ** (all CSS variables/tokens live here)
└── main.jsx              # App entry point with router
```

---

## Current Design System (IMPORTANT)

Theme: **Light Modern Minimalist** (Linear/Apple-inspired)

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#f8fafc` | Page background |
| `--color-bg-secondary` | `#ffffff` | Secondary surfaces |
| `--color-bg-tertiary` | `#f1f5f9` | Subtle backgrounds (search bar, pills) |
| `--color-bg-card` | `#ffffff` | Card backgrounds (pure white) |
| `--color-text-primary` | `#1a2332` | Main text |
| `--color-text-secondary` | `#5b6b7f` | Muted text |
| `--color-text-tertiary` | `#8a96a6` | Placeholder/label text |
| `--color-accent-primary` | `#4a90d9` | Primary accent (blue) |
| `--color-accent-secondary` | `#7c6cf0` | Secondary accent (purple) |
| `--color-accent-success` | `#3db8a9` | Success states (teal) |
| `--color-accent-danger` | `#d95459` | Error/danger states (red) |
| `--color-accent-warning` | `#e5a035` | Warning states (amber) |

### Design Principles Applied
- **Borders**: Ultra-thin, transparent (`rgba(0,0,0,0.05)`). NO colored borders.
- **Shadows**: Multi-layered, low-opacity (2-4%). Cards use `--shadow-sm` by default, `--shadow-md` on hover.
- **Hover effects**: `translateY(-1px)` with custom cubic-bezier curves, NOT heavy glows.
- **Typography**: Inter font, letter-spacing `-0.03em` on headings, `font-weight: 800` for h1/h2.
- **Transitions**: All use `cubic-bezier(0.16, 1, 0.3, 1)` instead of plain `ease`.
- **Buttons**: `font-weight: 500` (not 600), `padding: 8px 16px`.
- **Filter pills/tabs**: Active state = white background + subtle shadow, NOT blue tint.
- **Search bar**: Background `#f1f5f9`, border `transparent`, focus = white + `rgba(0,0,0,0.03)` ring.
- **Sidebar**: No border-right, uses single-pixel shadow `1px 0 0 rgba(0,0,0,0.05)`.
- **Header**: No border-bottom, uses `0 1px 0 rgba(0,0,0,0.05)` shadow.
- **Background decorations**: REMOVED (no blobs/orbs).

### Icons
- ALL icons are **Lucide React** SVG components. NO emojis anywhere in the codebase.
- Object classes in `mockData.js` use string icon names (`'Package'`, `'Layers'`, etc.) mapped to Lucide components via `ICON_MAP` in `DetectionPage.jsx`.

---

## Demo Users (Login)
| Name | Email | Password | Role |
|------|-------|----------|------|
| Risly | risly@warehouse.io | admin123 | Admin |
| Misha | misha@warehouse.io | admin123 | Manager |
| Fathir | fathir@warehouse.io | admin123 | Operator |
| Sultan | sultan@warehouse.io | admin123 | Admin |

---

## Data Persistence
- Currently using **in-memory state** via React Context (`WarehouseContext.jsx`).
- No backend, no database, no localStorage persistence (yet).
- Mock data is initialized from `mockData.js`.

---

## Documentation Files
All docs are in `docs/` folder:
- `DATABASE_DESIGN.md` — Database schema design
- `SPRINT_1_REPORT.md` — Sprint 1 progress report
- `DAILY_STANDUP_LOG.md` — Daily standup meeting logs
- `BURNDOWN_CHART.md` — Sprint burndown tracking
- `FLOWCHART.md` — Application flow diagrams

---

## Git Workflow
- Branch: `main` only
- Always commit with descriptive messages
- Push command: `powershell -NoProfile -Command "git push origin main"`
- Commit command: `powershell -NoProfile -Command "git add .; git -c core.editor=true commit -m 'message'"`

---

## Known Issues / Gotchas
1. **PowerShell execution policy**: Running `npm` directly in PowerShell fails. Always wrap with `cmd /c "npm run dev"`.
2. **Line endings**: Git shows CRLF warnings, can be ignored.
3. **No tests**: Unit tests (Vitest) are not implemented yet.
4. **No backend**: Everything is client-side mock data.

---

## What Was Done (Chronological)
1. Built the full React frontend from scratch (all pages, components, routing)
2. Implemented real-time canvas animation for object detection simulation
3. Added toast notification system with live event simulator
4. Created full CRUD for inventory management
5. Added CSV/JSON/PDF export functionality
6. Migrated from dark theme to light modern theme
7. Added smooth typewriter animation to search bar
8. Replaced ALL emojis with Lucide SVG icons
9. Upgraded UI/UX to premium minimalist style (Apple/Linear-inspired)
10. Removed shield icon from login page

---

## Style Rules for the AI
- Bahasa: Casual Indonesian (lo/gue), kayak ngobrol sama temen
- Docs (.md): Harus di-humanize, jangan terlalu formal/AI-like
- Always commit & push after changes
- Always verify UI changes with browser screenshots when possible
