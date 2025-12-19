-- Sync with production database structure
-- This migration ensures local dev matches production

-- Drop our test categories table if exists (from 002_categories.sql)
DROP TABLE IF EXISTS categories CASCADE;

-- Recreate categories table matching production schema
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert production categories (matching your current data)
INSERT INTO categories (name, slug, description, icon, order_index) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets', '📱', 1),
('Home & Garden', 'home-garden', 'Furniture, decor, and gardening', '🏠', 2),
('Real Estate', 'real-estate', 'Property, apartments, and houses', '🏡', 3),
('Jobs', 'jobs', 'Job offers and employment opportunities', '💼', 4),
('Fashion', 'fashion', 'Clothing, accessories, and footwear', '👕', 5),
('Sports & Hobbies', 'sports-hobbies', 'Equipment and hobby items', '⚽', 6),
('Vehicles', 'vehicles', 'Cars, motorcycles, and transportation', '🚗', 7),
('Services', 'services', 'Professional services and repairs', '🔧', 8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  order_index = EXCLUDED.order_index;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop old policies if exist
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
DROP POLICY IF EXISTS "Public read" ON categories;

-- Create simple public read policy
CREATE POLICY "public_read_categories"
  ON categories FOR SELECT
  USING (true);

-- Update listings table to ensure category_id column exists and is indexed
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE listings ADD COLUMN category_id UUID REFERENCES categories(id);
  END IF;
END $$;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Ensure updated_at trigger exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
