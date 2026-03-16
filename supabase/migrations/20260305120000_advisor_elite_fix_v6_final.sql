-- FINAL ABSOLUTE ELITE RLS FIX v6.2 (REPORTS-SAFE)
-- Goal: 0 Performance Warnings, 0 Security Warnings

BEGIN;

-- 1. CLEANUP PREVIOUS POLICIES
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

-- 2. REVIEWS (Auth InitPlan Optimization)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews') THEN
        ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
        EXECUTE 'CREATE POLICY "reviews_v6_select" ON public.reviews FOR SELECT USING (TRUE)';
        EXECUTE 'CREATE POLICY "reviews_v6_insert" ON public.reviews FOR INSERT WITH CHECK ( (SELECT auth.uid()) IS NOT NULL )';
        EXECUTE 'CREATE POLICY "reviews_v6_update" ON public.reviews FOR UPDATE USING ( (SELECT auth.uid()) = author_id OR (SELECT is_staff()) )';
        EXECUTE 'CREATE POLICY "reviews_v6_delete" ON public.reviews FOR DELETE USING ( (SELECT is_staff()) )';
    END IF;
END $$;

-- 3. DYNAMIC TABLES (Orders, Subscriptions, Reports, etc.)
DO $$
DECLARE
    t TEXT;
    owner_clause TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY['orders', 'payments_subscriptions', 'promotions', 'reports', 'user_subscriptions']) LOOP
        IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = t) THEN

           -- Build dynamic owner clause
           owner_clause := 'FALSE';

           IF t = 'orders' THEN
               owner_clause := '( (SELECT auth.uid()) IN (buyer_id, seller_id) )';
           ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t AND column_name = 'user_id') THEN
               owner_clause := '( (SELECT auth.uid()) = user_id )';
           ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t AND column_name = 'reporter_id') THEN
               owner_clause := '( (SELECT auth.uid()) = reporter_id )';
           ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t AND column_name = 'author_id') THEN
               owner_clause := '( (SELECT auth.uid()) = author_id )';
           ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t AND column_name = 'profile_id') THEN
               owner_clause := '( (SELECT auth.uid()) = profile_id )';
           END IF;

           -- A. Combined SELECT Policy: Staff OR Owner
           EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING ( (SELECT is_staff()) OR %s )', t || '_v6_select', t, owner_clause);

           -- B. Atomic Write Policies (Staff Only)
           EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT WITH CHECK ( (SELECT is_staff()) )', t || '_v6_staff_insert', t);
           EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE USING ( (SELECT is_staff()) )', t || '_v6_staff_update', t);
           EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE USING ( (SELECT is_staff()) )', t || '_v6_staff_delete', t);
        END IF;
    END LOOP;
END $$;

-- 4. STATIC TABLES
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'platform_settings') THEN
        ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
        EXECUTE 'CREATE POLICY "platform_settings_v6_staff_all" ON public.platform_settings FOR ALL USING ( (SELECT is_staff()) )';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'site_settings') THEN
        ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
        EXECUTE 'CREATE POLICY "site_settings_v6_select" ON public.site_settings FOR SELECT USING (TRUE)';
        EXECUTE 'CREATE POLICY "site_settings_v6_admin_insert" ON public.site_settings FOR INSERT WITH CHECK ( (SELECT is_admin()) )';
        EXECUTE 'CREATE POLICY "site_settings_v6_admin_update" ON public.site_settings FOR UPDATE USING ( (SELECT is_admin()) )';
        EXECUTE 'CREATE POLICY "site_settings_v6_admin_delete" ON public.site_settings FOR DELETE USING ( (SELECT is_admin()) )';
    END IF;
END $$;

COMMIT;
