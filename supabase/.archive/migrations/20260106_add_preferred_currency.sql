-- Add preferred_currency column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'EUR';

-- Update RLS if necessary (usually not needed for new columns unless specific policies exist)
-- The existing 'Public profiles are viewable by everyone' policy covers new columns automatically.
