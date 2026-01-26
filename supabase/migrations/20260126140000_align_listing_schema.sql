-- Final Schema Alignment for Listings and Profiles
-- Aligns with lib/types/database.ts and Master Plan

DO $$
BEGIN
    -- 1. Listings Table Alignment

    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'status') THEN
        ALTER TABLE listings ADD COLUMN status VARCHAR(50) DEFAULT 'active';

        -- Migrate data from is_active if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'is_active') THEN
            UPDATE listings SET status = 'active' WHERE is_active = true;
            UPDATE listings SET status = 'draft' WHERE is_active = false;
        END IF;
    END IF;

    -- Add views_count if views exists but views_count doesn't
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'views')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'views_count') THEN
        ALTER TABLE listings ADD COLUMN views_count INTEGER DEFAULT 0;
        UPDATE listings SET views_count = views;
    END IF;

    -- Ensure attributes column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'attributes') THEN
        ALTER TABLE listings ADD COLUMN attributes JSONB DEFAULT '{}';
    END IF;

    -- 2. Profiles Table Alignment

    -- Ensure role exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role VARCHAR(20) DEFAULT 'user';
    END IF;

    -- Ensure verification_level exists (handled in 20260126120000, but ensuring)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_level') THEN
        ALTER TABLE profiles ADD COLUMN verification_level VARCHAR(50) DEFAULT 'none';
    END IF;

END $$;

-- 3. Update Indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_status_v2 ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_user_status ON listings(user_id, status);
