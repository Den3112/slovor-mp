-- Add multilingual support for listings
-- Adds title and description in Slovak, Czech, and English

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS title_sk TEXT,
  ADD COLUMN IF NOT EXISTS title_cs TEXT,
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description_sk TEXT,
  ADD COLUMN IF NOT EXISTS description_cs TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Copy existing title/description to English columns
UPDATE listings 
SET 
  title_en = title,
  description_en = description
WHERE title_en IS NULL;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_listings_title_en ON listings(title_en);
CREATE INDEX IF NOT EXISTS idx_listings_title_sk ON listings(title_sk);
CREATE INDEX IF NOT EXISTS idx_listings_title_cs ON listings(title_cs);
