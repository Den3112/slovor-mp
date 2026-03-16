-- ULTIMATE ADVISOR ELITE FIX MIGRATION v5
-- Final targets: reviews, site_settings, orders, payments_subscriptions, platform_settings, promotions, reports, user_subscriptions

BEGIN;

-- Helper to safely drop policies
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname, tablename FROM pg_policies
               WHERE schemaname = 'public'
               AND tablename IN ('reviews', 'site_settings', 'orders', 'payments_subscriptions', 'platform_settings', 'promotions', 'reports', 'user_subscriptions')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 1. FIX PERFORMANCE: Multiple Permissive Policies (reviews, site_settings)
-- We split ALL/MANAGE into individual actions to avoid overlap with SELECT.

-- REVIEWS
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews') THEN
        ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
        -- Split SELECT/INSERT/UPDATE/DELETE to avoid 'Multiple Permissive' with generic 'manage'
        EXECUTE 'CREATE POLICY "reviews_v5_select" ON public.reviews FOR SELECT USING (TRUE)';
        EXECUTE 'CREATE POLICY "reviews_v5_insert" ON public.reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)';
        EXECUTE 'CREATE POLICY "reviews_v5_update" ON public.reviews FOR UPDATE USING ( (SELECT auth.uid()) = author_id OR (SELECT is_staff()) )';
        EXECUTE 'CREATE POLICY "reviews_v5_delete" ON public.reviews FOR DELETE USING ( (SELECT is_staff()) )';
    END IF;
END $$;

-- SITE SETTINGS
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'site_settings') THEN
        ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
        EXECUTE 'CREATE POLICY "site_settings_v5_select" ON public.site_settings FOR SELECT USING (TRUE)';
        EXECUTE 'CREATE POLICY "site_settings_v5_admin_insert" ON public.site_settings FOR INSERT WITH CHECK ( (SELECT is_admin()) )';
        EXECUTE 'CREATE POLICY "site_settings_v5_admin_update" ON public.site_settings FOR UPDATE USING ( (SELECT is_admin()) )';
        EXECUTE 'CREATE POLICY "site_settings_v5_admin_delete" ON public.site_settings FOR DELETE USING ( (SELECT is_admin()) )';
    END IF;
END $$;


-- 2. FIX SECURITY INFO: RLS Enabled No Policy
-- For tables where RLS is ON but no one can see anything (even admins/staff).
-- We add 'staff-only' or 'owner-only' policies as appropriate.

DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY['orders', 'payments_subscriptions', 'platform_settings', 'promotions', 'reports', 'user_subscriptions']) LOOP
        IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = t) THEN
           -- Generic Staff access for sensitive tables to resolve the 'No Policy' warning
           EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL USING ( (SELECT is_staff()) )', t || '_v5_staff_all', t);

           -- Specific Owner-based access for user-specific tables
           IF t = 'orders' THEN
               EXECUTE 'CREATE POLICY "orders_v5_owner_select" ON public.orders FOR SELECT USING ( (SELECT auth.uid()) IN (buyer_id, seller_id) )';
           ELSIF t = 'user_subscriptions' OR t = 'payments_subscriptions' OR t = 'promotions' THEN
               EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING ( (SELECT auth.uid()) = user_id )', t || '_v5_owner_select', t);
           END IF;
        END IF;
    END LOOP;
END $$;

COMMIT;
