// Clear all listings from database
// Run with: node scripts/clear-listings.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clearListings() {
  console.log('\ud83d\uddd1\ufe0f  Clearing all listings...');
  console.log('');
  
  try {
    // Count existing listings
    const { count: beforeCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\ud83d\udcca Found ${beforeCount} listings`);
    
    if (beforeCount === 0) {
      console.log('\u2705 Database is already empty!');
      return;
    }
    
    // Delete all listings
    const { error } = await supabase
      .from('listings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (dummy condition)
    
    if (error) throw error;
    
    // Verify deletion
    const { count: afterCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true });
    
    console.log('');
    console.log('\u2705 Deleted successfully!');
    console.log(`\ud83d\udcca Remaining: ${afterCount} listings`);
    console.log('');
    console.log('\ud83d\ude80 Now run: npm run db:seed');
    
  } catch (error) {
    console.error('\u274c Error:', error.message);
    process.exit(1);
  }
}

clearListings();
