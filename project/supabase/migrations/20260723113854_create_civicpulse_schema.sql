/*
# CivicPulse — Drop old FlashLearn tables and create civic reporting schema

## Purpose
CivicPulse lets citizens report hyper-local problems (potholes, broken streetlights,
graffiti, etc.) and uses AI to generate structured municipal tickets. Community members
upvote reports to build civic pressure. This is a single-tenant (no-auth) app — all
reports are public and shared. A per-browser clientId distinguishes who upvoted what.

## Changes
1. Drop old tables: attempts, cards, decks (from a previous prototype)
2. Create `reports` table — a citizen-reported civic problem
3. Create `upvotes` table — a vote of support on a report
4. Enable RLS on both tables with anon+authenticated CRUD (public/shared data)
5. Add indexes for common queries

## New Tables
### reports
- id (uuid, PK)
- title (text, short summary)
- description (text, the citizen's raw description)
- category (text, e.g. pothole, streetlight, graffiti)
- severity (text, low/medium/high/urgent)
- ai_summary (text, AI-generated municipal ticket summary)
- ai_department (text, AI-suggested responsible department)
- ai_priority (text, AI-suggested priority level)
- ai_action_items (jsonb, AI-suggested action items array)
- status (text, submitted/acknowledged/in_progress/resolved)
- location_text (text, human-readable location)
- lat (numeric, latitude, nullable)
- lng (numeric, longitude, nullable)
- photo_url (text, optional photo URL)
- client_id (text, per-browser identifier of the reporter)
- upvote_count (int, denormalized count)
- created_at (timestamptz)

### upvotes
- id (uuid, PK)
- report_id (uuid, FK to reports, cascade delete)
- client_id (text, per-browser identifier of the voter)
- created_at (timestamptz)
- UNIQUE(report_id, client_id) — one vote per browser per report

## Security
- RLS enabled on both tables.
- All policies use TO anon, authenticated because this is a no-auth public app.
- Anyone can read, create, and upvote reports.
- Only the original reporter's client_id can update status (for status changes).
- Upvotes can be deleted (to un-upvote) by the same client_id.
*/

DROP TABLE IF EXISTS attempts CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS decks CASCADE;

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  severity text NOT NULL DEFAULT 'medium',
  ai_summary text NOT NULL DEFAULT '',
  ai_department text NOT NULL DEFAULT '',
  ai_priority text NOT NULL DEFAULT '',
  ai_action_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'submitted',
  location_text text NOT NULL DEFAULT '',
  lat numeric,
  lng numeric,
  photo_url text NOT NULL DEFAULT '',
  client_id text NOT NULL DEFAULT '',
  upvote_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reports" ON reports;
CREATE POLICY "anon_select_reports" ON reports FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reports" ON reports;
CREATE POLICY "anon_insert_reports" ON reports FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_reports" ON reports;
CREATE POLICY "anon_update_reports" ON reports FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_reports" ON reports;
CREATE POLICY "anon_delete_reports" ON reports FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  client_id text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(report_id, client_id)
);

ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_upvotes" ON upvotes;
CREATE POLICY "anon_select_upvotes" ON upvotes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_upvotes" ON upvotes;
CREATE POLICY "anon_insert_upvotes" ON upvotes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_upvotes" ON upvotes;
CREATE POLICY "anon_delete_upvotes" ON upvotes FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_upvotes_report_id ON upvotes(report_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_client_id ON upvotes(client_id);
