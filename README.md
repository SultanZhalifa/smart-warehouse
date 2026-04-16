# 🏭 Smart Warehouse — Object Detection System

<div align="center">

**AI-Powered Object Detection & Inventory Management for Modern Warehouses**

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

## 📋 Table of Contents
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

## 📖 About the Project

**Smart Warehouse** is an AI-powered warehouse management system that uses object detection technology to automate inventory tracking, monitor warehouse zones, and generate real-time analytics. Built as a Software Engineering project at **President University**, this application demonstrates the full Scrum/Agile methodology from product backlog creation to sprint delivery.

### Key Objectives
- Real-time object detection visualization with bounding box overlays
- Automated inventory management with CRUD operations
- Multi-zone warehouse monitoring with floor plan visualization
- Alert system for anomalies and threshold violations
- Comprehensive analytics dashboard with Chart.js visualizations

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Role-based login (Admin, Manager, Operator) with protected routes |
| 📊 **Dashboard** | Real-time KPI cards, camera feeds, activity feed, system health |
| 🎯 **Object Detection** | Canvas-based simulation with animated bounding boxes and detection log |
| 📦 **Inventory** | Full CRUD, search, category filters, sortable table, stock alerts |
| 🔔 **Alert Center** | Severity-based filtering, read/unread state, zone-linked alerts |
| 📈 **Analytics** | 5 chart types with Chart.js, date range selection, export option |
| 🗺️ **Zone Management** | Interactive floor plan, utilization tracking, capacity monitoring |
| 📋 **Activity Log** | Complete audit trail with type filters and timeline view |
| 🎨 **Premium UI** | Dark cyber theme, glassmorphism, neon accents, smooth animations |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Build Tool** | Vite 8.x | Fast development server and bundling |
| **Frontend** | React 19 | Component-based UI framework |
| **Styling** | Vanilla CSS | Custom design system with CSS variables |
| **Charts** | Chart.js + react-chartjs-2 | Data visualization |
| **Icons** | Lucide React | Consistent icon system |
| **Routing** | React Router v6 | Client-side routing with auth guards |
| **State** | Context API + useReducer | Centralized state management |
| **Canvas** | HTML5 Canvas API | Object detection simulation |

---

## 👥 Team Members and Roles

| Scrum Role | Name | Student ID | Responsibilities |
|------------|------|------------|-----------------|
| **Product Owner** | Risly Maria Theresia Worung | 001202400069 | Product vision, backlog prioritization, sprint acceptance |
| **Scrum Master** | Sultan Zhalifunnas Musyaffa | 001202400200 | Facilitate ceremonies, remove blockers, process adherence |
| **Developer** | Misha Andalusia | 001202400040 | Frontend development, UI/UX, visualization components |
| **Developer** | Fathir Barhouti Awlya | 001202400054 | Backend logic, data management, detection algorithms |

---

## 📋 Product Backlogs

| # | Backlog Item | Priority | Story Points | User Story |
|---|-------------|----------|-------------|------------|
| 1 | Dashboard Overview | ⭐ High | 8 | As a manager, I want a real-time dashboard to monitor operations at a glance |
| 2 | Object Detection Interface | ⭐ High | 13 | As an operator, I want to see detected objects with bounding boxes |
| 3 | Inventory Management | ⭐ High | 8 | As staff, I want to manage inventory items to track stock levels |
| 4 | Real-Time Alert System | 🟡 Medium | 5 | As a manager, I want alerts when unusual objects are detected |
| 5 | Analytics and Reporting | 🟡 Medium | 8 | As a manager, I want analytics for data-driven decisions |
| 6 | Zone Management | 🟡 Medium | 8 | As a planner, I want to define zones for location tracking |
| 7 | User Authentication | 🔵 Low | 5 | As an admin, I want role-based access control |
| 8 | Activity Log and Audit Trail | 🔵 Low | 5 | As an auditor, I want to review all system activities |

**Total Story Points:** 60

---

## 🏃 Sprint Documentation

### Sprint 1 (Week 1) — Foundation and Core
- **Sprint Goal:** Establish project architecture, design system, authentication, and dashboard
- **Committed:** 21 points | **Delivered:** 60 points
- **Velocity:** 285%
- **Report:** [SPRINT_1_REPORT.md](./SPRINT_1_REPORT.md)
- **Retrospective:** [SPRINT_RETROSPECTIVE.md](./SPRINT_RETROSPECTIVE.md)
- **Daily Standups:** [DAILY_STANDUP_LOG.md](./DAILY_STANDUP_LOG.md)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/smart-warehouse.git

# Navigate to project directory
cd smart-warehouse

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Demo Credentials
| User | Email | Role | Password |
|------|-------|------|----------|
| Risly | risly@warehouse.io | Admin | admin123 |
| Misha | misha@warehouse.io | Manager | admin123 |
| Fathir | fathir@warehouse.io | Operator | admin123 |
| Sultan | sultan@warehouse.io | Admin | admin123 |

---

## 📁 Project Structure

```
smart-warehouse/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   └── layout/           # Sidebar, Header, Layout
│   ├── context/              # AuthContext, WarehouseContext
│   ├── data/                 # Mock data layer
│   ├── pages/                # All 8 page components
│   ├── index.css             # Design system (50+ tokens)
│   ├── App.jsx               # Root + routing
│   └── main.jsx              # Entry point
├── SPRINT_1_REPORT.md
├── SPRINT_RETROSPECTIVE.md
├── DAILY_STANDUP_LOG.md
└── README.md
```

---

## 📐 Scrum Methodology

### Definition of Done (DoD)
- Feature is fully implemented and functional
- Code follows project conventions
- UI is responsive and matches design system
- Feature tested manually with no console errors
- Code committed with descriptive message
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

**Built with ❤️ by Group 5 — President University**

Risly · Misha · Fathir · Sultan

</div>
