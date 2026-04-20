-- Add conversation context to leads so notification emails include
-- the full path the user took before submitting the form.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS context JSONB;
