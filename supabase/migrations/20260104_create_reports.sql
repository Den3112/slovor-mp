-- Reports Table
-- Stores user/listing reports for moderation

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'fraud', 'counterfeit', 'prohibited', 'duplicate', 'other')),
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Must report either a listing or a user
  CONSTRAINT report_target_check CHECK (
    (reported_listing_id IS NOT NULL) OR (reported_user_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_listing_id ON public.reports(reported_listing_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON public.reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- RLS Policies
-- Users can create reports
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create reports' AND tablename = 'reports') THEN
  CREATE POLICY "Users can create reports"
    ON public.reports
    FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);
END IF;
END $$;

-- Users can view their own reports
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own reports' AND tablename = 'reports') THEN
  CREATE POLICY "Users can view own reports"
    ON public.reports
    FOR SELECT
    USING (auth.uid() = reporter_id);
END IF;
END $$;

-- Note: Moderator access should be handled via service role key or separate admin policies
