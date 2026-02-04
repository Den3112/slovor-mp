-- Migration: Transaction enhancements and Promotion Function
-- Aligned with Masterplan V2 Phase 2

-- 1. Add user_id to transactions for easier RLS and querying
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Update existing transactions user_id from wallet_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'user_id') THEN
        UPDATE transactions t
        SET user_id = w.user_id
        FROM wallets w
        WHERE t.wallet_id = w.id AND t.user_id IS NULL;
    END IF;
END $$;

-- 2. Create the promotion function (Atomic Transaction)
CREATE OR REPLACE FUNCTION promote_listing(
  p_listing_id UUID,
  p_promo_type VARCHAR,
  p_duration_days INTEGER,
  p_cost DECIMAL
) RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_wallet_id UUID;
  v_balance DECIMAL;
  v_caller_id UUID := auth.uid();
BEGIN
  -- 1. Get user_id from listing
  SELECT user_id INTO v_user_id FROM listings WHERE id = p_listing_id;

  -- 2. Validate ownership (Security)
  IF v_user_id IS NULL OR v_user_id != v_caller_id THEN
    RAISE EXCEPTION 'Not authorized to promote this listing or listing not found';
  END IF;

  -- 3. Get wallet info
  SELECT id, balance INTO v_wallet_id, v_balance FROM wallets WHERE user_id = v_user_id;

  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user';
  END IF;

  -- 4. Check balance
  IF v_balance < p_cost THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- 5. Subtract from wallet
  UPDATE wallets
  SET balance = balance - p_cost, updated_at = NOW()
  WHERE id = v_wallet_id;

  -- 6. Create transaction record
  INSERT INTO transactions (wallet_id, user_id, type, amount, currency, description, status)
  VALUES (v_wallet_id, v_user_id, 'promotion', p_cost, 'EUR', 'Promotion: ' || p_promo_type || ' (' || p_duration_days || ' days)', 'completed');

  -- 7. Create promotion record
  INSERT INTO promotions (listing_id, user_id, type, starts_at, ends_at, cost, status)
  VALUES (p_listing_id, v_user_id, p_promo_type, NOW(), NOW() + (p_duration_days || ' days')::INTERVAL, p_cost, 'active');

  -- 8. Update listing status
  UPDATE listings
  SET
    is_highlighted = CASE WHEN p_promo_type IN ('highlight', 'promotion_highlight') THEN TRUE ELSE is_highlighted END,
    is_promoted = TRUE,
    promoted_until = GREATEST(COALESCE(promoted_until, NOW()), NOW()) + (p_duration_days || ' days')::INTERVAL,
    updated_at = NOW()
  WHERE id = p_listing_id;

  -- 9. Log activity
  INSERT INTO activity_logs (user_id, action, metadata)
  VALUES (v_user_id, 'promotion_buy', jsonb_build_object('listing_id', p_listing_id, 'type', p_promo_type, 'cost', p_cost));

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
