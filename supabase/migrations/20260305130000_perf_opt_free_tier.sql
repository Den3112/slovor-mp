-- Migration: 20260305130000_perf_opt_free_tier.sql
-- Description: Performance optimization for Free Tier (GIN indexes, JWT Claims hooks, Strict RLS).

-- 1. GIN Indexes for Text Search (API GET /listings Performance)
CREATE EXTENSION IF NOT EXISTS btree_gin;

CREATE INDEX IF NOT EXISTS idx_listings_title_search
ON public.listings USING GIN (to_tsvector('english', title));

-- Compound indexes for dashboard and api filtering
CREATE INDEX IF NOT EXISTS idx_listings_cat_status_price
ON public.listings (category_id, status, price);

CREATE INDEX IF NOT EXISTS idx_transactions_user_created
ON public.transactions (user_id, created_at DESC);

-- 2. Auth Hook (Custom JWT Claims) to eliminate Row-by-Row RLS evaluation
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
  DECLARE
    claims jsonb;
    user_role text;
  BEGIN
    -- Fetch the user role
    SELECT role INTO user_role FROM public.profiles WHERE id = (event->>'user_id')::uuid;

    claims := event->'claims';

    IF user_role IS NOT NULL THEN
      -- Inject role into JWT
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));

      -- Inject booleans for fast RLS checks
      IF user_role = 'admin' THEN
        claims := jsonb_set(claims, '{is_admin}', 'true');
        claims := jsonb_set(claims, '{is_staff}', 'true');
      ELSIF user_role = 'moderator' THEN
        claims := jsonb_set(claims, '{is_moderator}', 'true');
        claims := jsonb_set(claims, '{is_staff}', 'true');
      END IF;
    END IF;

    -- Update the 'claims' object
    event := jsonb_set(event, '{claims}', claims);
    RETURN event;
  END;
$$;

-- Grant permissions for Supabase Auth to execute the hook
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;

-- 3. Rewrite is_staff(), is_admin(), is_moderator() to read JWT claims first (O(1) execution)
CREATE OR REPLACE FUNCTION public.is_staff() RETURNS BOOLEAN AS $$
BEGIN
  -- Fast path: JWT Claim check (0.01ms)
  IF current_setting('request.jwt.claims', true)::jsonb ->> 'is_staff' = 'true' THEN
    RETURN TRUE;
  END IF;

  -- Slow path: Fallback for Service Role or old tokens (Seq Scan / Index Scan on profiles)
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
BEGIN
  -- Fast path: JWT Claim check
  IF current_setting('request.jwt.claims', true)::jsonb ->> 'is_admin' = 'true' THEN
    RETURN TRUE;
  END IF;

  -- Slow path
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_moderator() RETURNS BOOLEAN AS $$
BEGIN
  -- Fast path: JWT Claim check
  IF current_setting('request.jwt.claims', true)::jsonb ->> 'is_moderator' = 'true' THEN
    RETURN TRUE;
  END IF;

  -- Slow path
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'moderator'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Storage quota protection
-- Add restrictive policy to ensure only valid image extensions are uploaded to save Storage Quotas
-- This runs IN ADDITION to any existing permissive policies.
DO $$
BEGIN
  IF EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE schemaname = 'storage' AND tablename = 'objects'
    ) THEN

    -- Drop if exists to replace it safely
    DROP POLICY IF EXISTS "Restrict file extensions (Protection)" ON storage.objects;

    CREATE POLICY "Restrict file extensions (Protection)"
    ON storage.objects
    AS RESTRICTIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- Allow only typical image formats
        LOWER(substring(name from '\.([^\.]+)$')) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
    );
  END IF;
END $$;
