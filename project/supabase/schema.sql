-- CivicPulse — Database Schema
-- This file documents the database schema that was applied via the Supabase MCP tool.
-- It is kept here for reference and for setting up new Supabase projects.
-- See README.md for full documentation.

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
