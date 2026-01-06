ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'EUR';
