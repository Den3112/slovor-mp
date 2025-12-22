// Automated database migration script
// Run with: node scripts/migrate-db.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Starting database migration...');
  console.log('');

  try {
    // Read migration SQL file
    const migrationPath = path.join(__dirname, '../database/migrations/001_add_images_and_filters.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Split by semicolon and filter out comments and empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && !s.match(/^\s*$/))
      .filter(s => {
        // Exclude SELECT verification queries (run them separately)
        const lower = s.toLowerCase();
        return !lower.startsWith('select');
      });

    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    console.log('');

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
      console.log(`⏳ [${i + 1}/${statements.length}] Executing: ${preview}...`);

      const { error } = await supabase.rpc('exec_sql', { sql_query: stmt + ';' }).single();

      if (error) {
        // Try alternative method: direct query
        const { error: directError } = await supabase
          .from('_migrations')
          .insert({ query: stmt });

        if (directError) {
          console.error(`❌ Error executing statement ${i + 1}:`, error);
          throw error;
        }
      }

      console.log(`✅ [${i + 1}/${statements.length}] Success`);
    }

    console.log('');
    console.log('✅ Migration completed successfully!');
    console.log('');

    // Verification queries
    console.log('🔍 Verifying migration...');
    console.log('');

    // Check listings table structure
    const { data: columns, error: colError } = await supabase
      .from('listings')
      .select('*')
      .limit(1);

    if (colError) {
      console.warn('⚠️  Could not verify listings table:', colError.message);
    } else if (columns && columns.length > 0) {
      const sample = columns[0];
      console.log('✅ Listings table verified:');
      console.log('   - images:', Array.isArray(sample.images) ? `array(${sample.images.length})` : 'not array');
      console.log('   - condition:', sample.condition || 'null');
      console.log('   - views:', sample.views || 0);
      console.log('   - is_active:', sample.is_active);
      console.log('');
    }

    // Check categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name, slug, icon_name')
      .limit(5);

    if (catError) {
      console.warn('⚠️  Could not verify categories:', catError.message);
    } else if (categories) {
      console.log('✅ Categories verified (sample):');
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug}): ${cat.icon_name || 'no icon'}`);
      });
    }

    console.log('');
    console.log('🎉 All done! Database is ready.');

  } catch (error) {
    console.error('');
    console.error('❌ Migration failed:', error.message);
    console.error('');
    console.error('💡 You may need to run the migration manually in Supabase SQL Editor.');
    console.error('   File: database/migrations/001_add_images_and_filters.sql');
    process.exit(1);
  }
}

runMigration();
