-- Add DELETE RLS policy for listings table
-- Allows users to delete their own listings

DO $$
BEGIN
    -- Enable RLS if not already enabled
    IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'listings'
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
    END IF;

    -- CREATE POLICY for DELETE
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'listings'
        AND policyname = 'Users can delete own listings'
    ) THEN
        CREATE POLICY "Users can delete own listings"
        ON public.listings FOR DELETE
        USING (auth.uid() = user_id);
    END IF;

    -- CREATE POLICY for UPDATE (if doesn't exist)
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'listings'
        AND policyname = 'Users can update own listings'
    ) THEN
        CREATE POLICY "Users can update own listings"
        ON public.listings FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- CREATE POLICY for INSERT (if doesn't exist)
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'listings'
        AND policyname = 'Authenticated users can create listings'
    ) THEN
        CREATE POLICY "Authenticated users can create listings"
        ON public.listings FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- CREATE POLICY for SELECT (if doesn't exist)
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'listings'
        AND policyname = 'Anyone can view published listings'
    ) THEN
        CREATE POLICY "Anyone can view published listings"
        ON public.listings FOR SELECT
        USING (true);
    END IF;
END
$$;
