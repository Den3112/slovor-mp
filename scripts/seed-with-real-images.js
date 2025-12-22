// Production seed script - 10 listings per category
// Generates realistic listings with category-specific content and images
// Supports 3 languages: English, Slovak, Czech

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[random(0, arr.length - 1)];

// Category-specific image keywords for Unsplash
const categoryImages = {
  'electronics': ['laptop', 'smartphone', 'tablet', 'headphones', 'camera', 'smartwatch'],
  'clothing': ['fashion', 'shirt', 'dress', 'jeans', 'jacket', 'shoes'],
  'home-garden': ['furniture', 'plants', 'garden', 'home-decor', 'kitchen', 'bedroom'],
  'sports': ['fitness', 'bicycle', 'running', 'gym', 'yoga', 'football'],
  'kids-baby': ['baby', 'toys', 'stroller', 'kids-room', 'children', 'playground'],
  'vehicles': ['car', 'motorcycle', 'truck', 'vehicle', 'auto', 'transport'],
  'real-estate': ['house', 'apartment', 'building', 'property', 'real-estate', 'architecture'],
  'services': ['work', 'repair', 'tools', 'professional', 'service', 'craftsman'],
  'pets': ['dog', 'cat', 'pet', 'animal', 'puppy', 'kitten'],
  'hobbies': ['art', 'painting', 'craft', 'hobby', 'creative', 'collection'],
  'books-magazines': ['books', 'reading', 'library', 'magazine', 'literature', 'bookshelf'],
  'music-instruments': ['guitar', 'piano', 'drums', 'violin', 'music', 'instrument'],
  'movies-music': ['vinyl', 'cd', 'movie', 'music', 'entertainment', 'film'],
  'beauty-health': ['cosmetics', 'skincare', 'beauty', 'health', 'wellness', 'spa'],
  'toys-games': ['toys', 'games', 'board-game', 'puzzle', 'lego', 'play'],
  'furniture': ['sofa', 'chair', 'table', 'furniture', 'interior', 'design'],
  'garden-equipment': ['garden-tools', 'lawn', 'gardening', 'plants', 'outdoor', 'landscaping'],
  'tools-machinery': ['tools', 'machinery', 'equipment', 'workshop', 'construction', 'industrial'],
  'food-drink': ['food', 'cooking', 'restaurant', 'drink', 'cuisine', 'meal'],
  'jewelry-watches': ['jewelry', 'watch', 'ring', 'necklace', 'luxury', 'accessories'],
  'business-industrial': ['office', 'business', 'warehouse', 'industrial', 'corporate', 'equipment'],
  'travel': ['travel', 'vacation', 'suitcase', 'airport', 'tourism', 'destination'],
  'tickets-events': ['concert', 'event', 'tickets', 'festival', 'show', 'entertainment'],
  'gifts': ['gift', 'present', 'celebration', 'wrapped', 'surprise', 'holiday'],
  'other': ['misc', 'various', 'items', 'products', 'goods', 'collection']
};

// Category-specific product templates
const productTemplates = {
  'electronics': {
    en: ['iPhone 13 Pro', 'Samsung Galaxy S21', 'MacBook Air M2', 'Sony Headphones WH-1000XM4', 'iPad Pro 11"', 'Dell XPS 15', 'Canon EOS R6', 'Apple Watch Series 8', 'Sony PlayStation 5', 'Nintendo Switch OLED'],
    sk: ['iPhone 13 Pro', 'Samsung Galaxy S21', 'MacBook Air M2', 'Slúchátka Sony WH-1000XM4', 'iPad Pro 11"', 'Notebook Dell XPS 15', 'Fotoaparát Canon EOS R6', 'Apple Watch Series 8', 'Sony PlayStation 5', 'Nintendo Switch OLED'],
    cs: ['iPhone 13 Pro', 'Samsung Galaxy S21', 'MacBook Air M2', 'Sluchátka Sony WH-1000XM4', 'iPad Pro 11"', 'Notebook Dell XPS 15', 'Fotoaparát Canon EOS R6', 'Apple Watch Series 8', 'Sony PlayStation 5', 'Nintendo Switch OLED']
  },
  'clothing': {
    en: ['Nike Air Max Sneakers', 'Levi\'s 501 Jeans', 'North Face Winter Jacket', 'Adidas Hoodie', 'Zara Summer Dress', 'H&M T-Shirt Pack', 'Leather Jacket', 'Running Shoes', 'Designer Handbag', 'Wool Coat'],
    sk: ['Tenisky Nike Air Max', 'Džínsy Levišs 501', 'Zimná bunda North Face', 'Mikina Adidas', 'Letné šaty Zara', 'Balík tričiek H&M', 'Kožená bunda', 'Bežecké topánky', 'Dizajnérová kabelka', 'Vlnený kabát'],
    cs: ['Tenisky Nike Air Max', 'Džíny Levišs 501', 'Zimní bunda North Face', 'Mikina Adidas', 'Letní šaty Zara', 'Balíček triček H&M', 'Kožená bunda', 'Běžecké boty', 'Designová kabelka', 'Vlněný kabát']
  },
  'vehicles': {
    en: ['BMW 320d 2019', 'Audi A4 2020', 'VW Golf GTI', 'Skoda Octavia RS', 'Mercedes-Benz C-Class', 'Toyota Corolla 2021', 'Honda Civic', 'Ford Focus ST', 'Mazda CX-5', 'Hyundai Tucson'],
    sk: ['BMW 320d 2019', 'Audi A4 2020', 'VW Golf GTI', 'Škoda Octavia RS', 'Mercedes-Benz C-Class', 'Toyota Corolla 2021', 'Honda Civic', 'Ford Focus ST', 'Mazda CX-5', 'Hyundai Tucson'],
    cs: ['BMW 320d 2019', 'Audi A4 2020', 'VW Golf GTI', 'Škoda Octavia RS', 'Mercedes-Benz C-Class', 'Toyota Corolla 2021', 'Honda Civic', 'Ford Focus ST', 'Mazda CX-5', 'Hyundai Tucson']
  },
  'real-estate': {
    en: ['2-Bedroom Apartment', 'Modern Villa with Pool', 'Cozy Studio Downtown', '3-BR Family House', 'Luxury Penthouse', 'Country Cottage', 'Office Space', 'Commercial Property', 'New Build Apartment', 'Renovated Flat'],
    sk: ['2-izbový byt', 'Moderná vila s bazénom', 'Útúlný štúdio v centre', 'Rodinny dom 3 izby', 'Luxusný penthouse', 'Vidiecka chalupa', 'Kancelársky priestor', 'Komerčná nehnutenošť', 'Nový byt', 'Zrekonštruovaný byt'],
    cs: ['2-pokojový byt', 'Moderní vila s bazénem', 'Útúlné studio v centru', 'Rodinný dům 3 pokoje', 'Luxusní penthouse', 'Venkovská chalupa', 'Kancelářský prostor', 'Komerční nemovitost', 'Nový byt', 'Zrekonstruovaný byt']
  }
};

function getUnsplashUrl(keyword, seed) {
  return `https://source.unsplash.com/1200x900/?${keyword}&sig=${seed}`;
}

function generateListingContent(category, index, locale = 'en') {
  const slug = category.slug;
  const templates = productTemplates[slug];
  
  let title, description;
  
  if (templates && templates[locale]) {
    // Use category-specific product
    title = templates[locale][index % templates[locale].length];
  } else {
    // Fallback to generic
    const catName = locale === 'sk' ? category.name_sk : 
                    locale === 'cs' ? category.name_cs : 
                    category.name_en || category.name;
    title = `${catName} - Product #${index + 1}`;
  }
  
  // Generate descriptions
  const descriptions = {
    en: `High-quality ${title} in excellent condition. Well-maintained and ready for immediate use. Perfect for anyone looking for reliability and great value. Contact for more details or to arrange viewing.`,
    sk: `Vysokokvalitný ${title} v perfektnom stave. Zachovalý a pripravený na okamžité použitie. Ideálne pre kázdho, kto hľadá spoľahlivosť a sk velú hodnotu. Kontaktujte pre viac detailov alebo dohodnutie prezretia.`,
    cs: `Vysokokvalitní ${title} v perfektním stavu. Zachovalý a připravený k okamžitému použití. Ideální pro každého, kdo hledá spolehlivost a skvlou hodnotu. Kontaktujte pro více detailů nebo dohodnutí prohlídky.`
  };
  
  description = descriptions[locale];
  
  const locations = {
    sk: ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica', 'Nitra', 'Trnava', 'Martin'],
    cs: ['Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'Hradec Králové'],
    en: ['Bratislava', 'Kosice', 'Presov', 'Zilina', 'Banska Bystrica', 'Nitra', 'Trnava', 'Martin']
  };
  
  return {
    title,
    description,
    price: random(20, 1500),
    currency: 'EUR',
    condition: randomChoice(['new', 'used']),
    location: randomChoice(locations[locale]),
    views: random(0, 150),
    is_active: true
  };
}

async function ensurePlaceholderUser() {
  const userId = '00000000-0000-0000-0000-000000000000';
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();
  
  if (!existing) {
    await supabase.from('users').insert({
      id: userId,
      username: 'seed_user',
      full_name: 'Seed User',
      verified: true
    });
  }
}

async function seedDatabase() {
  console.log('🚀 Starting Slovor MP seed (realistic multilingual listings)...');
  console.log('');
  
  try {
    await ensurePlaceholderUser();
    
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (catError) throw catError;
    
    console.log(`✅ Found ${categories.length} categories`);
    console.log('');
    
    let totalCreated = 0;
    const locale = 'en'; // Default language for listings
    
    console.log(`🌍 Language: ${locale.toUpperCase()}`);
    console.log('');
    
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const categoryName = category.name_en || category.name;
      
      console.log(`📦 [${i + 1}/${categories.length}] ${categoryName}`);
      
      // Get image keywords for this category
      const imageKeywords = categoryImages[category.slug] || ['product', 'item', 'goods'];
      
      for (let j = 0; j < 10; j++) {
        const listingData = generateListingContent(category, j, locale);
        
        const timestamp = Date.now();
        const seed = `${category.slug}-${i}-${j}-${timestamp}`;
        
        // Generate 3 category-relevant images
        const imageUrls = [
          getUnsplashUrl(imageKeywords[j % imageKeywords.length], `${seed}-1`),
          getUnsplashUrl(imageKeywords[(j + 1) % imageKeywords.length], `${seed}-2`),
          getUnsplashUrl(imageKeywords[(j + 2) % imageKeywords.length], `${seed}-3`)
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
        
        totalCreated++;
      }
      
      console.log(`  ✅ Created 10 listings with category-specific images`);
    }
    
    console.log('');
    console.log('🎉 Seed complete!');
    console.log('');
    console.log('📊 Statistics:');
    console.log(`  - Language: ${locale.toUpperCase()}`);
    console.log(`  - Categories: ${categories.length}`);
    console.log(`  - Listings created: ${totalCreated}`);
    console.log(`  - Images per listing: 3 (category-specific)`);
    console.log(`  - Total images: ${totalCreated * 3}`);
    console.log('');
    console.log('✅ Database is ready with realistic content!');
    console.log('');
    console.log('💡 All listings have category-relevant images and content!');
    
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
