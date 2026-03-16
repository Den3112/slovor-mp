-- ULTIMATE ADVISOR FIX MIGRATION v4
-- Target: 0 Performance Warnings & 0 Security Warnings
-- Fixes: "Multiple Permissive Policies" & remaining "Auth RLS Initplan"

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. HELPER FUNCTIONS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION drop_all_policies(t_name TEXT) RETURNS VOID AS $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = t_name AND schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, t_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. CLEANUP
-- ----------------------------------------------------------------------------
-- Drop policies for tables that still have issues
SELECT drop_all_policies(t) FROM unnest(ARRAY[
  'blog_posts', 'categories', 'listing_reports', 'admin_actions', 'static_pages', 'reports'
]) t;

-- ----------------------------------------------------------------------------
-- 3. APPLY POLICIES (InitPlan & Multi-Permissive optimized)
-- ----------------------------------------------------------------------------

DO $$
BEGIN

    -- REPORTS
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'listing_reports') THEN
        ALTER TABLE public.listing_reports ENABLE ROW LEVEL SECURITY;
        EXECUTE 'CREATE POLICY "reports_v4_manage_insert" ON public.listing_reports FOR INSERT WITH CHECK ( (SELECT is_staff()) )';
        EXECUTE 'CREATE POLICY "reports_v4_manage_update" ON public.listing_reports FOR UPDATE USING ( (SELECT is_staff()) )';
        EXECUTE 'CREATE POLICY "reports_v4_manage_delete" ON public.listing_reports FOR DELETE USING ( (SELECT is_staff()) )';
    ELSIF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reports') THEN
        ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
        EXECUTE 'CREATE POLICY "reports_v4_manage_insert" ON public.reports FOR INSERT WITH CHECK ( (SELECT is_staff()) )';
        EXECUTE 'CREATE POLICY "reports_v4_manage_update" ON public.reports FOR UPDATE USING ( (SELECT is_staff()) )';
        EXECUTE 'CREATE POLICY "reports_v4_manage_delete" ON public.reports FOR DELETE USING ( (SELECT is_staff()) )';
    END IF;

    -- SYSTEM TABLES
    EXECUTE 'CREATE POLICY "blog_posts_v4_select" ON public.blog_posts FOR SELECT USING (is_published = TRUE OR (SELECT is_staff()))';
    EXECUTE 'CREATE POLICY "blog_posts_v4_insert" ON public.blog_posts FOR INSERT WITH CHECK ( (SELECT is_staff()) )';
    EXECUTE 'CREATE POLICY "blog_posts_v4_update" ON public.blog_posts FOR UPDATE USING ( (SELECT is_staff()) )';
    EXECUTE 'CREATE POLICY "blog_posts_v4_delete" ON public.blog_posts FOR DELETE USING ( (SELECT is_staff()) )';

    EXECUTE 'CREATE POLICY "categories_v4_select" ON public.categories FOR SELECT USING (TRUE)';
    EXECUTE 'CREATE POLICY "categories_v4_insert" ON public.categories FOR INSERT WITH CHECK ( (SELECT is_staff()) )';
    EXECUTE 'CREATE POLICY "categories_v4_update" ON public.categories FOR UPDATE USING ( (SELECT is_staff()) )';
    EXECUTE 'CREATE POLICY "categories_v4_delete" ON public.categories FOR DELETE USING ( (SELECT is_staff()) )';

    -- MISSING INITPLAN FIXES
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_actions') THEN
        ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
        EXECUTE 'CREATE POLICY "admin_actions_v4_select" ON public.admin_actions FOR SELECT USING ( (SELECT is_admin()) )';
        EXECUTE 'CREATE POLICY "admin_actions_v4_insert" ON public.admin_actions FOR INSERT WITH CHECK ( (SELECT is_admin()) )';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'static_pages') THEN
        ALTER TABLE public.static_pages ENABLE ROW LEVEL SECURITY;
        EXECUTE 'CREATE POLICY "static_pages_v4_select" ON public.static_pages FOR SELECT USING (TRUE)';
        EXECUTE 'CREATE POLICY "static_pages_v4_insert" ON public.static_pages FOR INSERT WITH CHECK ( (SELECT is_admin()) )';
        EXECUTE 'CREATE POLICY "static_pages_v4_update" ON public.static_pages FOR UPDATE USING ( (SELECT is_admin()) )';
        EXECUTE 'CREATE POLICY "static_pages_v4_delete" ON public.static_pages FOR DELETE USING ( (SELECT is_admin()) )';
    END IF;

END $$;

-- ----------------------------------------------------------------------------
-- 4. CLEANUP HELPERS
-- ----------------------------------------------------------------------------
DROP FUNCTION drop_all_policies(TEXT);

COMMIT;
