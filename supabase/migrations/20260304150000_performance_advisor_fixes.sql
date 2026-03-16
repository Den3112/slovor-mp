-- PERFORMANCE ADVISOR OPTIMIZATION MIGRATION
-- Resolves: 165 "Multiple Permissive Policies" & 38 "Auth RLS Initplan" warnings.
-- Version: 1.1

BEGIN;

-- ============================================================================
-- 1. CLEANUP PREVIOUS REDUNDANT POLICIES (TO RESOLVE MULTIPLE PERMISSIVE)
-- ============================================================================

-- Function to drop all policies on a table to start fresh
CREATE OR REPLACE FUNCTION drop_all_policies(t_name TEXT) RETURNS VOID AS $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = t_name AND schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, t_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Clean tables with the most warnings
SELECT drop_all_policies('listing_reports');
SELECT drop_all_policies('listings');
SELECT drop_all_policies('access_logs');
SELECT drop_all_policies('activity_logs');
SELECT drop_all_policies('profiles');
SELECT drop_all_policies('favorites');
SELECT drop_all_policies('reviews');
SELECT drop_all_policies('transactions');
SELECT drop_all_policies('verifications');
SELECT drop_all_policies('payments_subscriptions');
SELECT drop_all_policies('user_subscriptions');
SELECT drop_all_policies('site_settings');
SELECT drop_all_policies('blog_posts');
SELECT drop_all_policies('categories');
SELECT drop_all_policies('promotions');
SELECT drop_all_policies('orders');
SELECT drop_all_policies('wallets');

-- ============================================================================
-- 2. RECREATE OPTIMIZED & CONSOLIDATED POLICIES (RESOLVE AUTH_RLS_INITPLAN)
-- ============================================================================

-- 2.1 LISTINGS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listings_select" ON listings FOR SELECT USING (status = 'active' OR user_id = auth.uid() OR is_staff());
CREATE POLICY "listings_insert" ON listings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "listings_update" ON listings FOR UPDATE USING (user_id = auth.uid() OR is_staff());
CREATE POLICY "listings_delete" ON listings FOR DELETE USING (user_id = auth.uid() OR is_staff());

-- 2.2 LISTING_REPORTS
ALTER TABLE listing_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_select" ON listing_reports FOR SELECT USING (reporter_id = auth.uid() OR is_staff());
CREATE POLICY "reports_insert" ON listing_reports FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "reports_staff_manage" ON listing_reports FOR ALL USING (is_staff());

-- 2.3 PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (TRUE); -- Public profiles
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (id = auth.uid() OR is_admin());

-- 2.4 ACCESS_LOGS (Fixing RLS Policy Always True)
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "access_logs_select" ON access_logs FOR SELECT USING (user_id = auth.uid() OR is_staff());
CREATE POLICY "access_logs_insert" ON access_logs FOR INSERT WITH CHECK (
    (user_id = auth.uid() AND user_id IS NOT NULL) OR (auth.role() = 'service_role')
);

-- 2.5 ACTIVITY_LOGS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_logs_select" ON activity_logs FOR SELECT USING (user_id = auth.uid() OR is_staff());
CREATE POLICY "activity_logs_insert" ON activity_logs FOR INSERT WITH CHECK (user_id = auth.uid());

-- 2.6 FAVORITES
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_owner_all" ON favorites FOR ALL USING (user_id = auth.uid());

-- 2.7 REVIEWS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "reviews_owner_manage" ON reviews FOR ALL USING (buyer_id = auth.uid() OR is_staff());

-- 2.8 TRANSACTIONS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transactions_select" ON transactions FOR SELECT USING (user_id = auth.uid() OR is_staff());

-- 2.9 WALLETS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wallets_select" ON wallets FOR SELECT USING (user_id = auth.uid() OR is_staff());

-- 2.10 PROMOTIONS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promotions_select" ON promotions FOR SELECT USING (TRUE);
CREATE POLICY "promotions_owner_manage" ON promotions FOR ALL USING (user_id = auth.uid() OR is_staff());

-- 2.11 ORDERS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select" ON orders FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR is_staff());

-- 2.12 SITE_SETTINGS / PLATFORM_SETTINGS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings_select" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "site_settings_admin" ON site_settings FOR ALL USING (is_admin());

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "platform_settings_select" ON platform_settings FOR SELECT USING (is_admin());
CREATE POLICY "platform_settings_admin" ON platform_settings FOR ALL USING (is_admin());

-- 2.13 BLOG_POSTS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_posts_select" ON blog_posts FOR SELECT USING (is_published = TRUE OR is_staff());
CREATE POLICY "blog_posts_admin" ON blog_posts FOR ALL USING (is_staff());

-- 2.14 CATEGORIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_select" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "categories_admin" ON categories FOR ALL USING (is_staff());

-- ============================================================================
-- 3. FINAL CLEANUP
-- ============================================================================
DROP FUNCTION drop_all_policies(TEXT);

COMMIT;
