-- Migration to align database with Master Plan and TypeScript Definitions

-- 1. Listings: Rename featured columns to promoted
DO $$
BEGIN
    -- is_featured -> is_promoted
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'is_featured')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'is_promoted') THEN
        ALTER TABLE listings RENAME COLUMN is_featured TO is_promoted;
    END IF;

    -- featured_until -> promoted_until
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'featured_until')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'promoted_until') THEN
        ALTER TABLE listings RENAME COLUMN featured_until TO promoted_until;
    END IF;

    -- Ensure columns exist if renaming didn't happen (e.g. table created fresh without them)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'is_promoted') THEN
        ALTER TABLE listings ADD COLUMN is_promoted BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'promoted_until') THEN
        ALTER TABLE listings ADD COLUMN promoted_until TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    END IF;
END $$;

-- 2. Reviews: Align columns with types (author_id, recipient_id)
DO $$
BEGIN
    -- Rename buyer_id -> author_id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'buyer_id')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'author_id') THEN
        ALTER TABLE reviews RENAME COLUMN buyer_id TO author_id;
    END IF;

    -- Rename seller_id -> recipient_id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'seller_id')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'recipient_id') THEN
        ALTER TABLE reviews RENAME COLUMN seller_id TO recipient_id;
    END IF;

    -- Update Foreign Keys to point to profiles if they point to auth.users?
    -- Assuming profiles exists for all users. Ideally we change the constraint but simple rename is safer for now.
    -- If we created a new table we would use profiles.
END $$;

-- 3. Create Admin Actions table for logs
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id),
    target_id UUID NOT NULL,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('listing', 'user', 'review')),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('approve', 'reject', 'ban', 'verify')),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Admin Actions
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON admin_actions(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);

-- 4. User Verifications (Ensure exists - effectively handled in previous migration, but adding here just in case)
CREATE TABLE IF NOT EXISTS user_verifications (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
     document_type VARCHAR(100) NOT NULL,
     document_data JSONB NOT NULL,
     status VARCHAR(50) DEFAULT 'pending' NOT NULL,
     verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Profiles: Verification Level (Ensured)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_level') THEN
        ALTER TABLE profiles ADD COLUMN verification_level VARCHAR(50) DEFAULT 'none';
    END IF;
END $$;
