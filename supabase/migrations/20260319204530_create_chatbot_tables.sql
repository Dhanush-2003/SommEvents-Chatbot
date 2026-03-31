-- =============================================================
-- Migration: Create chatbot analytics tables
-- =============================================================
-- Three tables persist conversation data written by analytics.js
-- via the Supabase anon (publishable) key.
-- Access is restricted to INSERT-only by the RLS policies in the
-- companion migration (_enable_rls_policies.sql).
-- =============================================================

-- Drop-offs: records when a user closes the chat mid-conversation.
-- Used to identify which nodes have the highest abandonment rate.
CREATE TABLE dropoffs (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,          -- links back to the sessions table
  dropped_at_node TEXT NOT NULL,     -- knowledge.js node key where user left
  dropped_at TIMESTAMP NOT NULL,
  message_count INTEGER NOT NULL,
  conversation_length INTEGER NOT NULL, -- seconds from session start
  path_taken JSONB,                  -- ordered list of visited node keys
  tags JSONB,                        -- analytics tags collected during session
  lead_captured BOOLEAN DEFAULT FALSE,
  context JSONB,                     -- freeform metadata (e.g. escalation reason)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads: contact details submitted via the lead-capture form.
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  consultation_time TEXT,            -- value from Calendly or manual booking
  captured_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions: full conversation record written when the user submits a star rating.
-- A session row is only inserted once the conversation ends naturally.
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,               -- "s_" + timestamp36 + random (from analytics.js)
  started_at TIMESTAMP NOT NULL,
  path JSONB,                        -- ordered node key sequence
  tags JSONB,                        -- intent tags collected
  faq_searches JSONB,                -- [{query, at}] search history
  pricing_asks INTEGER DEFAULT 0,
  handoff_triggered BOOLEAN DEFAULT FALSE,
  handoff_reason TEXT,
  lead_captured BOOLEAN DEFAULT FALSE,
  lead_data JSONB,
  rating INTEGER,                    -- 1–5 star rating
  message_count INTEGER DEFAULT 0,
  conversation_length INTEGER DEFAULT 0, -- seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common dashboard query patterns
CREATE INDEX idx_dropoffs_session_id ON dropoffs(session_id);
CREATE INDEX idx_dropoffs_dropped_at ON dropoffs(dropped_at);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_captured_at ON leads(captured_at);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);