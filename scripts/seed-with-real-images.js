// Simplified production seed script
// Generates only 10 listings in laptops category for testing
// Uses Picsum Photos for fast, stable placeholders

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configure Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Utility functions
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[random(0, arr.length - 1)];

// Get Picsum image URL - fast and stable
function getPicsumUrl(seed) {
  return `https://picsum.photos/seed/${seed}/1200/900`;
}

// Laptop templates with realistic Slovak data
const laptopTemplates = [
  { title: 'MacBook Pro 16" M3 Max', desc: 'Profesionálny notebook s Apple M3 Max čipom, 32GB RAM, 1TB SSD. Stav ako nový, používaný 3 mesiace. Kompletné balenie s nabíjačkou a originálnym obalom.', price: [1800, 2200], loc: 'Bratislava' },
  { title: 'Lenovo ThinkPad X1 Carbon Gen 11', desc: 'Ultralahký business notebook, Intel i7-1365U, 16GB RAM, 512GB SSD. Výborný stav, ideálny na prácu z domu. Batéria vydrží 12+ hodín.', price: [950, 1150], loc: 'Košice' },
  { title: 'ASUS ROG Strix G16', desc: 'Herný notebook s RTX 4070, Intel i9, 32GB RAM, 2TB SSD. Perfektný na AAA hry a streaming. QHD+ 240Hz displej.', price: [1600, 1900], loc: 'Bratislava' },
  { title: 'Dell XPS 15 9530', desc: 'Prémiový ultrabook s 4K OLED displejom, Intel i9, 32GB RAM, 1TB SSD. Ideálny na video editing a grafiku.', price: [1400, 1700], loc: 'Žilina' },
  { title: 'HP EliteBook 840 G9', desc: 'Business notebook v top stave, Intel i5, 16GB RAM, 512GB SSD. Batéria vydrží 10+ hodín. Čítačka odtlačkov.', price: [650, 850], loc: 'Prešov' },
  { title: 'MacBook Air M2 13"', desc: 'Ľahký a výkonný notebook na každodenné použitie, 8GB RAM, 256GB SSD. Takmer nepoužitý, 11 mesiacov záruky.', price: [1050, 1250], loc: 'Nitra' },
  { title: 'Acer Swift 3 SF314', desc: 'Cenovo dostupný ultrabook, AMD Ryzen 5, 8GB RAM, 512GB SSD. Perfektný na školu/štúdium. Kovové telo.', price: [450, 600], loc: 'Trnava' },
  { title: 'Microsoft Surface Laptop 5', desc: 'Elegantný notebook s touchscreen, Intel i7, 16GB RAM, 512GB SSD. Luxusný dizajn a prémiové materiály.', price: [1100, 1350], loc: 'Banská Bystrica' },
  { title: 'MSI Creator Z16P', desc: 'Workstation pre tvorcov, RTX 4060, Intel i7, 32GB RAM, 1TB SSD. QHD+ mini-LED displej s 100% DCI-P3.', price: [1700, 2000], loc: 'Bratislava' },
  { title: 'Razer Blade 14 2024', desc: 'Kompaktný herný notebook, RTX 4070, AMD Ryzen 9, 16GB RAM, 1TB SSD. Prémiová kvalita a výkon.', price: [1500, 1800], loc: 'Košice' }
];

// Create placeholder user if not exists
async function ensurePlaceholderUser() {
  const userId = '00000000-0000-0000-0000-000000000000';
  
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();
  
  if (!existing) {
    console.log('📝 Creating placeholder user...');
    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        username: 'seed_user',
        full_name: 'Seed User',
        verified: true
      });
    
    if (error) {
      console.error('❌ Failed to create placeholder user:', error.message);
      throw error;
    }
    console.log('✅ Placeholder user created');
  }
}

// Main seeding function
async function seedDatabase() {
  console.log('🚀 Starting Slovor MP seed (laptops only)...');
  console.log('');
  
  try {
    await ensurePlaceholderUser();
    console.log('');
    
    // Get laptops category
    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', 'laptops')
      .single();
    
    if (catError || !category) {
      throw new Error('Laptops category not found! Run categories seed first.');
    }
    
    console.log(`✅ Found category: ${category.name}`);
    console.log('');
    
    let totalCreated = 0;
    
    console.log(`📦 Creating 10 laptop listings...`);
    
    for (let j = 0; j < 10; j++) {
      const template = laptopTemplates[j];
      const listingData = {
        title: template.title,
        description: template.desc,
        price: random(...template.price),
        currency: 'EUR',
        condition: randomChoice(['new', 'used']),
        location: template.loc,
        views: random(5, 150),
        is_active: true
      };
      
      console.log(`  ⏳ [${j + 1}/10] ${listingData.title}`);
      
      // Generate 3 unique image URLs
      const timestamp = Date.now();
      const imageUrls = [
        getPicsumUrl(`laptops-${j}-0-${timestamp}`),
        getPicsumUrl(`laptops-${j}-1-${timestamp}`),
        getPicsumUrl(`laptops-${j}-2-${timestamp}`)
      ];
      
      const { error: insertError } = await supabase
        .from('listings')
        .insert({
          ...listingData,
          category_id: category.id,
          images: imageUrls,
          user_id: '00000000-0000-0000-0000-000000000000'
        });
      
      if (insertError) {
        console.error(`  ❌ Error: ${insertError.message}`);
        continue;
      }
      
      console.log(`  ✅ Created`);
      totalCreated++;
    }
    
    console.log('');
    console.log('🎉 Seed complete!');
    console.log('');
    console.log('📊 Statistics:');
    console.log(`  - Listings created: ${totalCreated}`);
    console.log(`  - Images per listing: 3`);
    console.log(`  - Total images: ${totalCreated * 3}`);
    console.log('');
    console.log('✅ Database is ready!');
    
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
