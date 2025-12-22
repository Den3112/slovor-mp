-- Fix categories: Remove duplicates and create proper 25 categories structure
-- This migration will delete existing categories and recreate with correct structure

-- Step 1: Delete all listings (to avoid foreign key issues)
DELETE FROM listings;

-- Step 2: Delete all existing categories
DELETE FROM categories;

-- Step 3: Insert 25 main categories with proper multilingual support
INSERT INTO categories (name_sk, name_cs, name_en, slug, icon, sort_order) VALUES
-- 1. Electronics (Elektronika)
('Elektronika', 'Elektronika', 'Electronics', 'electronics', '💻', 1),
-- 2. Fashion (Oblečenie)
('Oblečenie', 'Oblečení', 'Clothing', 'clothing', '👕', 2),
-- 3. Home & Garden (Dom a záhrada)
('Dom a záhrada', 'Dům a zahrada', 'Home & Garden', 'home-garden', '🏠', 3),
-- 4. Sports (Šport)
('Šport', 'Sport', 'Sports', 'sports', '⚽', 4),
-- 5. Kids & Baby (Detské potreby)
('Detské potreby', 'Dětské potřeby', 'Kids & Baby', 'kids-baby', '👶', 5),
-- 6. Vehicles (Vozidlá)
('Vozidlá', 'Vozidla', 'Vehicles', 'vehicles', '🚗', 6),
-- 7. Real Estate (Nehnuteľnosti)
('Nehnuteľnosti', 'Nemovitosti', 'Real Estate', 'real-estate', '🏡', 7),
-- 8. Services (Služby)
('Služby', 'Služby', 'Services', 'services', '🔧', 8),
-- 9. Pets (Zvieratá)
('Zvieratá', 'Zvířata', 'Pets', 'pets', '🐕', 9),
-- 10. Hobbies (Hobby)
('Hobby', 'Hobby', 'Hobbies', 'hobbies', '🎨', 10),
-- 11. Books & Magazines (Knihy a časopisy)
('Knihy a časopisy', 'Knihy a časopisy', 'Books & Magazines', 'books-magazines', '📚', 11),
-- 12. Musical Instruments (Hudobné nástroje)
('Hudobné nástroje', 'Hudební nástroje', 'Musical Instruments', 'music-instruments', '🎸', 12),
-- 13. Movies & Music (Filmy a hudba)
('Filmy a hudba', 'Filmy a hudba', 'Movies & Music', 'movies-music', '🎬', 13),
-- 14. Beauty & Health (Krása a zdravie)
('Krása a zdravie', 'Krása a zdraví', 'Beauty & Health', 'beauty-health', '💄', 14),
-- 15. Toys & Games (Hračky a hry)
('Hračky a hry', 'Hračky a hry', 'Toys & Games', 'toys-games', '🧸', 15),
-- 16. Furniture (Nábytok)
('Nábytok', 'Nábytek', 'Furniture', 'furniture', '🪑', 16),
-- 17. Garden Equipment (Záhradná technika)
('Záhradná technika', 'Zahradní technika', 'Garden Equipment', 'garden-equipment', '🌱', 17),
-- 18. Tools & Machinery (Náradie a stroje)
('Náradie a stroje', 'Nářadí a stroje', 'Tools & Machinery', 'tools-machinery', '🔨', 18),
-- 19. Food & Drink (Potraviny)
('Potraviny', 'Potraviny', 'Food & Drink', 'food-drink', '🍎', 19),
-- 20. Jewelry & Watches (Šperky a hodinky)
('Šperky a hodinky', 'Šperky a hodinky', 'Jewelry & Watches', 'jewelry-watches', '💍', 20),
-- 21. Business & Industrial (Biznis a priemysel)
('Biznis a priemysel', 'Business a průmysl', 'Business & Industrial', 'business-industrial', '🏭', 21),
-- 22. Travel (Cestovanie)
('Cestovanie', 'Cestování', 'Travel', 'travel', '✈️', 22),
-- 23. Tickets & Events (Vstupenky)
('Vstupenky', 'Vstupenky', 'Tickets & Events', 'tickets-events', '🎫', 23),
-- 24. Gifts (Darčeky)
('Darčeky', 'Dárky', 'Gifts', 'gifts', '🎁', 24),
-- 25. Other (Ostatné)
('Ostatné', 'Ostatní', 'Other', 'other', '📦', 25);

-- Verify count
SELECT COUNT(*) as total_categories FROM categories;
