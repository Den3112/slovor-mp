-- setup-content.sql
-- Run this in your Supabase SQL Editor to prepare everything for the Content Hub

-- 1. Blog Posts & Static Pages Seed
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

-- 2. Site Settings Table
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
