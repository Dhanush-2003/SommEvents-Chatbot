-- =============================================================
-- Migration: Enable Row Level Security (RLS) on all public tables
-- =============================================================
-- The front-end chat widget uses the anon (publishable) key.
-- RLS restricts that key to INSERT-only so users can never read,
-- update, or delete data from the browser.
--
-- The service_role key (used from the Supabase dashboard or any
-- trusted backend) bypasses RLS and retains full access.
-- =============================================================

ALTER TABLE leads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropoffs ENABLE ROW LEVEL SECURITY;

-- INSERT-only policies for the anon role.
-- WITH CHECK (true) allows any row — validation happens in analytics.js.
CREATE POLICY "anon_insert_leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon_insert_sessions"
  ON sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon_insert_dropoffs"
  ON dropoffs FOR INSERT
  TO anon
  WITH CHECK (true);

-- Revoke all privileges first, then grant only INSERT.
-- This ensures no SELECT/UPDATE/DELETE can slip through even if
-- a future policy is misconfigured.
REVOKE ALL ON leads    FROM anon;
REVOKE ALL ON sessions FROM anon;
REVOKE ALL ON dropoffs FROM anon;

GRANT INSERT ON leads    TO anon;
GRANT INSERT ON sessions TO anon;
GRANT INSERT ON dropoffs TO anon;

-- The anon role also needs USAGE on the sequences that back SERIAL
-- primary key columns so that INSERT can auto-generate IDs.
GRANT USAGE ON SEQUENCE leads_id_seq    TO anon;
GRANT USAGE ON SEQUENCE dropoffs_id_seq TO anon;
