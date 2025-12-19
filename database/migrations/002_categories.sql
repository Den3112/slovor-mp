enie', 'Oblečení', 'Clothing', 'clothing', '👕', 2),
('Dom a záhrada', 'Dom a záhrada', 'Dům a zahrada', 'Home & Garden', 'home-garden', '🏠', 3),
('Šport', 'Šport', 'Sport', 'Sports', 'sports', '⚽', 4),
('Detské potreby', 'Detské potreby', 'Dětské potřeby', 'Kids & Baby', 'kids-baby', '👶', 5),
('Vozidlá', 'Vozidlá', 'Vozidla', 'Vehicles', 'vehicles', '🚗', 6),
('Nehnuteľnosti', 'Nehnuteľnosti', 'Nemovitosti', 'Real Estate', 'real-estate', '🏡', 7),
('Služby', 'Služby', 'Služby', 'Services', 'services', '🔧', 8),
('Zvieratá', 'Zvieratá', 'Zvířata', 'Pets', 'pets', '🐕', 9),
('Hobby', 'Hobby', 'Hobby', 'Hobbies', 'hobbies', '🎨', 10),
('Knihy a časopisy', 'Knihy a časopisy', 'Knihy a časopisy', 'Books & Magazines', 'books-magazines', '📚', 11),
('Hudobné nástroje', 'Hudobné nástroje', 'Hudební nástroje', 'Musical Instruments', 'music-instruments', '🎸', 12),
('Filmy a hudba', 'Filmy a hudba', 'Filmy a hudba', 'Movies & Music', 'movies-music', '🎬', 13),
('Krásy a zdravie', 'Krása a zdravie', 'Krása a zdraví', 'Beauty & Health', 'beauty-health', '💄', 14),
('Hračky a hry', 'Hračky a hry', 'Hračky a hry', 'Toys & Games', 'toys-games', '🧸', 15),
('Nábytok', 'Nábytok', 'Nábytek', 'Furniture', 'furniture', '🪑', 16),
('Záhradná technika', 'Záhradná technika', 'Zahradní technika', 'Garden Equipment', 'garden-equipment', '🌱', 17),
('Náradie a stroje', 'Náradie a stroje', 'Nářadí a stroje', 'Tools & Machinery', 'tools-machinery', '🔨', 18),
('Potraviny', 'Potraviny', 'Potraviny', 'Food & Drink', 'food-drink', '🍎', 19),
('Šperky a hodinky', 'Šperky a hodinky', 'Šperky a hodinky', 'Jewelry & Watches', 'jewelry-watches', '💍', 20),
('Biznis a priemysel', 'Biznis a priemysel', 'Business a průmysl', 'Business & Industrial', 'business-industrial', '🏭', 21),
('Cestovanie', 'Cestovanie', 'Cestování', 'Travel', 'travel', '✈️', 22),
('Vstupenky', 'Vstupenky', 'Vstupenky', 'Tickets & Events', 'tickets-events', '🎫', 23),
('Darčeky', 'Darčeky', 'Dárky', 'Gifts', 'gifts', '🎁', 24),
('Ostatné', 'Ostatné', 'Ostatní', 'Other', 'other', '📦', 25);

-- Update listings table to support subcategories
ALTER TABLE listings 
  DROP CONSTRAINT IF EXISTS listings_category_id_fkey,
  ADD COLUMN subcategory_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  ADD CONSTRAINT listings_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_subcategory ON listings(subcategory_id);

-- Enable RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Everyone can read active categories
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- Only admins can modify categories (implement admin check)
CREATE POLICY "Only admins can modify categories"
  ON categories FOR ALL
  USING (false); -- Implement proper admin check
