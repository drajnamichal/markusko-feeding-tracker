-- Add vitamin_c field to log_entries table
ALTER TABLE log_entries
ADD COLUMN IF NOT EXISTS vitamin_c BOOLEAN NOT NULL DEFAULT FALSE;

