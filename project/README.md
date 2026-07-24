🏛️ CivicPulse — Report. Resolve. Rebuild.
Empowering communities through AI-assisted civic reporting and democratic neighborhood prioritization.
![alt text](https://img.shields.io/badge/Live%20Demo-ai--app--capstone--proj--57go.bolt.host-0284c7?style=for-the-badge&logo=globe)

![alt text](https://img.shields.io/badge/React-18%2F19-61DAFB?style=flat&logo=react)

<<<<<<< HEAD
<<<<<<< HEAD
![alt text](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)
=======
=======
>>>>>>> 8243c6b04c8b5c403e7955c31deb4010c941714c
**Live app:** _https://ai-app-capstone-proj-57go.bolt.host
**Repository:** _(add your GitHub repo URL here)_
>>>>>>> 8243c6b04c8b5c403e7955c31deb4010c941714c

![alt text](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)

![alt text](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat&logo=supabase)

![alt text](https://img.shields.io/badge/AI-Structured%20Ticket%20Generation-8E44AD?style=flat)
📌 Executive Summary
CivicPulse is an AI-driven, hyper-local civic engagement platform designed to bridge the gap between residents and municipal governments. When neighborhood issues like potholes, broken streetlights, water leaks, or illegal dumping arise, traditional reporting methods are often slow, fragmented, and unclear about which city department should respond.
CivicPulse solves this by combining natural language AI parsing with community-driven upvoting. Citizens simply describe the issue in plain text. CivicPulse’s AI engine instantly analyzes the problem, categorizes it, auto-routes it to the correct municipal department, assigns an urgency priority, and constructs an actionable step-by-step work ticket for city crews. Neighbors can upvote issues to highlight community priorities and track resolution status in real time.
✨ Key Features
1. 🤖 AI-Powered Municipal Ticket Generation
Natural Language Parsing: Accepts raw citizen descriptions (e.g., "There is a huge pothole near Oak St & 3rd Ave causing cars to swerve into oncoming traffic").
Automated Categorization: Classifies reports into categories such as Pothole, Streetlight, Water/Leak, Sanitation, Sidewalk, Graffiti, or Traffic Signs.
Department Routing: Automatically assigns the ticket to the responsible department (e.g., Public Works, Department of Transportation, Water Utilities, Street Lighting).
Smart Priority Leveling: Evaluates safety risks and assigns priority ranks (Low, Medium, High, Critical).
Actionable Work Steps: Generates 2–4 concrete, itemized steps for field repair crews.
2. 👍 Community Upvoting & Democratic Prioritization
Neighborhood Voice: Residents upvote issues affecting their area to build community momentum.
Smart Sorting: Filter feed by Most Upvoted to help city administrators identify high-impact issues requiring urgent intervention.
Duplicate Mitigation: Public visibility lets neighbors upvote existing reports rather than filing duplicate complaints.
3. 📊 Real-Time Neighborhood Dashboard
Civic Metrics: Tracks total community reports, overall upvotes, and resolution metrics.
Resolution Progress Bar: Visual indicators showing the percentage of reported issues successfully resolved.
Category Breakdown: Displays top issue categories in the community to inform urban planning decisions.
4. 🔍 Advanced Filtering & Status Tracking
Filter by Category: Narrow down issues by Pothole, Streetlight, Water, Sanitation, Sidewalk, etc.
Filter by Status: Track tickets across lifecycle stages:
🟡 Pending: Submitted and awaiting municipal dispatch.
🔵 In Progress: Work order issued to field crews.
🟢 Resolved: Issue repaired and verified.
📐 Architecture & System Design
code
Code
+------------------------+      +-----------------------------------------+
|  Citizen Submission    | ---> |         CivicPulse Frontend             |
|  (Plain Text + Location) |      | (React 19 + TypeScript + Tailwind CSS) |
+------------------------+      +-----------------------------------------+
                                                     |
                                                     v
                                +-----------------------------------------+
                                |          AI Engine Processing           |
                                |  - Category & Department Routing        |
                                |  - Urgency Priority Evaluation          |
                                |  - Concrete Action Plan Generation      |
                                +-----------------------------------------+
                                                     |
                                                     v
+------------------------+      +-----------------------------------------+
| Community Dashboard &  | <--- |            Supabase Backend             |
| Municipal Upvoting     |      |  - PostgreSQL Database                  |
+------------------------+      |  - Real-time Subscriptions & RLS        |
                                +-----------------------------------------+
🛠️ Tech Stack
Domain	Technology / Library	Description
Frontend Framework	React 18 / 19	Modern functional component architecture
Language	TypeScript 5.8	Full end-to-end type safety
Styling	Tailwind CSS v4	Modern, responsive design system
Icons	Lucide React	Clean, accessible vector icons
Typography	Plus Jakarta Sans & Newsreader	High-contrast, legible display typography
Database & Auth	Supabase (PostgreSQL)	Persistent storage, real-time sync & Row Level Security
AI Integration	Edge Functions / Claude / Gemini API	Natural language analysis & ticket structuring
Build System	Vite / ESBuild	Fast module bundling and execution
🗄️ Database Schema
CivicPulse relies on a relational PostgreSQL database schema hosted on Supabase:
reports Table
Column Name	Type	Description
id	uuid (PK)	Unique report identifier
description	text	Raw text description provided by user
category	varchar	e.g., pothole, streetlight, water, sanitation, sidewalk, graffiti
location	text	Street address or intersection details
priority	varchar	Urgency rating: Low, Medium, High, Critical
department	varchar	Target municipal department assigned by AI
action_steps	jsonb / array	AI-generated concrete steps for field crew
status	varchar	pending, in_progress, resolved
upvote_count	integer	Total community upvotes
created_at	timestamptz	Submission timestamp
upvotes Table
Column Name	Type	Description
id	uuid (PK)	Unique upvote entry ID
report_id	uuid (FK)	Reference to reports.id
client_id / user_id	text	Unique client identifier to prevent duplicate upvotes
created_at	timestamptz	Timestamp when upvote was cast
🚀 Getting Started
Follow these instructions to run CivicPulse locally on your machine.
Prerequisites
Node.js: v18.0.0 or higher
npm or pnpm
Supabase Account: (Optional for local development if using mock or live credentials)
Installation Steps
Clone the repository:
code
Bash
git clone https://github.com/your-username/civicpulse.git
cd civicpulse
Install dependencies:
code
Bash
npm install
Configure Environment Variables:
Create a .env file in the project root:
code
Env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
Start the Development Server:
code
Bash
npm run dev
Open your browser and navigate to http://localhost:3000.
Build for Production:
code
Bash
npm run build
📱 User Workflow
Report an Issue:
Click "Report an Issue" on the main navigation bar.
Provide a short description (e.g., details on road damage, broken lights, or water leaks) and specify the location.
AI Ticket Generation:
Click "Generate AI Ticket".
The AI parses your text in seconds, categorizes the problem, selects the responsible city department, sets priority level, and outlines recommended action steps.
Submit to Community Feed:
Review the AI-generated ticket and click "Submit Report".
Community Upvoting & Tracking:
Neighbors view the issue on the Neighborhood Dashboard.
Clicking the Upvote button increments the vote counter, boosting the ticket's priority ranking.
Status badges update as municipal departments address and resolve the ticket.
🔮 Future Enhancements & Roadmap

Interactive GIS Map View: Visual map pins showing reports across city sectors.

Municipal Administrator Portal: Specialized interface for city workers to update ticket statuses and post official completion photos.

Photo Upload & Computer Vision: Automatic visual classification of uploaded issue photos using AI.

SMS & Email Notifications: Automatic alerts for citizens when reported issues in their neighborhood are marked "In Progress" or "Resolved".
📄 License & Attribution
This project was built for the AI Application Capstone. Distributed under the Apache 2.0 License.
Live Application URL: https://ai-app-capstone-proj-57go.bolt.host
Tagline: Report. Resolve. Rebuild.