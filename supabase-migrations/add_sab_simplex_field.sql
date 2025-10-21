-- Add sab_simplex field to log_entries table
ALTER TABLE log_entries 
ADD COLUMN IF NOT EXISTS sab_simplex BOOLEAN NOT NULL DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN log_entries.sab_simplex IS 'Indicates if SAB Simplex (10 drops) was administered (4x daily, every 4 hours)';

