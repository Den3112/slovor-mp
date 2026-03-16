-- ULTIMATE ADVISOR FIX MIGRATION v3
-- Target: 0 Performance Warnings & 0 Security Warnings
-- This version uses dynamic SQL to handle schema variations (column renames)

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

-- Helper to create policy only if column exists
CREATE OR REPLACE FUNCTION create_policy_safe(
    p_name TEXT,
    p_table TEXT,
    p_action TEXT,
    p_cols TEXT[],
    p_sql_template TEXT
) RETURNS VOID AS $$
DECLARE
    v_col TEXT;
    v_final_sql TEXT;
BEGIN
    FOREACH v_col IN ARRAY p_cols LOOP
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = p_table AND column_name = v_col) THEN
            v_final_sql := replace(p_sql_template, '{{COL}}', v_col);
            EXECUTE format('CREATE POLICY %I ON %I FOR %s %s', p_name, p_table, p_action, v_final_sql);
            RETURN;
        END IF;
    END LOOP;
    RAISE WARNING 'Could not create policy % on %: None of the columns % exist.', p_name, p_table, p_cols;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. CLEANUP
-- ----------------------------------------------------------------------------
SELECT drop_all_policies(t) FROM unnest(ARRAY[
  'listings', 'profiles', 'favorites', 'reviews', 'listing_reports', 'reports',
  'conversations', 'messages', 'verifications', 'access_logs',
  'activity_logs', 'transactions', 'wallets', 'promotions', 'orders',
  'site_settings', 'platform_settings', 'blog_posts', 'categories',
  'notifications', 'user_verifications', 'payments_subscriptions', 'user_subscriptions'
]) t;

-- ----------------------------------------------------------------------------
-- 3. APPLY POLICIES (InitPlan & Multi-Permissive optimized)
-- ----------------------------------------------------------------------------
DO $$
BEGIN
    -- LISTINGS
    ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
    PERFORM create_policy_safe('listings_v2_select', 'listings', 'SELECT', ARRAY['user_id', 'profile_id', 'owner_id'], 'USING (status = ''active'' OR {{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');
    PERFORM create_policy_safe('listings_v2_insert', 'listings', 'INSERT', ARRAY['user_id', 'profile_id', 'owner_id'], 'WITH CHECK ({{COL}} = (SELECT auth.uid()))');
    PERFORM create_policy_safe('listings_v2_update', 'listings', 'UPDATE', ARRAY['user_id', 'profile_id', 'owner_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');
    PERFORM create_policy_safe('listings_v2_delete', 'listings', 'DELETE', ARRAY['user_id', 'profile_id', 'owner_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');

    -- PROFILES
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    EXECUTE 'CREATE POLICY "profiles_v2_select" ON public.profiles FOR SELECT USING (TRUE)';
    EXECUTE 'CREATE POLICY "profiles_v2_update" ON public.profiles FOR UPDATE USING (id = (SELECT auth.uid()) OR (SELECT is_admin()))';

    -- CONVERSATIONS & MESSAGES
    ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
    EXECUTE 'CREATE POLICY "conversations_v2_all" ON public.conversations FOR ALL USING (buyer_id = (SELECT auth.uid()) OR seller_id = (SELECT auth.uid()) OR (SELECT is_staff()))';

    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
    PERFORM create_policy_safe('messages_v2_select', 'messages', 'SELECT', ARRAY['sender_id', 'user_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM conversations c WHERE c.id = conversation_id AND (c.buyer_id = (SELECT auth.uid()) OR c.seller_id = (SELECT auth.uid()))) OR (SELECT is_staff()))');
    PERFORM create_policy_safe('messages_v2_insert', 'messages', 'INSERT', ARRAY['sender_id', 'user_id'], 'WITH CHECK ({{COL}} = (SELECT auth.uid()))');

    -- FAVORITES
    ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
    PERFORM create_policy_safe('favorites_v2_all', 'favorites', 'ALL', ARRAY['user_id', 'profile_id', 'owner_id'], 'USING ({{COL}} = (SELECT auth.uid()))');

    -- REVIEWS
    ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
    EXECUTE 'CREATE POLICY "reviews_v2_select" ON public.reviews FOR SELECT USING (TRUE)';
    PERFORM create_policy_safe('reviews_v2_manage', 'reviews', 'ALL', ARRAY['author_id', 'user_id', 'buyer_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');

    -- VERIFICATIONS
    ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
    PERFORM create_policy_safe('verifications_v2_all', 'verifications', 'ALL', ARRAY['user_id', 'profile_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_verifications') THEN
        ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;
        PERFORM create_policy_safe('user_verifications_v2_all', 'user_verifications', 'ALL', ARRAY['user_id', 'profile_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');
    END IF;

    -- LOGS
    ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
    PERFORM create_policy_safe('access_logs_v2_insert', 'access_logs', 'INSERT', ARRAY['user_id', 'profile_id'], 'WITH CHECK ({{COL}} = (SELECT auth.uid()) AND {{COL}} IS NOT NULL)');
    PERFORM create_policy_safe('access_logs_v2_select', 'access_logs', 'SELECT', ARRAY['user_id', 'profile_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');

    ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
    PERFORM create_policy_safe('activity_logs_v2_all', 'activity_logs', 'ALL', ARRAY['user_id', 'profile_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');

    -- FINANCIAL
    ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
    PERFORM create_policy_safe('transactions_v2_select', 'transactions', 'SELECT', ARRAY['user_id', 'profile_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');

    ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
    PERFORM create_policy_safe('wallets_v2_select', 'wallets', 'SELECT', ARRAY['user_id', 'profile_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');

    -- REPORTS
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'listing_reports') THEN
        ALTER TABLE public.listing_reports ENABLE ROW LEVEL SECURITY;
        PERFORM create_policy_safe('reports_v2_select', 'listing_reports', 'SELECT', ARRAY['reporter_id', 'user_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');
        PERFORM create_policy_safe('reports_v2_insert', 'listing_reports', 'INSERT', ARRAY['reporter_id', 'user_id'], 'WITH CHECK ({{COL}} = (SELECT auth.uid()))');
        EXECUTE 'CREATE POLICY "reports_v2_manage" ON public.listing_reports FOR ALL USING ( (SELECT is_staff()) )';
    ELSIF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reports') THEN
        ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
        PERFORM create_policy_safe('reports_v2_select', 'reports', 'SELECT', ARRAY['reporter_id', 'user_id'], 'USING ({{COL}} = (SELECT auth.uid()) OR (SELECT is_staff()))');
        PERFORM create_policy_safe('reports_v2_insert', 'reports', 'INSERT', ARRAY['reporter_id', 'user_id'], 'WITH CHECK ({{COL}} = (SELECT auth.uid()))');
        EXECUTE 'CREATE POLICY "reports_v2_manage" ON public.reports FOR ALL USING ( (SELECT is_staff()) )';
    END IF;

    -- NOTIFICATIONS
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
        PERFORM create_policy_safe('notifications_v2_all', 'notifications', 'ALL', ARRAY['user_id', 'profile_id', 'recipient_id', 'recipient', 'owner_id'], 'USING ({{COL}} = (SELECT auth.uid()))');
    END IF;

    -- SYSTEM TABLES
    EXECUTE 'CREATE POLICY "site_settings_v2_select" ON public.site_settings FOR SELECT USING (TRUE)';
    EXECUTE 'CREATE POLICY "site_settings_v2_admin" ON public.site_settings FOR ALL USING ( (SELECT is_admin()) )';

    EXECUTE 'CREATE POLICY "blog_posts_v2_select" ON public.blog_posts FOR SELECT USING (is_published = TRUE OR (SELECT is_staff()))';
    EXECUTE 'CREATE POLICY "blog_posts_v2_admin" ON public.blog_posts FOR ALL USING ( (SELECT is_staff()) )';

    EXECUTE 'CREATE POLICY "categories_v2_select" ON public.categories FOR SELECT USING (TRUE)';
    EXECUTE 'CREATE POLICY "categories_v2_admin" ON public.categories FOR ALL USING ( (SELECT is_staff()) )';
END $$;

-- ----------------------------------------------------------------------------
-- 4. CLEANUP HELPERS
-- ----------------------------------------------------------------------------
DROP FUNCTION create_policy_safe(TEXT, TEXT, TEXT, TEXT[], TEXT);
DROP FUNCTION drop_all_policies(TEXT);

COMMIT;
