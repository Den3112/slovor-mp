-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Unique constraint to prevent duplicate favorites
  UNIQUE(user_id, listing_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON public.favorites(listing_id);

-- RLS Policies
-- Users can view their own favorites
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own favorites' AND tablename = 'favorites') THEN
  CREATE POLICY "Users can view own favorites"
    ON public.favorites
    FOR SELECT
    USING (auth.uid() = user_id);
END IF;
END $$;

-- Users can add favorites
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can add favorites' AND tablename = 'favorites') THEN
  CREATE POLICY "Users can add favorites"
    ON public.favorites
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
END IF;
END $$;

-- Users can remove their own favorites
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own favorites' AND tablename = 'favorites') THEN
  CREATE POLICY "Users can delete own favorites"
    ON public.favorites
    FOR DELETE
    USING (auth.uid() = user_id);
END IF;
END $$;
