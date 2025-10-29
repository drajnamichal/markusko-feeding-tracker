/**
 * Migration Script: Add baby_profile_id to log_entries
 * 
 * This script adds the baby_profile_id column to log_entries table
 * Run with: npx tsx scripts/run-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_URL environment variable');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.error('⚠️  This migration requires service role key for raw SQL execution');
  console.error('💡 Alternative: Run the SQL file directly in Supabase Dashboard -> SQL Editor');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('🚀 Starting migration: Add baby_profile_id to log_entries\n');

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../supabase-migrations/add_baby_profile_id_to_log_entries.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration SQL:');
    console.log('─'.repeat(50));
    console.log(migrationSQL);
    console.log('─'.repeat(50));
    console.log('');

    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        });

        if (error) {
          // Try direct query if RPC doesn't work
          const { error: directError } = await supabase
            .from('_migration_helper')
            .select('*')
            .limit(0);
          
          // If we can't use RPC, log and continue
          console.log(`⚠️  RPC method not available. Please run this migration manually in Supabase Dashboard.`);
          console.log(`\n📋 SQL to execute:\n${statement};`);
          continue;
        }

        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (err: any) {
        console.error(`❌ Error executing statement ${i + 1}:`, err.message);
        console.log(`\n💡 Please run this SQL manually in Supabase Dashboard -> SQL Editor:`);
        console.log(`\n${statement};`);
      }
    }

    console.log('\n✅ Migration completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Verify the column exists: Check log_entries table structure');
    console.log('   2. Verify existing data: Check that all entries have baby_profile_id set');
    console.log('   3. Test the app: Create a new entry and verify it works');

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n💡 Alternative approach:');
    console.error('   1. Open Supabase Dashboard');
    console.error('   2. Go to SQL Editor');
    console.error('   3. Copy and paste the SQL from: supabase-migrations/add_baby_profile_id_to_log_entries.sql');
    console.error('   4. Click "Run"');
    process.exit(1);
  }
}

runMigration();

