-- Add head circumference field to measurements table
ALTER TABLE measurements 
ADD COLUMN IF NOT EXISTS head_circumference_cm NUMERIC DEFAULT 0;

-- Add comment
COMMENT ON COLUMN measurements.head_circumference_cm IS 'Head circumference in centimeters';

