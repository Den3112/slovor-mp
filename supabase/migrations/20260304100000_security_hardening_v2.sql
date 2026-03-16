-- SECURITY & PERFORMANCE HARDENING MIGRATION
-- Fixes critical issues identified in security audit (2026-03-04)
-- Version: 1.0

-- ============================================================================
-- 1. FIX RACE CONDITIONS IN FINANCIAL FUNCTIONS (CRITICAL)
-- ============================================================================

-- 1a. Recreate promote_listing with FOR UPDATE lock and input validation
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
  -- Input validation (prevent negative amounts)
  IF p_cost <= 0 THEN
    RAISE EXCEPTION 'Invalid cost: must be positive';
  END IF;
  IF p_duration_days <= 0 OR p_duration_days > 365 THEN
    RAISE EXCEPTION 'Invalid duration: must be between 1 and 365 days';
  END IF;
  IF p_promo_type IS NULL OR length(trim(p_promo_type)) = 0 THEN
    RAISE EXCEPTION 'Invalid promotion type';
  END IF;

  -- Verify listing ownership
  SELECT user_id INTO v_user_id FROM listings WHERE id = p_listing_id;
  IF v_user_id IS NULL OR v_user_id != v_caller_id THEN
    RAISE EXCEPTION 'Not authorized to promote this listing or listing not found';
  END IF;

  -- Lock wallet row to prevent race conditions (FOR UPDATE)
  SELECT id, balance INTO v_wallet_id, v_balance
  FROM wallets WHERE user_id = v_user_id FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user';
  END IF;
  IF v_balance < p_cost THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Deduct balance
  UPDATE wallets SET balance = balance - p_cost, updated_at = NOW() WHERE id = v_wallet_id;

  -- Record transaction
  INSERT INTO transactions (wallet_id, user_id, type, amount, currency, description, status)
  VALUES (v_wallet_id, v_user_id, 'promotion', p_cost, 'EUR',
    'Promotion: ' || p_promo_type || ' (' || p_duration_days || ' days)', 'completed');

  -- Create promotion
  INSERT INTO promotions (listing_id, user_id, type, starts_at, ends_at, cost, status)
  VALUES (p_listing_id, v_user_id, p_promo_type, NOW(),
    NOW() + (p_duration_days || ' days')::INTERVAL, p_cost, 'active');

  -- Update listing promotion status
  UPDATE listings SET
    is_promoted = TRUE,
    promoted_until = GREATEST(COALESCE(promoted_until, NOW()), NOW()) + (p_duration_days || ' days')::INTERVAL,
    updated_at = NOW()
  WHERE id = p_listing_id;

  -- Activity log
  INSERT INTO activity_logs (user_id, action, metadata)
  VALUES (v_user_id, 'promotion_buy',
    jsonb_build_object('listing_id', p_listing_id, 'type', p_promo_type, 'cost', p_cost));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 1b. Recreate purchase_listing with FOR UPDATE locks and input validation
CREATE OR REPLACE FUNCTION purchase_listing(
  p_listing_id UUID,
  p_amount DECIMAL,
  p_payment_method VARCHAR DEFAULT 'wallet'
) RETURNS UUID AS $$
DECLARE
  v_seller_id UUID;
  v_buyer_id UUID := auth.uid();
  v_buyer_wallet_id UUID;
  v_buyer_balance DECIMAL;
  v_seller_wallet_id UUID;
  v_order_id UUID;
BEGIN
  -- Input validation
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid purchase amount: must be positive';
  END IF;

  -- Lock listing to prevent concurrent purchases
  SELECT user_id INTO v_seller_id
  FROM listings WHERE id = p_listing_id AND status = 'active' FOR UPDATE;

  IF v_seller_id IS NULL THEN
    RAISE EXCEPTION 'Listing not found or not active';
  END IF;
  IF v_seller_id = v_buyer_id THEN
    RAISE EXCEPTION 'You cannot buy your own listing';
  END IF;

  -- Lock buyer wallet
  SELECT id, balance INTO v_buyer_wallet_id, v_buyer_balance
  FROM wallets WHERE user_id = v_buyer_id FOR UPDATE;

  IF v_buyer_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Buyer wallet not found.';
  END IF;
  IF v_buyer_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Lock seller wallet (ensure it exists)
  SELECT id INTO v_seller_wallet_id
  FROM wallets WHERE user_id = v_seller_id FOR UPDATE;

  IF v_seller_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Seller wallet not found';
  END IF;

  -- Create order
  INSERT INTO orders (buyer_id, seller_id, listing_id, amount, currency, status, payment_method)
  VALUES (v_buyer_id, v_seller_id, p_listing_id, p_amount, 'EUR', 'completed', p_payment_method)
  RETURNING id INTO v_order_id;

  -- Deduct from buyer
  UPDATE wallets SET balance = balance - p_amount, updated_at = NOW() WHERE id = v_buyer_wallet_id;
  INSERT INTO transactions (wallet_id, user_id, type, amount, currency, description, status, metadata)
  VALUES (v_buyer_wallet_id, v_buyer_id, 'purchase', -p_amount, 'EUR',
    'Purchase: Listing #' || p_listing_id, 'completed', jsonb_build_object('order_id', v_order_id));

  -- Credit to seller
  UPDATE wallets SET balance = balance + p_amount, updated_at = NOW() WHERE id = v_seller_wallet_id;
  INSERT INTO transactions (wallet_id, user_id, type, amount, currency, description, status, metadata)
  VALUES (v_seller_wallet_id, v_seller_id, 'payout', p_amount, 'EUR',
    'Sale: Listing #' || p_listing_id, 'completed', jsonb_build_object('order_id', v_order_id));

  -- Mark listing as sold
  UPDATE listings SET status = 'sold', updated_at = NOW() WHERE id = p_listing_id;

  -- Activity log
  INSERT INTO activity_logs (user_id, action, metadata)
  VALUES (v_buyer_id, 'listing_purchase',
    jsonb_build_object('order_id', v_order_id, 'listing_id', p_listing_id, 'amount', p_amount));

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 2. FIX RLS POLICIES (CRITICAL + HIGH)
-- ============================================================================

-- 2a. platform_settings: restrict write access to admins only
DROP POLICY IF EXISTS "Admins manage platform settings" ON platform_settings;
CREATE POLICY "Admins manage platform settings" ON platform_settings
  FOR ALL USING (is_admin());

-- 2b. access_logs: prevent anonymous inserts (DoS vector)
DROP POLICY IF EXISTS "Insert access logs" ON access_logs;
CREATE POLICY "Insert access logs" ON access_logs
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()) AND user_id IS NOT NULL);

-- 2c. wallets: prevent direct wallet creation (only via trigger)
DROP POLICY IF EXISTS "Deny direct wallet insert" ON wallets;
CREATE POLICY "Deny direct wallet insert" ON wallets
  FOR INSERT WITH CHECK (FALSE);

-- 2d. Fix overlapping permissive policies on listings
-- Drop the narrower one and keep the broader staff policy
DROP POLICY IF EXISTS "Users can update own listings" ON listings;

-- Recreate clean policy: users can update their OWN listings
DROP POLICY IF EXISTS "Users update own listings" ON listings;
CREATE POLICY "Users update own listings" ON listings
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- 3. ADD CHECK CONSTRAINTS FOR DATA INTEGRITY (MEDIUM)
-- ============================================================================

-- 3a. Orders status constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_status'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT chk_orders_status
      CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded'));
  END IF;
END $$;

-- 3b. Transactions type constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_transactions_type'
  ) THEN
    ALTER TABLE transactions ADD CONSTRAINT chk_transactions_type
      CHECK (type IN ('deposit', 'withdrawal', 'purchase', 'payout', 'promotion', 'refund'));
  END IF;
END $$;

-- 3c. Reports status constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_reports_status'
  ) THEN
    ALTER TABLE reports ADD CONSTRAINT chk_reports_status
      CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed'));
  END IF;
END $$;

-- 3d. Promotions status constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_promotions_status'
  ) THEN
    ALTER TABLE promotions ADD CONSTRAINT chk_promotions_status
      CHECK (status IN ('active', 'expired', 'cancelled'));
  END IF;
END $$;

-- 3e. Wallet balance non-negative constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_wallets_balance_positive'
  ) THEN
    ALTER TABLE wallets ADD CONSTRAINT chk_wallets_balance_positive
      CHECK (balance >= 0);
  END IF;
END $$;

-- ============================================================================
-- 4. ADD MISSING INDEXES FOR PERFORMANCE (HIGH)
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_buyer_status ON orders(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_seller_status ON orders(seller_id, status);

-- Restore FK indexes dropped in previous migration
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_promotions_listing_id ON promotions(listing_id);
CREATE INDEX IF NOT EXISTS idx_orders_listing_id ON orders(listing_id);

-- ============================================================================
-- 5. ADD updated_at TRIGGER FUNCTION (MEDIUM)
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply to tables with updated_at column
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at'
      AND table_schema = 'public'
      AND table_name NOT IN ('platform_settings')
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I; CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION handle_updated_at();',
      tbl, tbl
    );
  END LOOP;
END $$;

-- ============================================================================
-- 6. FIX SECURITY DEFINER FUNCTIONS (HIGH)
-- ============================================================================

-- Update is_admin, is_moderator, is_staff with SET search_path
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION is_moderator() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = (SELECT auth.uid()) AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION is_staff() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = (SELECT auth.uid()) AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 7. ADD NOT NULL CONSTRAINT ON transactions.wallet_id (if missing)
-- ============================================================================
DO $$
BEGIN
  -- Only add if column exists and is nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions'
      AND column_name = 'wallet_id'
      AND is_nullable = 'YES'
      AND table_schema = 'public'
  ) THEN
    -- First update any NULL values (shouldn't exist but safety)
    UPDATE transactions SET wallet_id = (
      SELECT id FROM wallets WHERE wallets.user_id = transactions.user_id LIMIT 1
    ) WHERE wallet_id IS NULL;

    -- Then add NOT NULL
    ALTER TABLE transactions ALTER COLUMN wallet_id SET NOT NULL;
  END IF;
END $$;
