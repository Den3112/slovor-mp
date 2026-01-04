-- Add quality signal columns to listings
-- For tracking contact interactions and complaints

-- Add contact_clicks column
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS contact_clicks INTEGER DEFAULT 0;

-- Add complaints_count column
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS complaints_count INTEGER DEFAULT 0;

-- Create function to increment contact clicks
CREATE OR REPLACE FUNCTION increment_contact_clicks(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.listings
  SET contact_clicks = contact_clicks + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment complaints count (called from triggers)
CREATE OR REPLACE FUNCTION increment_complaints_count(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.listings
  SET complaints_count = complaints_count + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users for contact clicks
GRANT EXECUTE ON FUNCTION increment_contact_clicks(UUID) TO authenticated;

-- Create index for ranking queries
CREATE INDEX IF NOT EXISTS idx_listings_contact_clicks ON public.listings(contact_clicks DESC);
CREATE INDEX IF NOT EXISTS idx_listings_complaints_count ON public.listings(complaints_count);
