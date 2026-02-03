-- Create a wallet for a new profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_profile_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id, balance, currency)
  VALUES (new.id, 0.00, 'EUR')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_wallet ON public.profiles;
CREATE TRIGGER on_profile_created_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_wallet();

-- Also ensure all existing users have a wallet
INSERT INTO public.wallets (user_id, balance, currency)
SELECT id, 0.00, 'EUR'
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;
