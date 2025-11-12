-- Add probiotic field to log_entries table
ALTER TABLE log_entries
ADD COLUMN IF NOT EXISTS probiotic BOOLEAN NOT NULL DEFAULT FALSE;

