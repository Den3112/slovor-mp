-- Slovor MP: Migration to support multiple images per listing + enhanced filters
-- Date: 2025-12-22
-- Execute in Supabase SQL Editor

-- ===========================
-- STEP 1: Add new columns
-- ===========================

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS condition TEXT CHECK (condition IN ('new', 'used')) DEFAULT 'used',
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ===========================
-- STEP 2: Migrate existing image_url to images array
-- ===========================

UPDATE listings 
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL 
  AND image_url != '' 
  AND (images IS NULL OR array_length(images, 1) IS NULL);

-- ===========================
-- STEP 3: Add icon_name to categories
-- ===========================

ALTER TABLE categories
ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT 'Package';

-- ===========================
-- STEP 4: Update category icons with Lucide icon names
-- ===========================

-- Electronics & Tech
UPDATE categories SET icon_name = 'Laptop' WHERE slug = 'laptops';
UPDATE categories SET icon_name = 'Smartphone' WHERE slug = 'phones';
UPDATE categories SET icon_name = 'Camera' WHERE slug = 'cameras';
UPDATE categories SET icon_name = 'Volume2' WHERE slug = 'audio';
UPDATE categories SET icon_name = 'Cpu' WHERE slug = 'electronics';

-- Vehicles
UPDATE categories SET icon_name = 'Car' WHERE slug IN ('cars', 'vehicles');
UPDATE categories SET icon_name = 'Bike' WHERE slug = 'motorcycles';
UPDATE categories SET icon_name = 'Wrench' WHERE slug = 'autoparts';

-- Real Estate
UPDATE categories SET icon_name = 'Home' WHERE slug IN ('apartments', 'houses', 'real-estate');
UPDATE categories SET icon_name = 'Building2' WHERE slug = 'commercial';
UPDATE categories SET icon_name = 'TreePine' WHERE slug = 'land';

-- Fashion & Clothing
UPDATE categories SET icon_name = 'Shirt' WHERE slug IN ('fashion', 'clothes-kids', 'men-fashion', 'women-fashion', 'moda');
UPDATE categories SET icon_name = 'Footprints' WHERE slug = 'shoes';

-- Home & Garden
UPDATE categories SET icon_name = 'Home' WHERE slug = 'home-garden';
UPDATE categories SET icon_name = 'Armchair' WHERE slug = 'furniture';
UPDATE categories SET icon_name = 'ChefHat' WHERE slug = 'kitchen';
UPDATE categories SET icon_name = 'Flower2' WHERE slug = 'garden';

-- Sports & Fitness
UPDATE categories SET icon_name = 'Dumbbell' WHERE slug IN ('fitness', 'sports-equipment', 'sport-hobby');
UPDATE categories SET icon_name = 'Bike' WHERE slug = 'cycling';
UPDATE categories SET icon_name = 'Snowflake' WHERE slug = 'winter-sports';

-- Kids & Family
UPDATE categories SET icon_name = 'Baby' WHERE slug IN ('kids-family', 'pre-deti');
UPDATE categories SET icon_name = 'Shirt' WHERE slug = 'clothes-kids';
UPDATE categories SET icon_name = 'Gamepad2' WHERE slug = 'toys';
UPDATE categories SET icon_name = 'Baby' WHERE slug = 'strollers';

-- Pets
UPDATE categories SET icon_name = 'Dog' WHERE slug = 'dogs';
UPDATE categories SET icon_name = 'Cat' WHERE slug = 'cats';
UPDATE categories SET icon_name = 'Pawprint' WHERE slug = 'pets';

-- Jobs & Services
UPDATE categories SET icon_name = 'Briefcase' WHERE slug IN ('jobs-services', 'praca');
UPDATE categories SET icon_name = 'GraduationCap' WHERE slug = 'tutoring';
UPDATE categories SET icon_name = 'Hammer' WHERE slug = 'craftsmen';
UPDATE categories SET icon_name = 'Truck' WHERE slug = 'transport-services';

-- Books & Education
UPDATE categories SET icon_name = 'BookOpen' WHERE slug = 'books-education';

-- ===========================
-- STEP 5: Create indexes for performance
-- ===========================

CREATE INDEX IF NOT EXISTS idx_listings_condition ON listings(condition);
CREATE INDEX IF NOT EXISTS idx_listings_is_active ON listings(is_active);
CREATE INDEX IF NOT EXISTS idx_listings_views ON listings(views DESC);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);

-- ===========================
-- STEP 6: Verify migration
-- ===========================

-- Check listings table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'listings' 
  AND column_name IN ('images', 'condition', 'views', 'is_active')
ORDER BY ordinal_position;

-- Check sample data
SELECT id, title, array_length(images, 1) as image_count, condition, views 
FROM listings 
LIMIT 5;

-- Check categories with icons
SELECT name, slug, icon_name 
FROM categories 
ORDER BY name 
LIMIT 10;

-- ===========================
-- NOTES:
-- ===========================
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify results with SELECT queries at the end
-- 3. If migration successful, can optionally drop image_url column:
--    ALTER TABLE listings DROP COLUMN IF EXISTS image_url;
-- 4. Remember to update Row Level Security policies if needed
