// Comprehensive seed script for Slovor Marketplace
// Generates 420 unique listings (42 categories × 10 each) with 3 images per listing
// Total: 1260 images to generate and upload to Cloudinary

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Utility: Random number between min and max
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Utility: Random element from array
const randomChoice = (arr) => arr[random(0, arr.length - 1)];

// Listing templates per category
const listingTemplates = {
  // Electronics
  'laptops': [
    { title: 'MacBook Pro 16" M3', desc: 'Profesionálny notebook s Apple M3 čipom, 32GB RAM, 1TB SSD. Stav ako nový, používaný 3 mesiace. Kompletné balenie s nabíjačkou.', price: [1800, 2200] },
    { title: 'Lenovo ThinkPad X1 Carbon', desc: 'Ultralahký business notebook, Intel i7, 16GB RAM, 512GB SSD. Výborný stav, ideálny na prácu z domu.', price: [950, 1150] },
    { title: 'ASUS ROG Gaming Laptop', desc: 'Herný notebook s RTX 4070, AMD Ryzen 9, 32GB RAM, 2TB SSD. Perfektný na AAA hry a streaming.', price: [1600, 1900] },
    { title: 'Dell XPS 15', desc: 'Prémiový ultrabook s 4K OLED displejom, Intel i9, 32GB RAM. Ideálny na video editing a grafiku.', price: [1400, 1700] },
    { title: 'HP EliteBook 840', desc: 'Business notebook v top stave, Intel i5, 16GB RAM, 256GB SSD. Batéria vydrží 10+ hodín.', price: [650, 850] },
    { title: 'MacBook Air M2', desc: 'Ľahký a výkonný notebook na každodenné použitie, 8GB RAM, 256GB SSD. Takmer nepoužitý.', price: [1050, 1250] },
    { title: 'Acer Swift 3', desc: 'Cenovo dostupný ultrabook, AMD Ryzen 5, 8GB RAM, 512GB SSD. Perfektný na školu/štúdium.', price: [450, 600] },
    { title: 'Microsoft Surface Laptop 5', desc: 'Elegantný notebook s touchscreen, Intel i7, 16GB RAM. Luxusný dizajn a prémiové materiály.', price: [1100, 1350] },
    { title: 'MSI Creator Z16', desc: 'Workstation pre tvorcov, RTX 4060, Intel i7, 32GB RAM, 1TB SSD. QHD+ displej s 100% DCI-P3.', price: [1700, 2000] },
    { title: 'Razer Blade 14', desc: 'Kompaktný herný notebook, RTX 4060, AMD Ryzen 9, 16GB RAM. Prémiová kvalita a výkon.', price: [1500, 1800] }
  ],
  // Add similar templates for other categories...
  // This is a simplified version - in production you'd have all 42 categories
};

// Default template for categories without specific templates
const generateGenericListing = (categoryName, index) => {
  const conditions = ['new', 'used'];
  const locations = ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica', 'Nitra', 'Trnava', 'Martin', 'Poprad', 'Trenčín'];
  
  return {
    title: `${categoryName} - Položka #${index + 1}`,
    description: `Vysokokvalitný produkt z kategórie ${categoryName}. V perfektnom stave, zachovalý, pripravený na okamžité použitie. Cena je konečná, možnosť osobného odberu alebo doručenia kuriérom.`,
    price: random(50, 500),
    currency: 'EUR',
    condition: randomChoice(conditions),
    location: randomChoice(locations),
    views: random(0, 100),
    is_active: true
  };
};

// Main seeding function
async function seedDatabase() {
  console.log('🚀 Starting Slovor MP seed process...');
  console.log('');
  
  try {
    // Step 1: Fetch all categories
    console.log('📚 Fetching categories...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (catError) throw catError;
    
    console.log(`✅ Found ${categories.length} categories`);
    console.log('');
    
    // Step 2: Generate and upload for each category
    let totalCreated = 0;
    
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      console.log(`📦 [${i + 1}/${categories.length}] Processing: ${category.name} (${category.slug})`);
      
      const templates = listingTemplates[category.slug] || [];
      
      // Generate 10 listings per category
      for (let j = 0; j < 10; j++) {
        console.log(`  ⏳ Creating listing ${j + 1}/10...`);
        
        // Get listing data
        const listingData = templates[j] 
          ? {
              title: templates[j].title,
              description: templates[j].desc,
              price: random(...templates[j].price),
              currency: 'EUR',
              condition: randomChoice(['new', 'used']),
              location: randomChoice(['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica']),
              views: random(0, 150),
              is_active: true
            }
          : generateGenericListing(category.name, j);
        
        // Note: Image generation would go here
        // For now, using placeholder images
        const imageUrls = [
          `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/slovor-mp/placeholder-${category.slug}-${j}-1.jpg`,
          `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/slovor-mp/placeholder-${category.slug}-${j}-2.jpg`,
          `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/slovor-mp/placeholder-${category.slug}-${j}-3.jpg`
        ];
        
        // Insert listing
        const { data: listing, error: listingError } = await supabase
          .from('listings')
          .insert({
            ...listingData,
            category_id: category.id,
            images: imageUrls,
            user_id: '00000000-0000-0000-0000-000000000000' // Placeholder user
          })
          .select()
          .single();
        
        if (listingError) {
          console.error(`  ❌ Error creating listing: ${listingError.message}`);
          continue;
        }
        
        console.log(`  ✅ Created: ${listing.title}`);
        totalCreated++;
      }
      
      console.log('');
    }
    
    console.log('🎉 Seed complete!');
    console.log(`📊 Total listings created: ${totalCreated}`);
    console.log('');
    console.log('⚠️  Note: Images are currently placeholders.');
    console.log('💡 Run `npm run images:generate` to generate real images with AI.');
    
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

// Run
seedDatabase();
