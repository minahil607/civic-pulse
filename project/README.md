# CivicPulse — Report. Resolve. Rebuild.

> Turn neighborhood complaints into structured municipal tickets with AI. Citizens report hyper-local issues, AI generates a professional work order, and the community upvotes to build civic momentum.

**Live app:** _(add your deployed URL here)_
**Repository:** _(add your GitHub repo URL here)_

---

## The Problem

Citizens see civic problems every day — potholes, broken streetlights, graffiti, water leaks — but reporting them is frustrating. You call a city hotline, describe the problem in your own words to a dispatcher, and hope it gets to the right department. There's no visibility into what happens next, no way to know if others reported the same issue, and no feedback loop.

Meanwhile, city workers receive unstructured complaints with no category, no priority, and no routing. A dangerous pothole at a school crossing gets the same treatment as a faded stop sign on a quiet cul-de-sac.

## How CivicPulse Solves It

CivicPulse flips the model: citizens describe the problem in plain language, **AI transforms it into a structured municipal ticket** with department routing, priority level, and action items, and the community upvotes issues to build pressure. Everyone can see what's been reported, what's being done, and what's resolved.

### The Flow

1. **A citizen reports an issue** — they describe it in plain language, pick a category and severity, and add a location.
2. **AI generates a municipal ticket** — the AI analyzes the description and produces a professional work order: a concise summary, the responsible department, a priority level, and concrete action items.
3. **The report goes to the community feed** — neighbors can see it, upvote it, and share it.
4. **Status tracking** — every report moves through Submitted → Acknowledged → In Progress → Resolved, visible to everyone.
5. **Dashboard analytics** — the neighborhood dashboard shows resolution rates, top categories, and department routing stats.

## The AI Feature

CivicPulse's core feature is **AI-powered municipal ticket generation**. When a citizen submits a description, the app sends it to a large language model (Claude Haiku) with a carefully engineered system prompt that instructs the model to:

- Act as a municipal ticket classifier
- Produce a professional work-order summary (not a citizen complaint)
- Route the issue to the correct municipal department (Public Works, Street Lighting, Sanitation, etc.)
- Assign a priority level based on public safety risk (Urgent → Low)
- Generate 2-4 concrete, actionable steps the department should take
- Return **only valid JSON** in a strict schema

The AI prompt was written from scratch for this project. It encodes domain knowledge about municipal department structures and priority classification rules.

**Prompt source:** [`src/lib/ai.ts`](src/lib/ai.ts) — `SYSTEM_PROMPT` constant

**Fallback:** If the AI service is unavailable, CivicPulse uses a rule-based fallback that maps categories to departments and action items, so the app always produces a usable ticket.

## Features

- **AI ticket generation** — plain-language description → structured work order with department, priority, and action items
- **Community feed** — browse all reported issues, filter by category, sort by recent or top
- **Upvoting** — one vote per browser per report (prevents spam via unique client IDs)
- **Report detail page** — full AI ticket, status timeline, photo evidence, share button
- **Status tracking** — reports move through 4 stages: Submitted → Acknowledged → In Progress → Resolved
- **Neighborhood dashboard** — resolution rate, top categories, department routing stats, status breakdown
- **No login required** — a per-browser client ID (stored in localStorage) tracks who reported and who upvoted
- **Responsive design** — works on mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS with a custom design system |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL + Row-Level Security) |
| AI | Claude Haiku via Anthropic API (proxied through Vite dev server) |
| Hosting | Vercel (frontend) + Supabase (backend) |

## Architecture

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  React App   │──────▶│  Vite Proxy  │──────▶│  Claude AI    │
│  (browser)   │       │  /api/ai     │       │  (Haiku)      │
└──────┬───────┘       └──────────────┘       └──────────────┘
       │
       │ read/write (anon key)
       ▼
┌──────────────────────────────┐
│   Supabase PostgreSQL        │
│  reports · upvotes          │
│  (Row-Level Security enabled) │
└──────────────────────────────┘
```

- The **frontend** talks to Supabase directly for all CRUD operations (reports, upvotes) using the anon key.
- The **AI call** goes through a Vite dev proxy (`/api/ai`) that forwards to the Anthropic API. In production, this would be replaced with a Supabase Edge Function or Vercel serverless function.
- **Row-Level Security** is enabled on all tables with `anon, authenticated` policies since this is a public, no-auth app.

## Database Schema

Two tables, both with RLS enabled:

- **`reports`** — a citizen-reported civic issue with AI-generated ticket data
  - `title`, `description`, `category`, `severity`, `location_text`, `photo_url`
  - `ai_summary`, `ai_department`, `ai_priority`, `ai_action_items` (AI-generated)
  - `status` (submitted → acknowledged → in_progress → resolved)
  - `client_id` (per-browser identifier), `upvote_count` (denormalized)

- **`upvotes`** — a vote of support on a report
  - `report_id`, `client_id`, unique constraint on (report_id, client_id) to prevent duplicate votes

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### Install & Run

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the SQL from the migration in `supabase/migrations/` in the Supabase SQL editor to create the `reports` and `upvotes` tables with their RLS policies.

### AI Configuration

The AI feature uses the Anthropic API (Claude Haiku) proxied through Vite's dev server. The proxy is configured in `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api/ai': {
      target: 'http://localhost:9091/proxy/anthropic/v1/messages',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/ai/, ''),
    },
  },
},
```

For production deployment, replace the Vite proxy with a serverless function (Vercel function or Supabase Edge Function) that calls the Anthropic API with a real API key stored as an environment variable. The fallback rule-based ticket generator ensures the app works even without AI access.

## Deployment

### Frontend → Vercel

1. Push this repository to GitHub.
2. Import the repo into [Vercel](https://vercel.com).
3. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Vercel's project settings.
4. Deploy. Vercel auto-detects Vite.

### Backend → Supabase

The Supabase project provides the database. Apply the migration SQL to create tables and policies. No additional backend deployment is needed.

### AI in Production

For the AI feature to work in production, set up a serverless function that:
1. Receives the report description from the frontend.
2. Calls the Anthropic API (or any LLM provider) with the system prompt from `src/lib/ai.ts`.
3. Returns the structured ticket JSON.

Store the API key as an environment variable in Vercel or Supabase. The rule-based fallback in `src/lib/ai.ts` (`ruleBasedFallback`) ensures the app still generates tickets if the AI service is unavailable.

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── AppShell.tsx          # Navigation + layout
│   │   └── Badges.tsx            # Category, severity, status badges
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client singleton
│   │   ├── ai.ts                 # AI ticket generation + fallback
│   │   └── clientId.ts           # Per-browser ID for upvote tracking
│   ├── pages/
│   │   ├── FeedPage.tsx          # Community feed with filtering + upvoting
│   │   ├── ReportPage.tsx        # Report submission with AI ticket generation
│   │   ├── ReportDetail.tsx      # Single report with AI ticket + status timeline
│   │   └── DashboardPage.tsx     # Neighborhood analytics dashboard
│   ├── types.ts                  # Shared TypeScript types + metadata
│   ├── App.tsx                   # Root + view routing
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Design system + Tailwind
├── supabase/
│   └── migrations/
│       └── 0001_create_civicpulse_schema.sql
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Design Decisions

- **No login required** — CivicPulse uses a per-browser client ID (stored in localStorage) instead of user accounts. This lowers the barrier to entry: anyone can report and upvote without signing up. The trade-off is that votes are tied to browsers, not people, but for a community reporting tool this is the right tradeoff.
- **AI as a classifier, not a chatbot** — The AI doesn't chat with users. It takes structured input (description + category + severity) and produces structured output (a work ticket). This is a deliberate design choice: the AI augments the workflow, not the conversation.
- **Rule-based fallback** — If the AI service is down, the app still generates a usable ticket from category-to-department mappings. This ensures the app is never broken by an AI outage.
- **Public data model** — All reports are visible to everyone. This is intentional: civic transparency means you can see what your neighbors are reporting and whether it's being addressed.

## Future Improvements

- Geolocation and map view for spatial browsing of reports
- Photo upload (currently supports URL only)
- City worker dashboard with ticket assignment and status management
- Email/SMS notifications when a report's status changes
- Duplicate detection — AI identifies similar reports and suggests merging
- Weekly neighborhood digest email

## License

MIT
