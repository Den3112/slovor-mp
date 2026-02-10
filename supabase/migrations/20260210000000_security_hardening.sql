-- Security Hardening: Admin Moderation & RLS Optimization
-- Aligned with Phase 8 Security Audit

-- 1. LISTINGS Moderation
-- Allow admins and moderators to manage all listings (Approve, Reject, Delete)
CREATE POLICY "Admins and moderators can manage all listings" ON public.listings
    FOR ALL
    TO authenticated
    USING (
        (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) IN ('admin', 'moderator')
    );

-- 2. PROFILES Moderation
-- Allow admins to update profiles for banning or role management
CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (
        (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
    )
    WITH CHECK (
        (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- 3. REVIEWS Moderation
-- Allow admins to delete or update inappropriate reviews
CREATE POLICY "Admins can manage all reviews" ON public.reviews
    FOR ALL
    TO authenticated
    USING (
        (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) IN ('admin', 'moderator')
    );

-- 4. CATEGORIES Management (Redundancy check)
-- Ensure admins can manage categories (sometimes handled in specific migrations, but enforcing here)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'categories' AND policyname = 'Admins can manage categories'
    ) THEN
        CREATE POLICY "Admins can manage categories" ON public.categories
            FOR ALL
            TO authenticated
            USING ((SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin');
    END IF;
END $$;

-- 5. Optimization: Standardize (SELECT auth.uid()) for existing critical policies
-- This improves performance by ensuring the UID is only fetched once per query context.
-- We do not drop existing policies here to avoid downtime or security leaks,
-- but these new policies already follow the optimized pattern.
