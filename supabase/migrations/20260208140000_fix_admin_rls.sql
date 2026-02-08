-- Fix Admin RLS and Content Permissions
-- Aligns with "Admin Hub Repair Plan"

-- 1. CATEGORIES: Allow Admins full control
-- Note: 'Anyone can view' policy already exists.
CREATE POLICY "Admins can insert categories" ON categories
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update categories" ON categories
    FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete categories" ON categories
    FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 2. BLOG POSTS (blog_posts): Allow Admins full control
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts" ON blog_posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all blog posts" ON blog_posts
    FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert blog posts" ON blog_posts
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update blog posts" ON blog_posts
    FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete blog posts" ON blog_posts
    FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 3. STATIC PAGES (static_pages): Allow Admins full control
ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view static pages" ON static_pages
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can insert static pages" ON static_pages
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update static pages" ON static_pages
    FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete static pages" ON static_pages
    FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
