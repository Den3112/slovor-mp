// Production seed script - 10 listings per category
// Generates 10 listings for each of the 25 categories
// Total: 250 listings with 3 images each (750 images)

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[random(0, arr.length - 1)];

function getPicsumUrl(seed) {
  return `https://picsum.photos/seed/${seed}/1200/900`;
}

// Multilingual template generator
function generateListing(category, index, locale = 'sk') {
  const locations = {
    sk: ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica', 'Nitra', 'Trnava', 'Martin'],
    cs: ['Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'Hradec Králové'],
    en: ['Bratislava', 'Kosice', 'Presov', 'Zilina', 'Banska Bystrica', 'Nitra']
  };

  const templates = {
    sk: {
      title: `${category.name_sk || category.name} - Kvalitný produkt #${index + 1}`,
      desc: `Vysokokvalitný ${category.name_sk || category.name} v perfektnom stave. Zachovalý, pripravený na okamžité použitie. Cena je konečná, možnosť osobného odberu alebo doručenia. Pri záujme kontaktujte.`
    },
    cs: {
      title: `${category.name_cs || category.name} - Kvalitní produkt #${index + 1}`,
      desc: `Vysokokvalitní ${category.name_cs || category.name} v perfektním stavu. Zachovalý, připravený k okamžitému použití. Cena je konečná, možnost osobního odebíru nebo doručení. Při zájmu kontaktujte.`
    },
    en: {
      title: `${category.name_en || category.name} - Quality Product #${index + 1}`,
      desc: `High-quality ${category.name_en || category.name} in perfect condition. Well-maintained, ready for immediate use. Price is final, possibility of personal pickup or delivery. Contact if interested.`
    }
  };

  const template = templates[locale];
  
  return {
    title: template.title,
    description: template.desc,
    price: random(20, 1000),
    currency: 'EUR',
    condition: randomChoice(['new', 'used']),
    location: randomChoice(locations[locale]),
    views: random(0, 100),
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
  console.log('🚀 Starting Slovor MP seed (all categories)...');
  console.log('');
  
  try {
    await ensurePlaceholderUser();
    
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name_sk');
    
    if (catError) throw catError;
    
    console.log(`✅ Found ${categories.length} categories`);
    console.log('');
    
    let totalCreated = 0;
    const locale = 'sk'; // Change to 'cs' or 'en' if needed
    
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      console.log(`📦 [${i + 1}/${categories.length}] ${category.name_sk || category.name}`);
      
      for (let j = 0; j < 10; j++) {
        const listingData = generateListing(category, j, locale);
        
        const timestamp = Date.now();
        const imageUrls = [
          getPicsumUrl(`${category.slug}-${i}-${j}-0-${timestamp}`),
          getPicsumUrl(`${category.slug}-${i}-${j}-1-${timestamp}`),
          getPicsumUrl(`${category.slug}-${i}-${j}-2-${timestamp}`)
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
      
      console.log(`  ✅ Created 10 listings`);
    }
    
    console.log('');
    console.log('🎉 Seed complete!');
    console.log('');
    console.log('📊 Statistics:');
    console.log(`  - Categories: ${categories.length}`);
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
