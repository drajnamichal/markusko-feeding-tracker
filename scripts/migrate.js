/**
 * Simple Migration Runner
 * Uses Supabase Dashboard API or provides manual instructions
 * 
 * Run: node scripts/migrate.js
 */

const migrationSQL = `
-- Add baby_profile_id column to log_entries table
-- This migration adds support for multiple baby profiles

-- Step 1: Add the new column (nullable initially to handle existing data)
ALTER TABLE log_entries 
ADD COLUMN IF NOT EXISTS baby_profile_id UUID REFERENCES baby_profile(id) ON DELETE CASCADE;

-- Step 2: For existing data, assign it to the first baby profile (if exists)
-- This ensures backward compatibility with existing data
UPDATE log_entries 
SET baby_profile_id = (SELECT id FROM baby_profile ORDER BY created_at ASC LIMIT 1)
WHERE baby_profile_id IS NULL 
  AND EXISTS (SELECT 1 FROM baby_profile);

-- Step 3: Make the column NOT NULL after migration
-- This will fail if there are still NULL values, which means we need to create a profile first
ALTER TABLE log_entries 
ALTER COLUMN baby_profile_id SET NOT NULL;

-- Step 4: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_log_entries_baby_profile_id ON log_entries(baby_profile_id);
`;

console.log('📋 Migration SQL for adding baby_profile_id to log_entries\n');
console.log('═'.repeat(70));
console.log(migrationSQL);
console.log('═'.repeat(70));
console.log('\n📝 To execute this migration:\n');
console.log('   1. Open Supabase Dashboard: https://app.supabase.com');
console.log('   2. Select your project');
console.log('   3. Go to: SQL Editor → New Query');
console.log('   4. Copy and paste the SQL above');
console.log('   5. Click "Run" (or press Ctrl/Cmd + Enter)');
console.log('\n✅ After running, verify:');
console.log('   - Column baby_profile_id exists in log_entries table');
console.log('   - All existing entries have baby_profile_id set');
console.log('   - Index idx_log_entries_baby_profile_id was created');
console.log('\n');

