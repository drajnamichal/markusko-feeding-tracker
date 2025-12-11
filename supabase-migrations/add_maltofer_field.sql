-- Add maltofer field to log_entries table
-- Maltofer is an iron supplement (2x5 drops daily for 4 weeks)

ALTER TABLE log_entries 
ADD COLUMN IF NOT EXISTS maltofer BOOLEAN DEFAULT FALSE;

-- Add index for querying maltofer entries
CREATE INDEX IF NOT EXISTS idx_log_entries_maltofer ON log_entries(maltofer) WHERE maltofer = true;

