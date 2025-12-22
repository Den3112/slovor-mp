// Add translation columns to listings table
// Run with: node scripts/add-translation-columns.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addTranslationColumns() {
  console.log('\ud83d\udd27 Adding translation columns to listings...');
  console.log('');
  
  try {
    // Note: Supabase JS client doesn't support ALTER TABLE
    // We need to use Supabase SQL API or manual SQL execution
    
    console.log('\u26a0\ufe0f  Cannot add columns via Supabase JS client.');
    console.log('');
    console.log('\ud83d\udca1 Please run this SQL in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard');
    console.log('');
    console.log('='.repeat(60));
    console.log('');
    console.log('ALTER TABLE listings');
    console.log('  ADD COLUMN IF NOT EXISTS title_sk TEXT,');
    console.log('  ADD COLUMN IF NOT EXISTS title_cs TEXT,');
    console.log('  ADD COLUMN IF NOT EXISTS title_en TEXT,');
    console.log('  ADD COLUMN IF NOT EXISTS description_sk TEXT,');
    console.log('  ADD COLUMN IF NOT EXISTS description_cs TEXT,');
    console.log('  ADD COLUMN IF NOT EXISTS description_en TEXT;');
    console.log('');
    console.log('UPDATE listings');
    console.log('SET');
    console.log('  title_en = title,');
    console.log('  description_en = description');
    console.log('WHERE title_en IS NULL;');
    console.log('');
    console.log('CREATE INDEX IF NOT EXISTS idx_listings_title_en ON listings(title_en);');
    console.log('CREATE INDEX IF NOT EXISTS idx_listings_title_sk ON listings(title_sk);');
    console.log('CREATE INDEX IF NOT EXISTS idx_listings_title_cs ON listings(title_cs);');
    console.log('');
    console.log('='.repeat(60));
    console.log('');
    console.log('\u2705 After running SQL, execute: npm run db:full-reset');
    console.log('');
    
  } catch (error) {
    console.error('\u274c Error:', error.message);
    process.exit(1);
  }
}

addTranslationColumns();
