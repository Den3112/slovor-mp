-- Add localization fields to listings table
-- Supports Slovak (sk), Czech (cs), English (en)

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS title_sk TEXT,
ADD COLUMN IF NOT EXISTS title_cs TEXT,
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS description_sk TEXT,
ADD COLUMN IF NOT EXISTS description_cs TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add indexes for localized fields to improve search performance
CREATE INDEX IF NOT EXISTS idx_listings_title_sk ON listings USING gin(to_tsvector('simple', title_sk));
CREATE INDEX IF NOT EXISTS idx_listings_title_cs ON listings USING gin(to_tsvector('simple', title_cs));
CREATE INDEX IF NOT EXISTS idx_listings_title_en ON listings USING gin(to_tsvector('english', title_en));

-- Copy existing data to default language (English)
UPDATE listings
SET 
  title_en = title,
  description_en = description
WHERE title_en IS NULL OR description_en IS NULL;

-- Add comment
COMMENT ON COLUMN listings.title_sk IS 'Localized title in Slovak';
COMMENT ON COLUMN listings.title_cs IS 'Localized title in Czech';
COMMENT ON COLUMN listings.title_en IS 'Localized title in English';
COMMENT ON COLUMN listings.description_sk IS 'Localized description in Slovak';
COMMENT ON COLUMN listings.description_cs IS 'Localized description in Czech';
COMMENT ON COLUMN listings.description_en IS 'Localized description in English';
