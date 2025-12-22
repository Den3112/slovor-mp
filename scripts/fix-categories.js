// Fix categories: Remove duplicates and create proper 25 categories
// Run with: node scripts/fix-categories.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const categories = [
  { name_sk: 'Elektronika', name_cs: 'Elektronika', name_en: 'Electronics', slug: 'electronics', icon: '💻', sort_order: 1 },
  { name_sk: 'Oblečenie', name_cs: 'Oblečení', name_en: 'Clothing', slug: 'clothing', icon: '👕', sort_order: 2 },
  { name_sk: 'Dom a záhrada', name_cs: 'Dům a zahrada', name_en: 'Home & Garden', slug: 'home-garden', icon: '🏠', sort_order: 3 },
  { name_sk: 'Šport', name_cs: 'Sport', name_en: 'Sports', slug: 'sports', icon: '⚽', sort_order: 4 },
  { name_sk: 'Detské potreby', name_cs: 'Dětské potřeby', name_en: 'Kids & Baby', slug: 'kids-baby', icon: '👶', sort_order: 5 },
  { name_sk: 'Vozidlá', name_cs: 'Vozidla', name_en: 'Vehicles', slug: 'vehicles', icon: '🚗', sort_order: 6 },
  { name_sk: 'Nehnuteľnosti', name_cs: 'Nemovitosti', name_en: 'Real Estate', slug: 'real-estate', icon: '🏡', sort_order: 7 },
  { name_sk: 'Služby', name_cs: 'Služby', name_en: 'Services', slug: 'services', icon: '🔧', sort_order: 8 },
  { name_sk: 'Zvieratá', name_cs: 'Zvířata', name_en: 'Pets', slug: 'pets', icon: '🐕', sort_order: 9 },
  { name_sk: 'Hobby', name_cs: 'Hobby', name_en: 'Hobbies', slug: 'hobbies', icon: '🎨', sort_order: 10 },
  { name_sk: 'Knihy a časopisy', name_cs: 'Knihy a časopisy', name_en: 'Books & Magazines', slug: 'books-magazines', icon: '📚', sort_order: 11 },
  { name_sk: 'Hudobné nástroje', name_cs: 'Hudební nástroje', name_en: 'Musical Instruments', slug: 'music-instruments', icon: '🎸', sort_order: 12 },
  { name_sk: 'Filmy a hudba', name_cs: 'Filmy a hudba', name_en: 'Movies & Music', slug: 'movies-music', icon: '🎬', sort_order: 13 },
  { name_sk: 'Krása a zdravie', name_cs: 'Krása a zdraví', name_en: 'Beauty & Health', slug: 'beauty-health', icon: '💄', sort_order: 14 },
  { name_sk: 'Hračky a hry', name_cs: 'Hračky a hry', name_en: 'Toys & Games', slug: 'toys-games', icon: '🧸', sort_order: 15 },
  { name_sk: 'Nábytok', name_cs: 'Nábytek', name_en: 'Furniture', slug: 'furniture', icon: '🪑', sort_order: 16 },
  { name_sk: 'Záhradná technika', name_cs: 'Zahradní technika', name_en: 'Garden Equipment', slug: 'garden-equipment', icon: '🌱', sort_order: 17 },
  { name_sk: 'Náradie a stroje', name_cs: 'Nářadí a stroje', name_en: 'Tools & Machinery', slug: 'tools-machinery', icon: '🔨', sort_order: 18 },
  { name_sk: 'Potraviny', name_cs: 'Potraviny', name_en: 'Food & Drink', slug: 'food-drink', icon: '🍎', sort_order: 19 },
  { name_sk: 'Šperky a hodinky', name_cs: 'Šperky a hodinky', name_en: 'Jewelry & Watches', slug: 'jewelry-watches', icon: '💍', sort_order: 20 },
  { name_sk: 'Biznis a priemysel', name_cs: 'Business a průmysl', name_en: 'Business & Industrial', slug: 'business-industrial', icon: '🏭', sort_order: 21 },
  { name_sk: 'Cestovanie', name_cs: 'Cestování', name_en: 'Travel', slug: 'travel', icon: '✈️', sort_order: 22 },
  { name_sk: 'Vstupenky', name_cs: 'Vstupenky', name_en: 'Tickets & Events', slug: 'tickets-events', icon: '🎫', sort_order: 23 },
  { name_sk: 'Darčeky', name_cs: 'Dárky', name_en: 'Gifts', slug: 'gifts', icon: '🎁', sort_order: 24 },
  { name_sk: 'Ostatné', name_cs: 'Ostatní', name_en: 'Other', slug: 'other', icon: '📦', sort_order: 25 },
];

async function fixCategories() {
  console.log('🔧 Fixing categories to proper 25...');
  console.log('');
  
  try {
    // Step 1: Count existing
    const { count: beforeCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Current categories: ${beforeCount}`);
    
    // Step 2: Delete all listings
    console.log('🗑️  Deleting all listings...');
    const { error: listingsError } = await supabase
      .from('listings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (listingsError) throw listingsError;
    console.log('✅ Listings deleted');
    
    // Step 3: Delete all categories
    console.log('🗑️  Deleting all categories...');
    const { error: catDeleteError } = await supabase
      .from('categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (catDeleteError) throw catDeleteError;
    console.log('✅ Categories deleted');
    console.log('');
    
    // Step 4: Insert 25 new categories
    console.log('🎉 Creating 25 proper categories...');
    console.log('');
    
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const { error } = await supabase
        .from('categories')
        .insert(cat); // Don't add is_active
      
      if (error) {
        console.error(`  ❌ Error creating ${cat.name_en}:`, error.message);
        continue;
      }
      
      console.log(`  ${i + 1}/25 ${cat.icon} ${cat.name_en}`);
    }
    
    // Step 5: Verify
    const { count: afterCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    console.log('');
    console.log('='.repeat(50));
    console.log(`✅ Categories fixed!`);
    console.log(`📊 Total: ${afterCount} categories`);
    console.log('');
    console.log('🚀 Next steps:');
    console.log('  1. npm run db:seed');
    console.log('  2. npm run dev');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixCategories();
