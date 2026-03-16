-- ====================================================================================
-- MIGRATION: 20260304000000_resolve_advisor_warnings.sql
-- DESCRIPTION: High-performance optimization and security hardening.
-- Resolves Supabase Advisor warnings: auth_rls_initplan, multiple_permissive_policies,
-- duplicate_index, unused_index, unindexed_foreign_keys, and disabled RLS.
-- ====================================================================================

BEGIN;

-- ------------------------------------------------------------------------------------
-- 1. DROP UNUSED & DUPLICATE INDEXES
-- ------------------------------------------------------------------------------------
-- Duplicate
DROP INDEX IF EXISTS public.idx_transactions_user;

-- Unused Performance Drains
DROP INDEX IF EXISTS public.idx_listings_title_en;
DROP INDEX IF EXISTS public.idx_listings_title_sk;
DROP INDEX IF EXISTS public.idx_listings_contact_clicks;
DROP INDEX IF EXISTS public.idx_listings_complaints_count;
DROP INDEX IF EXISTS public.idx_listings_is_featured;
DROP INDEX IF EXISTS public.idx_messages_created_at;
DROP INDEX IF EXISTS public.idx_transactions_wallet_id;
DROP INDEX IF EXISTS public.idx_promotions_listing_id;
DROP INDEX IF EXISTS public.idx_orders_listing_id;
DROP INDEX IF EXISTS public.idx_admin_actions_target;
DROP INDEX IF EXISTS public.idx_user_verifications_status;
DROP INDEX IF EXISTS public.idx_payments_user_id;
DROP INDEX IF EXISTS public.idx_payments_status;
DROP INDEX IF EXISTS public.idx_notifications_is_read;
DROP INDEX IF EXISTS public.idx_notifications_created_at;

-- ------------------------------------------------------------------------------------
-- 2. CREATE COVERING INDEXES FOR FOREIGN KEYS
-- ------------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON public.access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_listing_reports_listing_id ON public.listing_reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_reports_reported_user_id ON public.listing_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_listing_reports_reporter_id ON public.listing_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_listing_reports_resolved_by ON public.listing_reports(resolved_by);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_promotions_user_id ON public.promotions(user_id);
-- Note: saved_searches might not exist depending on schema version, adding IF EXISTS logically (indexes don't have this, so create if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'saved_searches') THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_saved_searches_category_id ON public.saved_searches(category_id)';
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'saved_listings') THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_saved_listings_listing_id ON public.saved_listings(listing_id)';
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_subscriptions') THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id)';
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_verifications_reviewed_by ON public.verifications(reviewed_by);


-- ------------------------------------------------------------------------------------
-- 3. ENABLE RLS ON MISSING TABLES
-- ------------------------------------------------------------------------------------
-- user_verifications
ALTER TABLE IF EXISTS public.user_verifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own verifications_new" ON public.user_verifications;
DROP POLICY IF EXISTS "Admins can manage all verifications_new" ON public.user_verifications;

CREATE POLICY "Users can view own verifications_new" ON public.user_verifications
    FOR SELECT USING ( user_id = (SELECT auth.uid()) );
CREATE POLICY "Admins can manage all verifications_new" ON public.user_verifications
    USING ( (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );

-- payments_subscriptions
ALTER TABLE IF EXISTS public.payments_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.payments_subscriptions;
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.payments_subscriptions;

CREATE POLICY "Users can view own subscriptions" ON public.payments_subscriptions
    FOR SELECT USING ( user_id = (SELECT auth.uid()) );
CREATE POLICY "Admins can manage all subscriptions" ON public.payments_subscriptions
    USING ( (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );

-- site_settings
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site_settings" ON public.site_settings;

CREATE POLICY "Anyone can view site_settings" ON public.site_settings
    FOR SELECT USING ( true );
CREATE POLICY "Admins can manage site_settings" ON public.site_settings
    USING ( (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );


-- ------------------------------------------------------------------------------------
-- 4. FIX RLS POLICIES (INITPLAN & MULTIPLE PERMISSIVE & ALWAYS TRUE)
-- ------------------------------------------------------------------------------------

-- CONSOLIDATED POLICY HELPER COMPONENT:
-- We'll replace matching separate read policies with unified ones where appropriate.
-- For write operations, we keep them secured.

-- ACTIVITY LOGS (Consolidated + initplan)
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.activity_logs;
CREATE POLICY "View activity logs" ON public.activity_logs
    FOR SELECT USING (
        user_id = (SELECT auth.uid()) OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
    );

DROP POLICY IF EXISTS "Users can insert own activity logs" ON public.activity_logs;
CREATE POLICY "Users can insert own activity logs" ON public.activity_logs
    FOR INSERT WITH CHECK ( user_id = (SELECT auth.uid()) );


-- BLOG POSTS (Consolidated)
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can view all blog posts" ON public.blog_posts;
CREATE POLICY "View blog posts" ON public.blog_posts
    FOR SELECT USING (
        is_published = true OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
    );

DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Manage blog posts" ON public.blog_posts
    USING ( (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );


-- CATEGORIES (Consolidated)
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories
    FOR SELECT USING ( true );

DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Manage categories" ON public.categories
    USING ( (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );


-- LISTING REPORTS (Consolidated + initplan)
DROP POLICY IF EXISTS "Users can view own reports" ON public.listing_reports;
DROP POLICY IF EXISTS "Admins can manage all reports" ON public.listing_reports;
DROP POLICY IF EXISTS "Admins can view and manage reports" ON public.listing_reports;
CREATE POLICY "View listing reports" ON public.listing_reports
    FOR SELECT USING (
        reporter_id = (SELECT auth.uid()) OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
    );

DROP POLICY IF EXISTS "Users can create reports" ON public.listing_reports;
CREATE POLICY "Users can create reports" ON public.listing_reports
    FOR INSERT WITH CHECK ( reporter_id = (SELECT auth.uid()) );

CREATE POLICY "Manage listing reports" ON public.listing_reports
    FOR UPDATE USING ( (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );
CREATE POLICY "Delete listing reports" ON public.listing_reports
    FOR DELETE USING ( (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );


-- LISTINGS
-- Fixing initplans on listsings where applicable.
DROP POLICY IF EXISTS "Users can insert own listings" ON public.listings;
CREATE POLICY "Users can insert own listings" ON public.listings
    FOR INSERT WITH CHECK ( user_id = (SELECT auth.uid()) );

DROP POLICY IF EXISTS "Users can update own listings" ON public.listings;
CREATE POLICY "Users can update own listings" ON public.listings
    FOR UPDATE USING ( user_id = (SELECT auth.uid()) OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );

DROP POLICY IF EXISTS "Users can delete own listings" ON public.listings;
CREATE POLICY "Users can delete own listings" ON public.listings
    FOR DELETE USING ( user_id = (SELECT auth.uid()) OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );

DROP POLICY IF EXISTS "Admins and moderators can manage all listings" ON public.listings;
-- (Covered by merged policies above for UPDATE/DELETE, SELECT is public usually)


-- TRANSACTIONS (Consolidated + initplan)
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view own transactions_direct" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
CREATE POLICY "View transactions" ON public.transactions
    FOR SELECT USING (
        user_id = (SELECT auth.uid()) OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
    );


-- VERIFICATIONS (Consolidated + initplan)
DROP POLICY IF EXISTS "Users can view own verifications" ON public.verifications;
DROP POLICY IF EXISTS "Admins can view and manage all verifications" ON public.verifications;
CREATE POLICY "View verifications" ON public.verifications
    FOR SELECT USING (
        user_id = (SELECT auth.uid()) OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
    );
CREATE POLICY "Manage verifications" ON public.verifications
    USING ( (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );


-- ACCESS LOGS (Always True Fix)
DROP POLICY IF EXISTS "Insert access logs" ON public.access_logs;
DROP POLICY IF EXISTS "View access logs" ON public.access_logs;
-- Recreate with tighter scope
CREATE POLICY "Insert access logs" ON public.access_logs
    FOR INSERT WITH CHECK ( user_id = (SELECT auth.uid()) OR user_id IS NULL );
CREATE POLICY "View access logs" ON public.access_logs
    FOR SELECT USING (
        user_id = (SELECT auth.uid()) OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
    );


-- NOTIFICATIONS (Always True Fix + initplan)
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

CREATE POLICY "View notifications" ON public.notifications
    FOR SELECT USING ( user_id = (SELECT auth.uid()) );
CREATE POLICY "Update notifications" ON public.notifications
    FOR UPDATE USING ( user_id = (SELECT auth.uid()) );
CREATE POLICY "Delete notifications" ON public.notifications
    FOR DELETE USING ( user_id = (SELECT auth.uid()) );


-- SAVED LISTINGS (Missing policies)
ALTER TABLE IF EXISTS public.saved_listings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Manage own saved listings" ON public.saved_listings;
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'saved_listings') THEN
        EXECUTE 'CREATE POLICY "Manage own saved listings" ON public.saved_listings USING ( user_id = (SELECT auth.uid()) )';
    END IF;
END $$;


-- USER SUBSCRIPTIONS (Missing policies)
ALTER TABLE IF EXISTS public.user_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Manage own user subscriptions" ON public.user_subscriptions;
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_subscriptions') THEN
        EXECUTE 'CREATE POLICY "View own user subscriptions" ON public.user_subscriptions FOR SELECT USING ( user_id = (SELECT auth.uid()) )';
        EXECUTE 'CREATE POLICY "Admins manage user subscriptions" ON public.user_subscriptions USING ( (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = ''admin'' )';
    END IF;
END $$;


-- WALLETS (initplan)
DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallets;
CREATE POLICY "Users can view own wallet" ON public.wallets
    FOR SELECT USING ( user_id = (SELECT auth.uid()) );


-- PROFILES (initplan)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING ( id = (SELECT auth.uid()) OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;


-- SAVED SEARCHES (initplan)
DROP POLICY IF EXISTS "Users can view own saved searches" ON public.saved_searches;
DROP POLICY IF EXISTS "Users can create own saved searches" ON public.saved_searches;
DROP POLICY IF EXISTS "Users can update own saved searches" ON public.saved_searches;
DROP POLICY IF EXISTS "Users can delete own saved searches" ON public.saved_searches;

CREATE POLICY "Manage saved searches" ON public.saved_searches
    USING ( user_id = (SELECT auth.uid()) );


-- REVIEWS (initplan)
DROP POLICY IF EXISTS "Recipient can update own reviews with replies" ON public.reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
CREATE POLICY "Recipient can update own reviews with replies" ON public.reviews
    FOR UPDATE USING ( listing_id IN (SELECT id FROM public.listings WHERE user_id = (SELECT auth.uid())) );
CREATE POLICY "Admins can manage all reviews" ON public.reviews
    USING ( (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );


-- ORDERS (initplan)
DROP POLICY IF EXISTS "Users can view their own orders (as buyer or seller)" ON public.orders;
CREATE POLICY "View own orders" ON public.orders
    FOR SELECT USING ( buyer_id = (SELECT auth.uid()) OR seller_id = (SELECT auth.uid()) OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );


-- ------------------------------------------------------------------------------------
-- 5. FUNCTION SEARCH PATH HARDENING
-- ------------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_updated_at') THEN
        EXECUTE 'ALTER FUNCTION public.handle_updated_at() SET search_path = public';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
        EXECUTE 'ALTER FUNCTION public.handle_new_user() SET search_path = public';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_complaints_count') THEN
        EXECUTE 'ALTER FUNCTION public.increment_complaints_count(uuid) SET search_path = public';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_contact_clicks') THEN
        EXECUTE 'ALTER FUNCTION public.increment_contact_clicks(uuid) SET search_path = public';
    END IF;
END $$;

COMMIT;
