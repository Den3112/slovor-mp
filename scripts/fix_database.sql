-- Unified Database Fix Script
-- Combines schema migration and content seeding
-- Run this in Supabase SQL Editor to fix missing tables and data

-- ==============================================
-- PART 1: Schema Migration (creates tables)
-- ==============================================

-- 0. Profiles & Auth Safety
-- Ensure profiles table exists (it mirrors auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role VARCHAR(50) DEFAULT 'user';
    END IF;
END $$;

-- 1. Transactions / Payments
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    type VARCHAR(50) NOT NULL CHECK (type IN ('promotion_top', 'promotion_highlight', 'subscription', 'refill')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    provider_id VARCHAR(100), -- Stripe ID, etc.
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can view own transactions" ON transactions
        FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can view all transactions" ON transactions
        FOR SELECT USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. Blog Posts (Content Management)
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL, -- Markdown/HTML
    cover_image VARCHAR(500),
    author_id UUID REFERENCES profiles(id),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts
        FOR SELECT USING (is_published = true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can manage blog posts" ON blog_posts
        FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
        );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 3. Static Pages (Content Management)
CREATE TABLE IF NOT EXISTS static_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'about', 'terms', 'privacy'
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Static pages viewable by everyone" ON static_pages
        FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can manage static pages" ON static_pages
        FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 4. Listing Reports (Safety)
CREATE TABLE IF NOT EXISTS listing_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    reported_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason VARCHAR(100) NOT NULL, -- 'spam', 'fraud', 'offensive'
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    resolved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE listing_reports ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can create reports" ON listing_reports
        FOR INSERT WITH CHECK (auth.uid() = reporter_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can view and manage reports" ON listing_reports
        FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
        );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 5. Additional Listing Features (Highlighting)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'is_highlighted') THEN
        ALTER TABLE listings ADD COLUMN is_highlighted BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_listing_reports_status ON listing_reports(status);

-- ==============================================
-- PART 2: Content Seeding (inserts data)
-- ==============================================

-- 1. Site Settings Table (Ensure it exists)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT DEFAULT 'Slovor Marketplace',
    support_email TEXT DEFAULT 'support@slovor.sk',
    facebook_url TEXT,
    instagram_url TEXT,
    twitter_url TEXT,
    footer_description TEXT DEFAULT 'Modern marketplace for Slovakia and Czech Republic.',
    maintenance_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings if not exists
INSERT INTO site_settings (site_name)
SELECT 'Slovor Marketplace'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- 2. Blog Posts Seed
-- Delete existing seed data with these slugs to prevent duplicates if re-running
DELETE FROM blog_posts WHERE slug IN ('how-to-sell-faster-2026', 'safe-transactions-guide');

INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, is_published, published_at, author_id)
VALUES
(
  'how-to-sell-faster-2026',
  'How to Sell Your Items Faster on Slovor',
  'Learn the secrets to creating listings that attract buyers and close deals quickly. From photography tips to pricing strategies.',
  '<h2>1. High-Quality Photos</h2><p>Take at least 5 photos from different angles. Use natural light.</p><h2>2. Honest Descriptions</h2><p>Mention any flaws. Honesty builds trust and reduces returns.</p><h2>3. Competitive Pricing</h2><p>Check what others are charging for similar items.</p>',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
  true,
  NOW(),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'safe-transactions-guide',
  'Staying Safe: A Guide to Secure Transactions',
  'Protect yourself from scams with our comprehensive safety guide. Learn to identify red flags and conduct safe meetups.',
  '<h2>Safety First</h2><p>Always meet in public places. Never send money before seeing the item.</p><h2>Payment Methods</h2><p>Use cash or instant bank transfers during the meeting.</p>',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200',
  true,
  NOW(),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
);
