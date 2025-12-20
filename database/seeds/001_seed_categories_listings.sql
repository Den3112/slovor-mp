-- Seed data for Slovor Marketplace
-- Categories and test listings in Slovak context

-- ============================================
-- STEP 1: Create test user (if not exists)
-- ============================================
-- Note: This creates a user in auth.users table
-- You may need to run this part separately if permissions are restricted

-- Create test user (password: testpassword123)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'test@slovor.sk',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Test User"}',
  false,
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: Clear existing data
-- ============================================
TRUNCATE TABLE listings CASCADE;
TRUNCATE TABLE categories CASCADE;

-- ============================================
-- STEP 3: Insert categories
-- ============================================
INSERT INTO categories (name, slug, description, icon, order_index) VALUES
('Elektronika', 'elektronika', 'Počítače, telefóny, televízory a ďalšia elektronika', '📱', 1),
('Vozidlá', 'vozidla', 'Autá, motocykle, náhradné diely', '🚗', 2),
('Nehnuteľnosti', 'nehnutelnosti', 'Byty, domy, pozemky na predaj a prenájom', '🏠', 3),
('Práca', 'praca', 'Ponuky práce a brigády', '💼', 4),
('Dom a záhrada', 'dom-zahrada', 'Nábytok, záhradné potreby, vybavenie', '🏡', 5),
('Móda', 'moda', 'Oblečenie, obuv, doplnky', '👗', 6),
('Šport a hobby', 'sport-hobby', 'Športové potreby, hudobné nástroje, knihy', '⚽', 7),
('Služby', 'sluzby', 'Remeselné práce, opravy, kurzy', '🔧', 8),
('Pre deti', 'pre-deti', 'Detské oblečenie, hračky, kočíky', '🧸', 9),
('Zvieratá', 'zvierata', 'Psy, mačky, akváriá, chovateľské potreby', '🐕', 10)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  order_index = EXCLUDED.order_index;

-- ============================================
-- STEP 4: Insert listings with test user
-- ============================================
DO $$
DECLARE
  test_user_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
  cat_elektronika UUID;
  cat_vozidla UUID;
  cat_nehnutelnosti UUID;
  cat_praca UUID;
  cat_dom UUID;
  cat_moda UUID;
  cat_sport UUID;
  cat_sluzby UUID;
  cat_deti UUID;
  cat_zvierata UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_elektronika FROM categories WHERE slug = 'elektronika';
  SELECT id INTO cat_vozidla FROM categories WHERE slug = 'vozidla';
  SELECT id INTO cat_nehnutelnosti FROM categories WHERE slug = 'nehnutelnosti';
  SELECT id INTO cat_praca FROM categories WHERE slug = 'praca';
  SELECT id INTO cat_dom FROM categories WHERE slug = 'dom-zahrada';
  SELECT id INTO cat_moda FROM categories WHERE slug = 'moda';
  SELECT id INTO cat_sport FROM categories WHERE slug = 'sport-hobby';
  SELECT id INTO cat_sluzby FROM categories WHERE slug = 'sluzby';
  SELECT id INTO cat_deti FROM categories WHERE slug = 'pre-deti';
  SELECT id INTO cat_zvierata FROM categories WHERE slug = 'zvierata';

  -- Electronics
  INSERT INTO listings (user_id, title, description, price, currency, category_id, location, status, featured) VALUES
  (test_user_id, 'iPhone 13 Pro 256GB', 'Bazár, výborný stav, kompletný s príslušenstvom. Batéria 92%.', 650, 'EUR', cat_elektronika, 'Bratislava', 'active', true),
  (test_user_id, 'Samsung 55" 4K TV', 'Smart TV, roku používania, bez škrabancov. Funguje perfektne.', 380, 'EUR', cat_elektronika, 'Košice', 'active', false),
  (test_user_id, 'MacBook Air M1 2020', 'Ako nový, len 50 nabíjacích cyklov. Záruka ešte platná.', 850, 'EUR', cat_elektronika, 'Žilina', 'active', true),
  (test_user_id, 'PlayStation 5', 'Kompletný set s 2 ovládačmi a 3 hrami. Ako nový.', 480, 'EUR', cat_elektronika, 'Prešov', 'active', false);

  -- Vehicles
  INSERT INTO listings (user_id, title, description, price, currency, category_id, location, status, featured) VALUES
  (test_user_id, 'Škoda Octavia 2018', 'Diesel, 150 000 km, servisná kniha, nehavarované. Prvý majiteľ.', 14500, 'EUR', cat_vozidla, 'Bratislava', 'active', true),
  (test_user_id, 'Yamaha R6 2015', 'Športová motorka, top stav, nové pneumatiky. Odpočet DPH možný.', 8200, 'EUR', cat_vozidla, 'Nitra', 'active', false),
  (test_user_id, 'VW Golf 7 GTI', 'Benzín, DSG prevodovka, 95 000 km. Full výbava, xenóny, kožený interiér.', 17900, 'EUR', cat_vozidla, 'Trenčín', 'active', true);

  -- Real Estate
  INSERT INTO listings (user_id, title, description, price, currency, category_id, location, status, featured) VALUES
  (test_user_id, '2-izbový byt Petržalka', '50m², 5. poschodie, loggia, pivnica. Ihneď voľný.', 145000, 'EUR', cat_nehnutelnosti, 'Bratislava - Petržalka', 'active', true),
  (test_user_id, 'Rodinný dom Trnava', '120m², pozemok 600m², garáž. Novostavba 2020.', 285000, 'EUR', cat_nehnutelnosti, 'Trnava', 'active', true),
  (test_user_id, 'Prenájom 1-izbového bytu', 'Centrum, 35m², zariadený, voľný od 1.1.2026. Bez realitky.', 550, 'EUR', cat_nehnutelnosti, 'Košice - Centrum', 'active', false);

  -- Jobs
  INSERT INTO listings (user_id, title, description, price, currency, category_id, location, status, featured) VALUES
  (test_user_id, 'Full-stack Developer - Remote', 'React + Node.js, 3+ roky praxe. Homeoffice možný. Plat 2500-3500€.', 3000, 'EUR', cat_praca, 'Remote / Bratislava', 'active', true),
  (test_user_id, 'Brigáda - Pomocník v sklade', 'Víkendy, 10€/hodina. Flexibilný čas.', 10, 'EUR', cat_praca, 'Žilina', 'active', false);

  -- Home & Garden
  INSERT INTO listings (user_id, title, description, price, currency, category_id, location, status, featured) VALUES
  (test_user_id, 'IKEA Pohovka šedá', '3-miestna, rozkládacia, takmer nová. Dôvod predaja: sťahovanie.', 180, 'EUR', cat_dom, 'Bratislava', 'active', false),
  (test_user_id, 'Záhradný nábytok set', 'Stôl + 6 stoličiek, drevo, ošetrené. Ideálne na terasu.', 220, 'EUR', cat_dom, 'Banská Bystrica', 'active', false);

  -- Fashion
  INSERT INTO listings (user_id, title, description, price, currency, category_id, location, status, featured) VALUES
  (test_user_id, 'Zimná bunda North Face', 'Pánska, veľkosť L, nosená 1 sezónu. Ako nová.', 95, 'EUR', cat_moda, 'Košice', 'active', false),
  (test_user_id, 'Nike Air Max 90', 'Dámske tenisky, veľkosť 38, originál. Nenošené, len vyskúšané.', 75, 'EUR', cat_moda, 'Bratislava', 'active', false);

  -- Sports & Hobbies
  INSERT INTO listings (user_id, title, description, price, currency, category_id, location, status, featured) VALUES
  (test_user_id, 'Bicykel Trek horský', '29" kolesá, hliníkový rám, servisovaný. Veľmi dobrý stav.', 420, 'EUR', cat_sport, 'Martin', 'active', false),
  (test_user_id, 'Gitara akustická Yamaha', 'F310, vhodná pre začiatočníkov. S obalom a ladičkou.', 110, 'EUR', cat_sport, 'Prešov', 'active', false);

  -- Services
  INSERT INTO listings (user_id, title, description, price, currency, category_id, location, status, featured) VALUES
  (test_user_id, 'Maľovanie bytov', 'Profesionálne maliarské práce. Cena dohodou. Referencie k dispozícii.', 0, 'EUR', cat_sluzby, 'Bratislava a okolie', 'active', false),
  (test_user_id, 'Doučovanie matematiky', 'Pre ZŠ a SŠ. 15€/hodina. Online aj osobne.', 15, 'EUR', cat_sluzby, 'Košice', 'active', false);

  -- Kids
  INSERT INTO listings (user_id, title, description, price, currency, category_id, location, status, featured) VALUES
  (test_user_id, 'Detský kočík 3v1', 'Kompletný set, výborný stav. Nosnosť do 15kg.', 280, 'EUR', cat_deti, 'Žilina', 'active', false),
  (test_user_id, 'LEGO Creator Expert', 'Set 10242 (Mini Cooper), kompletné, s návodom a krabicou.', 85, 'EUR', cat_deti, 'Bratislava', 'active', false);

  -- Animals
  INSERT INTO listings (user_id, title, description, price, currency, category_id, location, status, featured) VALUES
  (test_user_id, 'Šteniatka Labrador', 'Zlaté retrívre, očkované, s rodokmeňom. Odber možný od 8. týždňa.', 650, 'EUR', cat_zvierata, 'Nitra', 'active', true),
  (test_user_id, 'Akvárium 200L komplet', 'S filtrom, osvetlením a výbavou. Funkčné, čisté. Dôvod predaja: sťahovanie.', 120, 'EUR', cat_zvierata, 'Trenčín', 'active', false);

END $$;

-- ============================================
-- STEP 5: Success message
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Seed data inserted successfully!';
  RAISE NOTICE 'Test user: test@slovor.sk (password: testpassword123)';
  RAISE NOTICE 'Categories: %', (SELECT COUNT(*) FROM categories);
  RAISE NOTICE 'Listings: %', (SELECT COUNT(*) FROM listings);
END $$;
