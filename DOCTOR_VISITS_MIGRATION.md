# Migrácia databázy pre Návštevy lekárov

Táto migrácia pridáva novú tabuľku `doctor_visits` pre sledovanie návštev lekárov.

## Kroky pre manuálnu migráciu v Supabase

1. Otvorte Supabase Dashboard: https://supabase.com/dashboard
2. Vyberte váš projekt
3. V ľavom menu kliknite na **SQL Editor**
4. Kliknite na **New Query**
5. Skopírujte a vložte SQL kód nižšie
6. Kliknite na **Run** (alebo stlačte Cmd/Ctrl + Enter)

## SQL Migračný skript

```sql
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
```

## Overenie migrácie

Po spustení SQL skriptu skontrolujte, že tabuľka bola úspešne vytvorená:

1. V Supabase Dashboard prejdite do **Table Editor**
2. Mal by ste vidieť novú tabuľku `doctor_visits`
3. Overte, že tabuľka obsahuje všetky stĺpce a indexy

## Funkcie

Táto migrácia umožňuje:

- ✅ Pridávanie termínov návštev lekárov
- ✅ Uchovávanie informácií o type lekára, mene, lokalite
- ✅ Poznámky k návšteve (čo doniesť, atď.)
- ✅ Označovanie návštev ako dokončené/nedokončené
- ✅ Export do Google Calendar
- ✅ Filtrovanie podľa baby_profile_id (viac detí)
- ✅ Optimalizované indexy pre rýchle vyhľadávanie

## Troubleshooting

Ak sa vyskytne chyba:

- Overte, že tabuľka `baby_profile` existuje (potrebná pre foreign key)
- Overte, že máte práva na vykonanie SQL príkazov
- Ak tabuľka už existuje, môžete ju najprv odstrániť pomocou: `DROP TABLE IF EXISTS doctor_visits CASCADE;`

