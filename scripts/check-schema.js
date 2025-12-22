// Check categories table schema
// Run with: node scripts/check-schema.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('\ud83d\udd0d Checking categories table schema...');
  console.log('');
  
  try {
    // Try to get one category to see structure
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      throw error;
    }
    
    if (data) {
      console.log('\u2705 Found sample category:');
      console.log('');
      console.log('Available columns:');
      Object.keys(data).forEach(key => {
        console.log(`  - ${key}: ${typeof data[key]}`);
      });
    } else {
      console.log('\u26a0\ufe0f  No categories found. Creating test category...');
      
      // Try minimal insert
      const { data: testData, error: insertError } = await supabase
        .from('categories')
        .insert({
          name_sk: 'Test',
          name_cs: 'Test',
          name_en: 'Test',
          slug: 'test',
          icon: '\ud83d\udce6'
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('\u274c Insert failed:', insertError.message);
        console.log('');
        console.log('\ud83d\udca1 Try this SQL in Supabase SQL Editor:');
        console.log('');
        console.log('SELECT column_name, data_type ');
        console.log('FROM information_schema.columns ');
        console.log("WHERE table_name = 'categories';");
      } else {
        console.log('\u2705 Test category created:');
        console.log('');
        console.log('Available columns:');
        Object.keys(testData).forEach(key => {
          console.log(`  - ${key}: ${typeof testData[key]}`);
        });
        
        // Clean up
        await supabase.from('categories').delete().eq('slug', 'test');
      }
    }
    
  } catch (error) {
    console.error('\u274c Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
