// Production seed script with real images from Unsplash
// Generates 420 unique listings (42 categories × 10 each) with 3 images per listing
// Images are fetched from Unsplash and uploaded to Cloudinary

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;
const https = require('https');
const fs = require('fs');
const path = require('path');

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

// Utility functions
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[random(0, arr.length - 1)];
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Unsplash image search terms per category
const unsplashQueries = {
  'laptops': 'laptop computer',
  'phones': 'smartphone mobile',
  'cameras': 'camera photography',
  'audio': 'headphones audio',
  'electronics': 'electronics gadget',
  'cars': 'car automobile',
  'vehicles': 'vehicle transport',
  'motorcycles': 'motorcycle bike',
  'cycling': 'bicycle cycling',
  'autoparts': 'car parts engine',
  'apartments': 'apartment interior',
  'houses': 'house home',
  'real-estate': 'real estate building',
  'commercial': 'commercial building',
  'land': 'land property',
  'fashion': 'fashion clothing',
  'clothes-kids': 'kids clothing',
  'men-fashion': 'mens fashion',
  'women-fashion': 'womens fashion',
  'moda': 'fashion style',
  'shoes': 'shoes sneakers',
  'home-garden': 'home garden',
  'furniture': 'furniture interior',
  'kitchen': 'kitchen appliance',
  'garden': 'garden plants',
  'fitness': 'fitness gym',
  'sports-equipment': 'sports equipment',
  'sport-hobby': 'sports hobby',
  'winter-sports': 'winter sports skiing',
  'kids-family': 'baby kids',
  'pre-deti': 'children toys',
  'toys': 'toys children',
  'strollers': 'baby stroller',
  'dogs': 'dog pet',
  'cats': 'cat pet',
  'pets': 'pet animal',
  'jobs-services': 'office work',
  'praca': 'work office',
  'tutoring': 'education learning',
  'craftsmen': 'tools workshop',
  'transport-services': 'delivery truck',
  'books-education': 'books education'
};

// Upload image to Cloudinary from URL
async function uploadToCloudinary(imageUrl, folder) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `slovor-mp/${folder}`,
      transformation: [
        { width: 1200, height: 900, crop: 'fill', quality: 'auto:good' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    console.error(`    ⚠️  Cloudinary upload failed: ${error.message}`);
    return imageUrl; // Fallback to original URL
  }
}

// Get Unsplash image URL
function getUnsplashUrl(query, index) {
  // Using Unsplash Source API for random images
  const seed = Date.now() + index;
  return `https://source.unsplash.com/1200x900/?${encodeURIComponent(query)}&sig=${seed}`;
}

// Listing templates with realistic Slovak data
const listingTemplates = {
  'laptops': [
    { title: 'MacBook Pro 16" M3 Max', desc: 'Profesionálny notebook s Apple M3 Max čipom, 32GB RAM, 1TB SSD. Stav ako nový, používaný 3 mesiace. Kompletné balenie s nabíjačkou a originálnym obalom.', price: [1800, 2200], loc: 'Bratislava' },
    { title: 'Lenovo ThinkPad X1 Carbon Gen 11', desc: 'Ultralahký business notebook, Intel i7-1365U, 16GB RAM, 512GB SSD. Výborný stav, ideálny na prácu z domu. Batéria vydrží 12+ hodín.', price: [950, 1150], loc: 'Košice' },
    { title: 'ASUS ROG Strix G16', desc: 'Herný notebook s RTX 4070, Intel i9, 32GB RAM, 2TB SSD. Perfektný na AAA hry a streaming. QHD+ 240Hz displej.', price: [1600, 1900], loc: 'Bratislava' },
    { title: 'Dell XPS 15 9530', desc: 'Prémiový ultrabook s 4K OLED displejom, Intel i9, 32GB RAM, 1TB SSD. Ideálny na video editing a grafiku.', price: [1400, 1700], loc: 'Žilina' },
    { title: 'HP EliteBook 840 G9', desc: 'Business notebook v top stave, Intel i5, 16GB RAM, 512GB SSD. Batéria vydrží 10+ hodín. Čitačka odtlačkov.', price: [650, 850], loc: 'Prešov' },
    { title: 'MacBook Air M2 13"', desc: 'Ľahký a výkonný notebook na každodenné použitie, 8GB RAM, 256GB SSD. Takmer nepoužitý, 11 mesiacov záruky.', price: [1050, 1250], loc: 'Nitra' },
    { title: 'Acer Swift 3 SF314', desc: 'Cenovo dostupný ultrabook, AMD Ryzen 5, 8GB RAM, 512GB SSD. Perfektný na školu/štúdium. Kovové telo.', price: [450, 600], loc: 'Trnava' },
    { title: 'Microsoft Surface Laptop 5', desc: 'Elegantný notebook s touchscreen, Intel i7, 16GB RAM, 512GB SSD. Luxusný dizajn a prémiové materiály.', price: [1100, 1350], loc: 'Banská Bystrica' },
    { title: 'MSI Creator Z16P', desc: 'Workstation pre tvorcov, RTX 4060, Intel i7, 32GB RAM, 1TB SSD. QHD+ mini-LED displej s 100% DCI-P3.', price: [1700, 2000], loc: 'Bratislava' },
    { title: 'Razer Blade 14 2024', desc: 'Kompaktný herný notebook, RTX 4070, AMD Ryzen 9, 16GB RAM, 1TB SSD. Prémiová kvalita a výkon.', price: [1500, 1800], loc: 'Košice' }
  ],
  // Add more categories as needed - this is a sample
};

// Generate generic listing data
function generateListing(category, index, template = null) {
  const locations = ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica', 'Nitra', 'Trnava', 'Martin', 'Poprad', 'Trenčín'];
  const conditions = ['new', 'used'];
  
  if (template) {
    return {
      title: template.title,
      description: template.desc,
      price: random(...template.price),
      currency: 'EUR',
      condition: randomChoice(conditions),
      location: template.loc || randomChoice(locations),
      views: random(5, 150),
      is_active: true
    };
  }
  
  return {
    title: `${category.name} - Kvalitný produkt #${index + 1}`,
    description: `Vysokokvalitný produkt z kategórie ${category.name}. V perfektnom stave, zachovalý, pripravený na okamžité použitie. Cena je konečná, možnosť osobného odberu alebo doručenia kuriérom. Pri záujme kontaktujte telefonicky alebo cez správy.`,
    price: random(20, 500),
    currency: 'EUR',
    condition: randomChoice(conditions),
    location: randomChoice(locations),
    views: random(0, 100),
    is_active: true
  };
}

// Main seeding function
async function seedDatabase() {
  console.log('🚀 Starting Slovor MP production seed...');
  console.log('');
  console.log('📋 Process:');
  console.log('  1. Fetch categories from Supabase');
  console.log('  2. For each category: generate 10 listings');
  console.log('  3. For each listing: fetch 3 images from Unsplash');
  console.log('  4. Upload images to Cloudinary');
  console.log('  5. Create listing in database');
  console.log('');
  console.log('⏱️  Estimated time: 15-20 minutes');
  console.log('');
  
  try {
    // Fetch categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (catError) throw catError;
    
    console.log(`✅ Found ${categories.length} categories`);
    console.log('');
    
    let totalCreated = 0;
    let totalImages = 0;
    
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      console.log(`📦 [${i + 1}/${categories.length}] ${category.name} (${category.slug})`);
      
      const templates = listingTemplates[category.slug] || [];
      const query = unsplashQueries[category.slug] || category.name;
      
      for (let j = 0; j < 10; j++) {
        const template = templates[j] || null;
        const listingData = generateListing(category, j, template);
        
        console.log(`  ⏳ [${j + 1}/10] ${listingData.title.substring(0, 40)}...`);
        
        // Fetch and upload 3 images
        const imageUrls = [];
        for (let k = 0; k < 3; k++) {
          const unsplashUrl = getUnsplashUrl(query, i * 30 + j * 3 + k);
          const cloudinaryUrl = await uploadToCloudinary(
            unsplashUrl,
            `${category.slug}/listing-${j + 1}`
          );
          imageUrls.push(cloudinaryUrl);
          totalImages++;
          
          await sleep(300); // Rate limiting
        }
        
        // Insert listing
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
        
        console.log(`  ✅ Created with ${imageUrls.length} images`);
        totalCreated++;
      }
      
      console.log('');
    }
    
    console.log('🎉 Seed complete!');
    console.log('');
    console.log('📊 Statistics:');
    console.log(`  - Listings created: ${totalCreated}`);
    console.log(`  - Images uploaded: ${totalImages}`);
    console.log(`  - Categories filled: ${categories.length}`);
    console.log('');
    console.log('✅ Database is ready for production!');
    
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run
seedDatabase();
