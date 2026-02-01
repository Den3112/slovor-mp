-- Migration to add missing localization columns and fix schema inconsistencies
-- Target: listings and categories tables

DO $$
BEGIN
    -- 1. Listings Table: Localization Columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'title_sk') THEN
        ALTER TABLE listings ADD COLUMN title_sk TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'title_cs') THEN
        ALTER TABLE listings ADD COLUMN title_cs TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'title_en') THEN
        ALTER TABLE listings ADD COLUMN title_en TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'description_sk') THEN
        ALTER TABLE listings ADD COLUMN description_sk TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'description_cs') THEN
        ALTER TABLE listings ADD COLUMN description_cs TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'description_en') THEN
        ALTER TABLE listings ADD COLUMN description_en TEXT;
    END IF;

    -- 2. Categories Table: Localization Columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'name_sk') THEN
        ALTER TABLE categories ADD COLUMN name_sk TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'name_cs') THEN
        ALTER TABLE categories ADD COLUMN name_cs TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'name_en') THEN
        ALTER TABLE categories ADD COLUMN name_en TEXT;
    END IF;

END $$;

-- 3. Populate default values for localized columns to avoid empty results in search
UPDATE listings SET title_en = title WHERE title_en IS NULL;
UPDATE listings SET description_en = description WHERE description_en IS NULL;
UPDATE categories SET name_en = name WHERE name_en IS NULL;
