# 🚀 Migration Guide: Multi-Profile Support

This guide explains how to run the database migration to enable multi-profile support for the app.

## 📋 What This Migration Does

The migration adds `baby_profile_id` column to the `log_entries` table, enabling:
- ✅ Support for multiple baby profiles
- ✅ Data isolation between profiles
- ✅ Profile switching functionality

## 🔧 Migration Steps

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Navigate to: `SQL Editor` → `New Query`

3. **Run the Migration**
   - Copy the contents of `supabase-migrations/add_baby_profile_id_to_log_entries.sql`
   - Paste into the SQL Editor
   - Click **"Run"** (or press `Ctrl/Cmd + Enter`)

4. **Verify Success**
   - Check that no errors occurred
   - Verify the column exists in the `log_entries` table

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Link to your project (if not already linked)
supabase link --project-ref your-project-ref

# Run the migration
supabase db push

# Or apply the specific migration file
psql your-connection-string -f supabase-migrations/add_baby_profile_id_to_log_entries.sql
```

### Option 3: Using the Helper Script

```bash
# Display the SQL to run
node scripts/migrate.js

# Then follow the instructions to run it in Supabase Dashboard
```

## ✅ Verification

After running the migration, verify:

1. **Column Exists**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'log_entries' 
   AND column_name = 'baby_profile_id';
   ```

2. **Data Migration**
   ```sql
   -- Check that existing entries have baby_profile_id set
   SELECT COUNT(*) as total,
          COUNT(baby_profile_id) as with_profile_id,
          COUNT(*) - COUNT(baby_profile_id) as missing_profile_id
   FROM log_entries;
   ```

3. **Index Created**
   ```sql
   SELECT indexname 
   FROM pg_indexes 
   WHERE tablename = 'log_entries' 
   AND indexname = 'idx_log_entries_baby_profile_id';
   ```

## ⚠️ Important Notes

- **Backward Compatibility**: Existing entries will be assigned to the first baby profile automatically
- **No Data Loss**: This migration preserves all existing data
- **Index**: An index is created for better query performance
- **Foreign Key**: The column references `baby_profile(id)` with CASCADE delete

## 🐛 Troubleshooting

### Error: Column already exists
If you see `column "baby_profile_id" already exists`, the migration has already been run. You can safely skip it.

### Error: No baby profiles exist
If you get an error about no baby profiles, you need to create at least one profile first:
1. Open the app
2. Complete the welcome setup to create a profile
3. Then run the migration again

### Error: NULL values found
If Step 3 fails (making column NOT NULL), it means some entries don't have a profile assigned. This should be handled by Step 2, but if it fails:
```sql
-- Check for NULL values
SELECT COUNT(*) FROM log_entries WHERE baby_profile_id IS NULL;

-- If there are NULLs, assign them manually
UPDATE log_entries 
SET baby_profile_id = (SELECT id FROM baby_profile ORDER BY created_at ASC LIMIT 1)
WHERE baby_profile_id IS NULL;
```

## 📝 Migration SQL

```sql
-- Add baby_profile_id column to log_entries table
ALTER TABLE log_entries 
ADD COLUMN IF NOT EXISTS baby_profile_id UUID REFERENCES baby_profile(id) ON DELETE CASCADE;

-- Assign existing data to first profile
UPDATE log_entries 
SET baby_profile_id = (SELECT id FROM baby_profile ORDER BY created_at ASC LIMIT 1)
WHERE baby_profile_id IS NULL 
  AND EXISTS (SELECT 1 FROM baby_profile);

-- Make column NOT NULL
ALTER TABLE log_entries 
ALTER COLUMN baby_profile_id SET NOT NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_log_entries_baby_profile_id ON log_entries(baby_profile_id);
```

## 🎉 After Migration

Once the migration is complete:

1. **Refresh your app** - The new multi-profile features will be available
2. **Create additional profiles** - Use the ProfileSelector dropdown to add more children
3. **Switch between profiles** - All data will be filtered by the selected profile

## 📞 Need Help?

If you encounter issues:
1. Check the Supabase logs in Dashboard → Logs
2. Verify your database connection
3. Ensure you have the necessary permissions
4. Review the migration SQL for syntax errors

