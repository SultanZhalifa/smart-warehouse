<div align="center">

# Smart Warehouse: Bio-Hazard and Pest Detection System

</div>

<div align="center">

**AI-Powered Pest Detection and Warehouse Monitoring for PT. Kawan Lama**

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Team Members and Roles](#team-members-and-roles)
- [Product Backlogs](#product-backlogs)
- [Sprint Documentation](#sprint-documentation)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scrum Methodology](#scrum-methodology)

---

## About the Project

Smart Warehouse is a web-based system designed to detect bio-hazard and pest presence in warehouse environments using real AI object detection. The system focuses on improving safety by identifying potentially harmful animals such as snakes, cats, and geckos, and preventing contamination through automated alert mechanisms.

The platform connects to a live Supabase PostgreSQL database for all data operations and routes AI detection through a FastAPI backend (`/api/detect`). Detection uses real YOLOv8 inference through the Roboflow API. You must configure `ROBOFLOW_MODEL` and `ROBOFLOW_API_KEY` in `backend/.env`; the backend does not return synthetic predictions.

This project was developed as part of a Software Engineering course at President University using the Scrum methodology.

## Bio-Hazard Detection Context

This project focuses on detecting animals such as snakes, cats, and geckos that may pose risks in warehouse environments. The system aims to improve safety and prevent contamination through early detection and alert mechanisms.

## Detection Workflow

1. Operator uploads a warehouse image or captures from webcam
2. Image is sent to the FastAPI backend endpoint (`/api/detect`)
3. Backend calls Roboflow for YOLOv8 inference on the image
4. AI model detects and classifies pest species with confidence scores
5. System assigns threat severity levels (high, medium, low)
6. Alerts are automatically created in the database
7. Results are persisted to detection_results table for analytics
8. Activity log records the scan event with the operator's name

### What This Project Does

- Performs real AI-powered detection of snakes, cats, and geckos using YOLOv8 via Roboflow
- Stores all detection results, alerts, and activity logs in a live Supabase database
- Provides role-based authentication with login, registration, and password recovery
- Manages inventory items with search, filtering, and CRUD operations
- Monitors 6 warehouse zones with camera surveillance tracking
- Generates real-time analytics charts from actual database records
- Sends severity-based alerts when pests are detected

---

## Screenshots

### Login Page
![Login Page](./docs/screenshots/login.png)

### Dashboard
![Dashboard](./docs/screenshots/dashboard.png)

### AI Pest Detection
![AI Detection](./docs/screenshots/ai-detection.png)

### Pest Simulator (canvas visualization only)
This page animates bounding boxes for UX and layout testing. It is not a substitute for the Roboflow model used on the AI Pest Detection page.

![Pest Simulator](./docs/screenshots/detection.png)

### Inventory Management
![Inventory](./docs/screenshots/inventory.png)

### Alert Center
![Alerts](./docs/screenshots/alerts.png)

### Analytics and Reports
![Analytics](./docs/screenshots/analytics.png)

### Zone Management
![Zones](./docs/screenshots/zones.png)

### Settings
![Settings](./docs/screenshots/settings.png)

---

## Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Supabase-based auth with role-based access (Admin, Manager, Operator), login, registration, and password reset |
| **Dashboard** | Overview page with KPI cards, live camera feeds, activity feed, and system health indicators |
| **AI Pest Detection** | Upload images to the FastAPI backend for YOLOv8 inference and automatic database persistence (detections, alerts, activity log) |
| **Pest Simulator** | Canvas-based visualization with animated bounding boxes and a live detection log |
| **Inventory** | Full CRUD operations, search, category and zone filters, sortable table, CSV export |
| **Alert Center** | Severity-based filtering (critical, warning, info), read and unread state management |
| **Analytics** | 5 chart types powered by real database queries. Hourly trend, weekly distribution, species breakdown, zone activity, and threat resolution |
| **Zone Management** | Interactive floor plan with utilization tracking per zone |
| **Activity Log** | Audit trail with type-based filters and timeline view, exportable to CSV |
| **Settings** | Profile editing, notification preferences, theme customization, security settings |
| **Dark UI Theme** | Custom dark theme with glassmorphism effects and accent colors |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Build Tool** | Vite 8.x | Development server and bundling |
| **Frontend** | React 19 | Component-based UI |
| **Backend API** | FastAPI + Uvicorn | Detection endpoint, Roboflow integration, persistence orchestration |
| **Database/Auth** | Supabase | PostgreSQL database, authentication, Row Level Security |
| **AI Inference** | Roboflow API | YOLOv8 pest detection model hosting and inference |
| **Styling** | Vanilla CSS | Custom design system with CSS variables |
| **Charts** | Chart.js + react-chartjs-2 | Data visualization from real database queries |
| **Icons** | Lucide React + Custom SVG | Icon system with custom pest species icons |
| **Routing** | React Router v6 | Client-side routing with auth guards |
| **State** | Context API + useReducer | Global state management with Supabase data |

---

## Team Members and Roles

| Scrum Role | Name | Student ID | Responsibilities |
|------------|------|------------|-----------------|
| **Product Owner** | Risly Maria Theresia Worung | 001202400069 | Manages product vision, backlog prioritization, sprint acceptance |
| **Scrum Master** | Sultan Zhalifunnas Musyaffa | 001202400200 | Facilitates ceremonies, removes blockers, ensures process adherence |
| **Developer** | Misha Andalusia | 001202400040 | Frontend development, UI/UX, data export features |
| **Developer** | Fathir Barhouti Awlya | 001202400054 | State management, detection system, real-time notifications |

---

## Product Backlogs

| # | Backlog Item | Priority | Story Points | User Story |
|---|-------------|----------|-------------|------------|
| 1 | Dashboard Overview | High | 8 | As a manager, I want a real-time dashboard to monitor operations at a glance |
| 2 | AI Pest Detection Interface | High | 13 | As an operator, I want to upload images and detect pests using AI |
| 3 | Inventory Management | High | 8 | As staff, I want to manage inventory items to track stock levels |
| 4 | Real-Time Alert System | Medium | 5 | As a manager, I want alerts when pests are detected in warehouse zones |
| 5 | Analytics and Reporting | Medium | 8 | As a manager, I want analytics from real detection data for decision making |
| 6 | Zone Management | Medium | 8 | As a planner, I want to define zones for location tracking |
| 7 | User Authentication | Low | 5 | As an admin, I want role-based access control with password recovery |
| 8 | Activity Log and Audit Trail | Low | 5 | As an auditor, I want to review all system activities |

**Total Story Points:** 60

---

## Sprint Documentation

### Sprint 1 (Week 1) -- Foundation and Core
- **Goal:** Set up project architecture, design system, authentication, and all 8 pages
- **Committed:** 21 points | **Delivered:** 60 points
- **Velocity:** 285%
- **Report:** [SPRINT_1_REPORT.md](./docs/SPRINT_1_REPORT.md)
- **Retrospective:** [SPRINT_RETROSPECTIVE.md](./docs/SPRINT_RETROSPECTIVE.md)

### Sprint 2 (Week 2) -- Enhancements
- **Goal:** Settings page, export system, real-time notifications, RBAC, advanced filters
- **Committed:** 23 points | **Delivered:** 23 points
- **Report:** [SPRINT_2_REPORT.md](./docs/SPRINT_2_REPORT.md)
- **Retrospective:** [SPRINT_2_RETROSPECTIVE.md](./docs/SPRINT_2_RETROSPECTIVE.md)

### Sprint 3 (Week 3) -- Production Integration
- **Goal:** Supabase backend, Roboflow AI integration, remove all mock data, password recovery, SVG icons
- **Report:** [SPRINT_3_REPORT.md](./docs/SPRINT_3_REPORT.md)

### Other Documents
- [Daily Standup Log](./docs/DAILY_STANDUP_LOG.md) -- Standup notes for all sessions
- [Sprint Review Notes](./docs/SPRINT_REVIEW_NOTES.md) -- Meeting notes from sprint reviews
- [Product Backlog](./docs/PRODUCT_BACKLOG.md) -- All 8 backlog items with user stories
- [Architecture Overview](./docs/ARCHITECTURE.md) -- System design, state management, routing
- [Database Design](./docs/DATABASE_DESIGN.md) -- Schema, tables, and relationships
- [Burndown Charts](./docs/BURNDOWN_CHART.md) -- Sprint progress tracking with velocity data

---

## Getting Started

### Prerequisites
- Node.js 18 or newer
- npm or yarn
- A Supabase project (free tier works)
- A Roboflow account, API key, and deployed model slug (required for AI Pest Detection)

### Installation

```bash
# Clone the repository
git clone https://github.com/SultanZhalifa/smart-warehouse.git

# Go to the project folder
cd smart-warehouse

# Install dependencies
npm install

# Copy the environment template and fill in your keys
cp .env.example .env

# Start the dev server
npm run dev
```

### Environment Variables

Create a `.env` file in the project root with the following:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:8000
```

### Backend setup (AI detection)

```bash
cd backend
cp .env.example .env
# Edit .env: Supabase service key, Roboflow model slug and API key
pip install -r requirements.txt
python app.py
```

Use `GET /api/health` to confirm the database connection. The field `roboflow_configured` should be true before running scans.

### Database Setup

1. Open your Supabase project SQL Editor
2. Run `scripts/schema.sql` to create all tables and RLS policies
3. Run `scripts/seed-data.sql` or `python backend/seed.py` to load initial warehouse records (real rows in PostgreSQL, reproducible from scripts)

Then open **http://localhost:5173** in your browser.

### Demo Credentials
| User | Email | Role | Password |
|------|-------|------|----------|
| Sultan | sultan@smartwh.io | Admin | admin123 |

---

## Project Structure

```
smart-warehouse/
├── src/
│   ├── components/
│   │   ├── common/           # Toast notifications
│   │   ├── icons/            # Custom SVG pest icons (Snake, Cat, Gecko)
│   │   └── layout/           # Sidebar, Header, Layout
│   ├── context/              # AuthContext, WarehouseContext (Supabase)
│   ├── lib/                  # Supabase client, database helper functions
│   ├── pages/                # All 10 page components
│   ├── utils/                # Export utilities
│   ├── index.css             # Design system
│   ├── App.jsx               # Root component with routing
│   └── main.jsx              # Entry point
├── scripts/
│   ├── schema.sql            # Database schema (tables, RLS, triggers)
│   └── seed-data.sql         # Initial data for demo
├── docs/                     # Scrum documentation
└── README.md
```

---

## Scrum Methodology

### Definition of Done
- Feature is implemented and working properly
- All data comes from the Supabase database, no hardcoded values
- Code follows the project conventions
- UI matches the design system
- Feature tested manually with no console errors
- Code committed with a clear commit message
- Reviewed by at least one team member

### Sprint Ceremonies
| Ceremony | Frequency | Duration | Facilitator |
|----------|-----------|----------|-------------|
| Sprint Planning | Start of sprint | 1 hour | Scrum Master |
| Daily Standup | Daily | 15 min | Scrum Master |
| Sprint Review | End of sprint | 30 min | Product Owner |
| Sprint Retrospective | End of sprint | 30 min | Scrum Master |

---

<div align="center">

**Built by Group 5 -- President University**

Risly - Misha - Fathir - Sultan

</div>
