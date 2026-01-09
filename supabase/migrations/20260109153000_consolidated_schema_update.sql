-- Consolidated schema update based on slovor_mp_db_migration.sql
-- Adapted for existing 'profiles' table and avoiding conflicts

-- 1. Extend 'profiles' table (instead of 'Users')
DO $$
BEGIN
    -- phone_number
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone_number') THEN
        ALTER TABLE profiles ADD COLUMN phone_number VARCHAR(20) DEFAULT NULL;
    END IF;

    -- bio
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT DEFAULT NULL;
    END IF;

    -- is_verified
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_verified') THEN
        ALTER TABLE profiles ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;

    -- verification_level
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_level') THEN
        ALTER TABLE profiles ADD COLUMN verification_level VARCHAR(50) DEFAULT 'none';
    END IF;

    -- rating
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rating') THEN
        ALTER TABLE profiles ADD COLUMN rating DECIMAL(3, 2) DEFAULT 0.00;
    END IF;

    -- review_count
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'review_count') THEN
        ALTER TABLE profiles ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- 2. Extend 'listings' table
DO $$
BEGIN
    -- condition
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'condition') THEN
        ALTER TABLE listings ADD COLUMN condition VARCHAR(50) DEFAULT NULL;
    END IF;

    -- is_featured
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'is_featured') THEN
        ALTER TABLE listings ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;

    -- featured_until
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'featured_until') THEN
        ALTER TABLE listings ADD COLUMN featured_until TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    END IF;

    -- views_count
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'views_count') THEN
        ALTER TABLE listings ADD COLUMN views_count INTEGER DEFAULT 0;
    END IF;

    -- negotiable
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'negotiable') THEN
        ALTER TABLE listings ADD COLUMN negotiable BOOLEAN DEFAULT FALSE;
    END IF;

    -- attributes (JSONB)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'attributes') THEN
        ALTER TABLE listings ADD COLUMN attributes JSONB DEFAULT '{}';
    END IF;
END $$;

-- 3. Create new tables
-- User_Verifications
CREATE TABLE IF NOT EXISTS user_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- Changed to references profiles(id)
    document_type VARCHAR(100) NOT NULL,
    document_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments_Subscriptions
CREATE TABLE IF NOT EXISTS payments_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- Changed to references profiles(id)
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR' NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    transaction_id VARCHAR(255) DEFAULT NULL,
    payment_gateway VARCHAR(100) DEFAULT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: 'favorites' table is skipped as it likely exists or handled by separate migration.
-- Note: 'messages' table is skipped to avoid conflict with existing conversation-based messaging.
-- Note: 'reviews' table is skipped as it likely exists.

-- 4. Create Indexes
-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);

-- Listings
CREATE INDEX IF NOT EXISTS idx_listings_is_featured ON listings(is_featured);
CREATE INDEX IF NOT EXISTS idx_listings_views_count ON listings(views_count);

-- User_Verifications
CREATE INDEX IF NOT EXISTS idx_user_verifications_user_id ON user_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verifications_status ON user_verifications(status);

-- Payments_Subscriptions
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_listing_id ON payments_subscriptions(listing_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments_subscriptions(status);
