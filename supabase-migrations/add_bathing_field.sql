-- Add bathing field to log_entries table
ALTER TABLE log_entries 
ADD COLUMN IF NOT EXISTS bathing BOOLEAN NOT NULL DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN log_entries.bathing IS 'Indicates if baby was bathed (every 2 days reminder)';

