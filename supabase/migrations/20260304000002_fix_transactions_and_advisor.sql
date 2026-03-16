-- ====================================================================================
-- MIGRATION: 20260304000002_fix_transactions_and_advisor.sql
-- DESCRIPTION: Fixes transactions schema and final RLS optimizations for Advisor.
-- ====================================================================================

BEGIN;

-- 1. FIX TRANSACTIONS SCHEMA
-- Adding missing columns that were missed by CREATE TABLE IF NOT EXISTS in previous migrations
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='description') THEN
        ALTER TABLE public.transactions ADD COLUMN description TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='wallet_id') THEN
        ALTER TABLE public.transactions ADD COLUMN wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE;
    END IF;

    -- user_id should exist, but let's be safe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='user_id') THEN
        ALTER TABLE public.transactions ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Populate wallet_id if it was just added and user_id exists
UPDATE public.transactions t
SET wallet_id = w.id
FROM public.wallets w
WHERE t.user_id = w.user_id AND t.wallet_id IS NULL;


-- 2. RE-DEPLOY SECURITY FUNCTIONS (optimized with initplan fix)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'moderator'
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role IN ('admin', 'moderator')
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 3. CONSOLIDATE MULTIPLE PERMISSIVE POLICIES (Advisor: multiple_permissive_policies)
-- We must ensure that for each table and action, there is ideally only ONE permissive policy.

-- LISTINGS
DROP POLICY IF EXISTS "Anyone can view listings" ON public.listings;
DROP POLICY IF EXISTS "Admins and moderators can manage all listings" ON public.listings;
DROP POLICY IF EXISTS "Users can insert own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can update own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON public.listings;

CREATE POLICY "View listings" ON public.listings
    FOR SELECT USING ( true );
CREATE POLICY "Manage listings" ON public.listings
    FOR ALL USING ( (SELECT is_staff()) )
    WITH CHECK ( (SELECT is_staff()) );
CREATE POLICY "Owner manage listings" ON public.listings
    FOR ALL USING ( user_id = (SELECT auth.uid()) )
    WITH CHECK ( user_id = (SELECT auth.uid()) );

-- LISTING REPORTS
DROP POLICY IF EXISTS "View listing reports" ON public.listing_reports;
DROP POLICY IF EXISTS "Users can create reports" ON public.listing_reports;
DROP POLICY IF EXISTS "Manage listing reports" ON public.listing_reports;
DROP POLICY IF EXISTS "Delete listing reports" ON public.listing_reports;
DROP POLICY IF EXISTS "Admins can manage all reports" ON public.listing_reports;

CREATE POLICY "Manage listing reports" ON public.listing_reports
    FOR ALL USING ( (SELECT is_staff()) );
CREATE POLICY "Owner reports" ON public.listing_reports
    FOR SELECT USING ( reporter_id = (SELECT auth.uid()) );
CREATE POLICY "Create reports" ON public.listing_reports
    FOR INSERT WITH CHECK ( reporter_id = (SELECT auth.uid()) );

-- TRANSACTIONS
DROP POLICY IF EXISTS "View transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users view own transactions" ON public.transactions;
CREATE POLICY "Access transactions" ON public.transactions
    FOR SELECT USING ( user_id = (SELECT auth.uid()) OR (SELECT is_admin()) );


-- 4. FINAL INITPLAN OPTIMIZATIONS (Advisor: auth_rls_initplan)
-- Ensure all policies use (SELECT auth.uid())

-- PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING ( true );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING ( id = (SELECT auth.uid()) OR (SELECT is_admin()) );

-- WALLETS
DROP POLICY IF EXISTS "Users view own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallets;
CREATE POLICY "View own wallet" ON public.wallets
    FOR SELECT USING ( user_id = (SELECT auth.uid()) OR (SELECT is_admin()) );


-- 5. FUNCTION SEARCH PATH HARDENING (Security)
ALTER FUNCTION public.promote_listing(uuid, varchar, integer, decimal) SET search_path = public;
ALTER FUNCTION public.purchase_listing(uuid, decimal, varchar) SET search_path = public;

COMMIT;
