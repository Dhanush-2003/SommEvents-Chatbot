-- Enable Row Level Security on all public tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropoffs ENABLE ROW LEVEL SECURITY;

-- Insert-only policies for the anon role (the publishable/anon key).
-- The front-end client only ever inserts; it never needs to read, update, or delete.

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

-- Grant only INSERT to the anon role, revoke everything else.
-- The service_role key (used from the Supabase dashboard / server-side) bypasses RLS,
-- so you can still read all data from the dashboard or a backend.
REVOKE ALL ON leads FROM anon;
REVOKE ALL ON sessions FROM anon;
REVOKE ALL ON dropoffs FROM anon;

GRANT INSERT ON leads TO anon;
GRANT INSERT ON sessions TO anon;
GRANT INSERT ON dropoffs TO anon;

-- The anon role also needs USAGE on the sequences backing SERIAL columns.
GRANT USAGE ON SEQUENCE leads_id_seq TO anon;
GRANT USAGE ON SEQUENCE dropoffs_id_seq TO anon;
