-- Create chatbot analytics tables

-- Drop-offs table
CREATE TABLE dropoffs (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  dropped_at_node TEXT NOT NULL,
  dropped_at TIMESTAMP NOT NULL,
  message_count INTEGER NOT NULL,
  conversation_length INTEGER NOT NULL,
  path_taken JSONB,
  tags JSONB,
  lead_captured BOOLEAN DEFAULT FALSE,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  consultation_time TEXT,
  captured_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (for completed conversations)
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  started_at TIMESTAMP NOT NULL,
  path JSONB,
  tags JSONB,
  faq_searches JSONB,
  pricing_asks INTEGER DEFAULT 0,
  handoff_triggered BOOLEAN DEFAULT FALSE,
  handoff_reason TEXT,
  lead_captured BOOLEAN DEFAULT FALSE,
  lead_data JSONB,
  rating INTEGER,
  message_count INTEGER DEFAULT 0,
  conversation_length INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_dropoffs_session_id ON dropoffs(session_id);
CREATE INDEX idx_dropoffs_dropped_at ON dropoffs(dropped_at);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_captured_at ON leads(captured_at);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);