
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const IMAGE_POOL = {
    'auto-moto': ['1494976388531-d1058494cdd8', '1558981806-ec527fa84c39', '1503736334956-4c8f8e92946d', '1580273916550-e323be2ae537', '1502877336475-9c553e34dee0', '1617469767053-d8b5280b57e7'],
    'cars': ['1494976388531-d1058494cdd8', '1503376780353-7e6692767b70', '1492144531282-938b48fb3c6a', '1583121274602-3e2820c69888', '1525609004556-c46c7d6cf0a5', '1542281286-9e0a16bb7366'],
    'motorcycles': ['1558981806-ec527fa84c39', '1558981285-6f0a9a101fec', '1591637333184-19aa84b3e01f', '1558980394-0a06c4631733', '1558981359-219d6364c9c8', '1558981401-3e1f4095202a'],
    'real-estate': ['1480074568708-e7b720bb3f09', '1502672260266-1c1ef2d93688', '1512917774080-9991f1c4c750', '1600585154340-be6161a56a0c', '1600596542815-ffad4c1539a9', '1600602842263-fb8c047235a4'],
    'electronics': ['1468495244122-44a00931f44e', '1510557880182-3d4d3cba35a5', '1496181133206-80ce9b88a853', '1544244015-0df4b3ffc6b0', '1605902711622-cfb43c4437b5', '1498050108023-c5249f4df085'],
    'fashion': ['1490481651871-ab68ff25d43d', '1516257984411-bd6cb3f12d51', '1542291026-7eec264c27ff', '1523275335684-37898b6baf30', '1483985988355-797355509752', '1445205270394-11e4a7d28d66'],
    'home-garden': ['1585320806297-9794b3e4eeae', '1555041469-a586c61ea9bc', '1466692476868-aef1dfb1e735', '1530124560676-44b274f07613', '1513519245088-0e12332dfa5f', '1591472551103-02fded89097f'],
    'sport': ['1534438327276-14e5300c3a48', '1532298229144-0ee0b9c992b1', '1517836357463-d25dfeac3438', '1504280390367-361c6d9f38f4', '1552674605-e5ede488470a', '1541534741688-64650b697313'],
    'kids': ['1515488764276-beab7607c1e6', '1591967146662-2ca8b78801a6', '1522770179533-24471fcdba45', '1516627145497-ae6b6b890704', '1510334270763-8eae1f095166', '1520190282933-d71228072922'],
    'pets': ['1514888286954-2c2121174b58', '1517849845583-3c648a399ce7', '1495365200462-cb26038ebaba', '1537158550601-38343f9a7db1', '1533730354822-da38d5838ef9', '1543466838-6815fab2127b'],
    'books-education': ['1512820790803-83ca734da794', '1524985069008-dc2456b7bb92', '1495442358998-c01d03547a06', '1476275483038-59c9544704b5', '1513475382585-d069a5301f23', '1531482615713-205cd934cb97'],
}

const LOCATIONS = ['Bratislava', 'Košice', 'Žilina', 'Prešov', 'Nitra', 'Trnava', 'Trenčín', 'Banská Bystrica']
const VALID_USER_ID = '00000000-0000-0000-0000-000000000001'

const TITLES = [
    "Premium model", "Vynikajúca ponuka", "Limitovaná edícia", "Skvelý stav", "Výhodná cena",
    "Takmer nové", "Profesionálny kúsok", "Originálne balenie", "Zberateľský unikát", "Záruka kvality"
]

const DESCRIPTIONS = [
    "Tento produkt ponúka výnimočný pomer ceny a kvality. Bol používaný veľmi šetrne a je v bezchybnom technickom stave. Vhodné pre náročných užívateľov, ktorí hľadajú spoľahlivosť.",
    "Predám z dôvodu sťahovania alebo nevyužitia. Všetky funkcie otestované a plne funkčné. Možnosť osobného odberu alebo zaslania kuriérom po dohode. Pri rýchlom jednaní istá zľava.",
    "Moderný dizajn a vysoká funkčnosť v jednom. Skvele doplní vašu výbavu alebo domácnosť. Kúpené v SR, k dispozícii je aj originálna dokumentácia a príslušenstvo.",
    "Minimálne známky opotrebenia, vyzerá ako nové. Ideálne ako praktický darček. V prípade záujmu pošlem viac detailných fotografií do správy. Prosím kontaktujte ma telefonicky.",
    "Kvalitný výrobca, na ktorého sa môžete spoľahnúť. Tento konkrétny model získal mnoho pozitívnych recenzií. Predávam komplet tak, ako vidíte na fotkách."
]

function getRandomImage(pool, index, offset) {
    const ids = IMAGE_POOL[pool] || IMAGE_POOL['electronics']
    const id = ids[(index + offset) % ids.length]
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80&sig=${index}-${offset}`
}

async function seed() {
    console.log('Cleaning up old listings...')
    await supabase.from('listings').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const { data: categories, error: catError } = await supabase.from('categories').select('id, name, slug')
    if (catError) {
        console.error(catError)
        return
    }

    console.log(`Seeding unique listings for ${categories.length} categories...`)

    for (const cat of categories) {
        const listings = []
        const poolKey = Object.keys(IMAGE_POOL).find(k => cat.slug.includes(k)) || 'electronics'

        for (let i = 1; i <= 10; i++) {
            const price = Math.floor(Math.random() * 800) + 5
            const title = `${TITLES[i - 1]} - ${cat.name}`
            const desc = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)]

            // Generate 3 unique images
            const images = [
                getRandomImage(poolKey, i, 100),
                getRandomImage(poolKey, i, 200),
                getRandomImage(poolKey, i, 300)
            ]

            listings.push({
                category_id: cat.id,
                title: title,
                description: desc,
                price: price,
                currency: 'EUR',
                location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
                images: images,
                user_id: VALID_USER_ID,
                created_at: new Date(Date.now() - Math.random() * 2000000000).toISOString()
            })
        }

        const { error } = await supabase.from('listings').insert(listings)
        if (error) {
            console.error(`Error seeding category ${cat.name}:`, error.message)
        } else {
            console.log(`✓ Seeded 10 unique listings (3 images each) for ${cat.name}`)
        }
    }

    console.log('Premium Seeding Finished!')
}

seed()
