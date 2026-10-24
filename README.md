Demo
Live demo: https://ai-app-capstone-proj-57go.bolt.host

# CivicPulse

CivicPulse is a community-driven civic reporting platform that helps residents report local problems, surface neighborhood issues, and support responsive civic action. The current version focuses on a reliable, free local workflow for creating structured civic tickets and sharing them with the community.

## Overview

CivicPulse combines three core ideas:

- Community reporting: residents can quickly describe issues from their phone or desktop.
- Community prioritization: neighbors can upvote reports to show which problems deserve more attention.
- Civic visibility: a shared feed and dashboard help people track what is being reported and what is being resolved.

<<<<<<< Updated upstream
=======
## What’s new

- Ticket generation uses a built-in fallback system instead of depending on an external AI API.
- No external AI key is required for the default experience.
- The app remains free to run for basic report generation and submission.
- The frontend and Supabase-backed report flow have been verified successfully.

## Key features
>>>>>>> Stashed changes

- Report civic issues such as potholes, streetlights, graffiti, trash, sidewalks, water leaks, and more
- Upload a photo or provide a photo URL for evidence
- Generate a structured municipal-style ticket with a suggested department, priority, and action steps
- Upvote reports to show community priority
- Browse a community feed and neighborhood dashboard
- Track report lifecycle states such as submitted, acknowledged, in progress, and resolved
- Route reports to departments such as Public Works, Transportation, Street Lighting, Sanitation, and Water Utilities

## User flow

1. A resident opens the app and clicks Report an Issue.
2. They describe the problem, select a category and severity, and add optional location or photo details.
3. The app generates a structured ticket with a suggested department, priority, and action steps.
4. The report is saved to Supabase and appears in the community feed.
5. Other residents can review and upvote it from the feed or dashboard.
6. Status updates can be reflected over time as issues move through resolution.

## Data model

The app stores reports and upvotes in Supabase.

## Database Schema

### reports Table

| Column | Type | Description |
| --- | --- | --- |
| id | uuid | Unique identifier for each report |
| title | text | Short title of the civic issue |
| description | text | Full description entered by the user |
| category | text | Issue category such as pothole, streetlight, trash, or water |
| severity | text | Severity level such as low, medium, high, or urgent |
| status | text | Current lifecycle state of the report |
| location_text | text | Human-readable location entered by the user |
| photo_url | text | Optional URL or local image reference for evidence |
| ai_department | text | Department suggested by the ticket generator |
| ai_priority | text | Priority suggested by the ticket generator |
| ai_action_items | json | Structured list of recommended actions |
| ai_summary | text | AI-generated summary of the report |
| client_id | text | Client identifier used to avoid duplicate submissions |
| upvote_count | integer | Number of community upvotes |
| created_at | timestamptz | Timestamp when the report was created |

### upvotes Table

| Column | Type | Description |
| --- | --- | --- |
| id | uuid | Unique identifier for the upvote |
| report_id | uuid | Reference to the report being upvoted |
| client_id | text | Client identifier for the user who voted |
| created_at | timestamptz | Timestamp when the upvote was created |

### Notes

Each upvote links a client ID to a specific report so duplicate voting is reduced.

## Tech stack

| Domain | Technology | Description |
| --- | --- | --- |
| Frontend | React + TypeScript | Builds the user interface and app interactions |
| Build tool | Vite | Fast development server and production bundling |
| Styling | Tailwind CSS | Utility-first styling for responsive UI components |
| UI icons | Lucide React | Clean icon set for navigation, actions, and status indicators |
| Backend / Data | Supabase | Stores reports and upvotes in a PostgreSQL database |
| App logic | TypeScript | Powers the report flow, ticket generation, and UI state |

## Project structure

- src/pages: Feed, Report, Dashboard, and report-detail views
- src/components: shared UI layout and badges
- src/lib: Supabase client and ticket-generation logic
- supabase/: database schema and migration files

## Local setup

### Prerequisites

- Node.js 18 or newer
- npm
- A Supabase project for the database connection

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a .env file in the project root with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Run locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for production

```bash
npm run build
```

## AI generation behavior

The current app uses a built-in fallback generator to create:

- a ticket summary
- a relevant department
- a priority level
- action items

This keeps the app free and dependable without requiring an external API subscription. If you later want stronger AI quality, you can optionally wire in a paid external model.

## Current status

- Frontend: working
- Supabase connection: working
- Report creation flow: working
- Ticket generation: available through the built-in fallback flow
- Community feed and dashboard: loading report data successfully

## Architecture & system design

CivicPulse follows a simple three-layer architecture:

### 1. Frontend layer

- Built with React, TypeScript, and Vite
- Handles the user experience for reporting, browsing, upvoting, and dashboard views
- Uses Tailwind CSS for styling and Lucide icons for interface elements

### 2. Application layer

- The report form collects issue details and sends them to the app logic
- The built-in fallback ticket generator converts the report into a structured civic ticket
- The app manages page state, selected reports, and user interactions

### 3. Data layer

- Supabase stores reports and upvotes in a PostgreSQL database
- The frontend reads report data from Supabase and writes new submissions and upvotes back to the database
- This creates a shared source of truth for the feed, dashboard, and report detail views

### High-level flow

```text
User -> React frontend -> Report form / Ticket generator -> Supabase database
                                  \-> Feed and dashboard views <-/
```

### Design goals

- Keep the app lightweight and easy to run locally
- Use a free fallback generator so the app works without an external AI API key
- Make the data model simple and easy to extend
- Support community-driven prioritization through upvotes


## License

This project is intended for educational and demo purposes.
Support community-driven prioritization through upvotes

License

This project is intended for educational and demo purposes.

## 👤 Author

**Minahil Ashraf**
- GitHub: [minahil607](https://github.com/minahil-607)
- LinkedIn: [Minahil Ashraf](https://www.linkedin.com/in/minahil-ashraf-695812391)
- Email: minahilashraf669@gmail.com

---

⭐ If you found this project useful, consider giving it a star!
