-- Create doctor_visits table for tracking medical appointments

CREATE TABLE IF NOT EXISTS doctor_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_profile_id UUID NOT NULL REFERENCES baby_profile(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  doctor_type VARCHAR(100) NOT NULL,
  doctor_name VARCHAR(200),
  location VARCHAR(300),
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_doctor_visits_baby_profile_id ON doctor_visits(baby_profile_id);
CREATE INDEX IF NOT EXISTS idx_doctor_visits_visit_date ON doctor_visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_doctor_visits_completed ON doctor_visits(completed);

-- Add comment for documentation
COMMENT ON TABLE doctor_visits IS 'Stores scheduled doctor visits and medical appointments for babies';
COMMENT ON COLUMN doctor_visits.doctor_type IS 'Type of doctor (e.g., Pediatrician, Dentist, Specialist)';
COMMENT ON COLUMN doctor_visits.completed IS 'Whether the visit has been completed';

