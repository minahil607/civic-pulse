# CivicPulse

**Report. Resolve. Rebuild.**

Empowering communities through AI-assisted civic reporting and democratic neighborhood prioritization.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ai--app--capstone--proj--57go.bolt.host-0284c7?style=for-the-badge&logo=globe)](https://ai-app-capstone-proj-57go.bolt.host)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database_&_Auth-3ECF8E?style=flat&logo=supabase)](https://supabase.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [User Workflow](#user-workflow)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

## 🏛️ Overview

CivicPulse is an AI-driven, hyper-local civic engagement platform designed to bridge the gap between residents and municipal governments. 

**The Problem:** Neighborhood issues like potholes, broken streetlights, and water leaks often go unreported or unresolved due to unclear reporting processes and lack of community visibility.

**The Solution:** CivicPulse combines natural language AI parsing with community-driven upvoting. Citizens simply describe the issue in plain text. Our AI engine instantly analyzes the problem, categorizes it, routes it to the appropriate department, and prioritizes it based on urgency and community support.

---

## ✨ Key Features

### 1. 🤖 AI-Powered Municipal Ticket Generation

- **Natural Language Parsing:** Accepts raw citizen descriptions (e.g., "There is a huge pothole near Oak St & 3rd Ave causing cars to swerve into oncoming traffic")
- **Automated Categorization:** Classifies reports into categories such as Pothole, Streetlight, Water/Leak, Sanitation, Sidewalk, Graffiti, or Traffic Signs
- **Department Routing:** Automatically assigns tickets to the responsible department (e.g., Public Works, Transportation, Water Utilities)
- **Smart Priority Leveling:** Evaluates safety risks and assigns priority ranks (Low, Medium, High, Critical)
- **Actionable Work Steps:** Generates 2–4 concrete, itemized steps for field repair crews

### 2. 👍 Community Upvoting & Democratic Prioritization

- **Neighborhood Voice:** Residents upvote issues affecting their area to build community momentum
- **Smart Sorting:** Filter feed by "Most Upvoted" to help city administrators identify high-impact issues
- **Duplicate Mitigation:** Public visibility lets neighbors upvote existing reports rather than file duplicates

### 3. 📊 Real-Time Neighborhood Dashboard

- **Civic Metrics:** Tracks total community reports, overall upvotes, and resolution metrics
- **Resolution Progress:** Visual indicators showing percentage of reported issues successfully resolved
- **Category Breakdown:** Displays top issue categories to inform urban planning decisions

### 4. 🔍 Advanced Filtering & Status Tracking

- **Filter by Category:** Narrow down issues by type (Pothole, Streetlight, Water, etc.)
- **Filter by Status:** Track tickets across lifecycle stages:
  - 🟡 **Pending** — Submitted and awaiting municipal dispatch
  - 🔵 **In Progress** — Work order issued to field crews
  - 🟢 **Resolved** — Issue repaired and verified

---

## 📐 Architecture

```
┌──────────────────────┐         ┌─────────────────────────┐
│ Citizen Submission   │────────▶│  CivicPulse Frontend    │
│ (Text + Location)    │         │ React 19 + TypeScript   │
└──────────────────────┘         └─────────────────────────┘
                                           │
                                           ▼
                        ┌─────────────────────────────┐
                        │   AI Engine Processing      │
                        │ • Categorization            │
                        │ • Department Routing        │
                        │ • Priority Evaluation       │
                        │ • Action Plan Generation    │
                        └─────────────────────────────┘
                                           │
                                           ▼
┌──────────────────────┐         ┌─────────────────────────┐
│ Community Dashboard  │◀────────│  Supabase Backend       │
│ & Upvoting           │         │ PostgreSQL + Real-time  │
└──────────────────────┘         └─────────────────────────┘
```

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
|--------|-----------|-------------|
| **Frontend Framework** | React 19 | Modern functional components |
| **Language** | TypeScript 5.8 | End-to-end type safety |
| **Styling** | Tailwind CSS v4 | Responsive, utility-first design |
| **Icons** | Lucide React | Clean, accessible vector icons |
| **Typography** | Plus Jakarta Sans & Newsreader | High-contrast, legible fonts |
| **Database & Auth** | Supabase (PostgreSQL) | Persistent storage, real-time sync, RLS |
| **AI Integration** | Claude / Gemini API | Natural language analysis |
| **Build System** | Vite | Fast module bundling |

---

## 🗄️ Database Schema

### reports Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Unique report identifier |
| `description` | text | Raw text description from user |
| `category` | varchar | Type: pothole, streetlight, water, sanitation, etc. |
| `location` | text | Street address or intersection |
| `priority` | varchar | Urgency: Low, Medium, High, Critical |
| `department` | varchar | Target municipal department |
| `action_steps` | jsonb / array | AI-generated repair steps |
| `status` | varchar | pending, in_progress, resolved |
| `upvote_count` | integer | Total community upvotes |
| `created_at` | timestamptz | Submission timestamp |

### upvotes Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Unique upvote entry ID |
| `report_id` | uuid (FK) | Reference to reports.id |
| `client_id` / `user_id` | text | Unique identifier (prevents duplicates) |
| `created_at` | timestamptz | When upvote was cast |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm** or **pnpm**
- **Supabase Account** (optional for local development with mock credentials)

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/minahil607/civic-pulse.git
cd civic-pulse
```

**2. Install dependencies:**

```bash
npm install
```

**3. Configure environment variables:**

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

**4. Start the development server:**

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`

**5. Build for production:**

```bash
npm run build
```

---

## 📱 User Workflow

### Step 1: Report an Issue
- Click "Report an Issue" in the navigation bar
- Provide a description and location details

### Step 2: AI Ticket Generation
- Click "Generate AI Ticket"
- AI instantly analyzes, categorizes, and creates an actionable ticket

### Step 3: Submit to Community
- Review the AI-generated ticket and click "Submit Report"

### Step 4: Community Engagement
- Neighbors view issues on the Neighborhood Dashboard
- Click "Upvote" to boost ticket priority
- Status badges update as departments resolve issues

---

## 🔮 Future Roadmap

- 🗺️ **Interactive GIS Map View** — Visual map pins showing reports across city sectors
- 👨‍💼 **Municipal Administrator Portal** — Specialized interface for city workers to update statuses
- 📸 **Photo Upload & Computer Vision** — Automatic visual classification of issue photos
- 📲 **SMS & Email Notifications** — Alerts when neighborhood issues are marked "In Progress" or "Resolved"

---

## 📄 License

This project was built for the AI Application Capstone and is distributed under the **Apache 2.0 License**.

**Live Application:** [https://ai-app-capstone-proj-57go.bolt.host](https://ai-app-capstone-proj-57go.bolt.host)

---

**Tagline:** Report. Resolve. Rebuild. 🏛️
