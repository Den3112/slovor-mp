-- ====================================================================================
-- MIGRATION: 20260304000001_fix_rls_recursion_and_roles.sql
-- DESCRIPTION: Fixes RLS recursion in profiles and restores moderator access.
-- ====================================================================================

BEGIN;

-- 1. CREATE SECURITY DEFINER FUNCTIONS for role checks
-- This avoids RLS recursion when checking roles from within a profile policy.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'moderator'
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role IN ('admin', 'moderator')
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 2. FIX PROFILES POLICIES (Recursion Fix)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING ( id = auth.uid() OR is_admin() );

-- Ensure profiles are viewable (usually public, but let's be explicit if needed)
-- We don't want to break existing SELECT policy if it was working.
-- If the problem was in SELECT, we'll know if we had one.


-- 3. RESTORE MODERATOR ACCESS & OPTIMIZE (Using staff functions)

-- ACTIVITY LOGS
DROP POLICY IF EXISTS "View activity logs" ON public.activity_logs;
CREATE POLICY "View activity logs" ON public.activity_logs
    FOR SELECT USING ( user_id = auth.uid() OR is_staff() );

-- BLOG POSTS
DROP POLICY IF EXISTS "View blog posts" ON public.blog_posts;
CREATE POLICY "View blog posts" ON public.blog_posts
    FOR SELECT USING ( is_published = true OR is_staff() );

DROP POLICY IF EXISTS "Manage blog posts" ON public.blog_posts;
CREATE POLICY "Manage blog posts" ON public.blog_posts
    USING ( is_admin() ); -- Strictly admin for blog management? Usually yes.

-- CATEGORIES
DROP POLICY IF EXISTS "Manage categories" ON public.categories;
CREATE POLICY "Manage categories" ON public.categories
    USING ( is_admin() );

-- LISTING REPORTS
DROP POLICY IF EXISTS "View listing reports" ON public.listing_reports;
CREATE POLICY "View listing reports" ON public.listing_reports
    FOR SELECT USING ( reporter_id = auth.uid() OR is_staff() );

DROP POLICY IF EXISTS "Manage listing reports" ON public.listing_reports;
CREATE POLICY "Manage listing reports" ON public.listing_reports
    FOR UPDATE USING ( is_staff() );
DROP POLICY IF EXISTS "Delete listing reports" ON public.listing_reports;
CREATE POLICY "Delete listing reports" ON public.listing_reports
    FOR DELETE USING ( is_admin() );

-- LISTINGS
DROP POLICY IF EXISTS "Users can update own listings" ON public.listings;
CREATE POLICY "Users can update own listings" ON public.listings
    FOR UPDATE USING ( user_id = auth.uid() OR is_staff() );

DROP POLICY IF EXISTS "Users can delete own listings" ON public.listings;
CREATE POLICY "Users can delete own listings" ON public.listings
    FOR DELETE USING ( user_id = auth.uid() OR is_staff() );

DROP POLICY IF EXISTS "Admins and moderators can manage all listings" ON public.listings;
CREATE POLICY "Admins and moderators can manage all listings" ON public.listings
    FOR ALL USING ( is_staff() );


-- TRANSACTIONS
DROP POLICY IF EXISTS "View transactions" ON public.transactions;
CREATE POLICY "View transactions" ON public.transactions
    FOR SELECT USING ( user_id = auth.uid() OR is_admin() );


-- VERIFICATIONS
DROP POLICY IF EXISTS "View verifications" ON public.verifications;
CREATE POLICY "View verifications" ON public.verifications
    FOR SELECT USING ( user_id = auth.uid() OR is_staff() );

DROP POLICY IF EXISTS "Manage verifications" ON public.verifications;
CREATE POLICY "Manage verifications" ON public.verifications
    USING ( is_staff() );


-- ACCESS LOGS
DROP POLICY IF EXISTS "View access logs" ON public.access_logs;
CREATE POLICY "View access logs" ON public.access_logs
    FOR SELECT USING ( user_id = auth.uid() OR is_admin() );


-- USER VERIFICATIONS (The new missing ones)
DROP POLICY IF EXISTS "Users can view own verifications_new" ON public.user_verifications;
CREATE POLICY "Users can view own verifications_new" ON public.user_verifications
    FOR SELECT USING ( user_id = auth.uid() OR is_staff() );

DROP POLICY IF EXISTS "Admins can manage all verifications_new" ON public.user_verifications;
CREATE POLICY "Admins can manage all verifications_new" ON public.user_verifications
    USING ( is_staff() );


-- REVIEWS
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
CREATE POLICY "Admins can manage all reviews" ON public.reviews
    USING ( is_staff() );


-- ORDERS
DROP POLICY IF EXISTS "View own orders" ON public.orders;
CREATE POLICY "View own orders" ON public.orders
    FOR SELECT USING ( buyer_id = auth.uid() OR seller_id = auth.uid() OR is_staff() );

COMMIT;
