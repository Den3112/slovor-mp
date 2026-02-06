-- MASTER INITIALIZATION & SECURITY SCRIPT
-- Consolidated for Masterplan V2 Phase 6
-- Version 1.2: Added explicit column checks

-- 1. BASE TABLES
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'EUR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure wallet_id exists if the table was created differently before
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='wallet_id') THEN
        ALTER TABLE transactions ADD COLUMN wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(30) NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type VARCHAR(20) DEFAULT 'free',
  status VARCHAR(20) DEFAULT 'active',
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES profiles(id) NOT NULL,
    seller_id UUID REFERENCES profiles(id) NOT NULL,
    listing_id UUID REFERENCES listings(id) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id),
    target_id UUID NOT NULL,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('listing', 'user', 'review')),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('approve', 'reject', 'ban', 'verify')),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type VARCHAR(30) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  document_url TEXT,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. INDICES
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_promotions_listing_id ON promotions(listing_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_listing_id ON orders(listing_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON admin_actions(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON verifications(user_id);

-- 3. FUNCTIONS
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
  SELECT user_id INTO v_user_id FROM listings WHERE id = p_listing_id;
  IF v_user_id IS NULL OR v_user_id != v_caller_id THEN
    RAISE EXCEPTION 'Not authorized to promote this listing or listing not found';
  END IF;
  SELECT id, balance INTO v_wallet_id, v_balance FROM wallets WHERE user_id = v_user_id;
  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user';
  END IF;
  IF v_balance < p_cost THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  UPDATE wallets SET balance = balance - p_cost, updated_at = NOW() WHERE id = v_wallet_id;
  INSERT INTO transactions (wallet_id, user_id, type, amount, currency, description, status)
  VALUES (v_wallet_id, v_user_id, 'promotion', p_cost, 'EUR', 'Promotion: ' || p_promo_type || ' (' || p_duration_days || ' days)', 'completed');
  INSERT INTO promotions (listing_id, user_id, type, starts_at, ends_at, cost, status)
  VALUES (p_listing_id, v_user_id, p_promo_type, NOW(), NOW() + (p_duration_days || ' days')::INTERVAL, p_cost, 'active');
  UPDATE listings SET
    is_promoted = TRUE,
    promoted_until = GREATEST(COALESCE(promoted_until, NOW()), NOW()) + (p_duration_days || ' days')::INTERVAL,
    updated_at = NOW()
  WHERE id = p_listing_id;
  INSERT INTO activity_logs (user_id, action, metadata)
  VALUES (v_user_id, 'promotion_buy', jsonb_build_object('listing_id', p_listing_id, 'type', p_promo_type, 'cost', p_cost));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
  v_order_id UUID;
BEGIN
  SELECT user_id INTO v_seller_id FROM listings WHERE id = p_listing_id AND status = 'active';
  IF v_seller_id IS NULL THEN
    RAISE EXCEPTION 'Listing not found or not active';
  END IF;
  IF v_seller_id = v_buyer_id THEN
    RAISE EXCEPTION 'You cannot buy your own listing';
  END IF;
  SELECT id, balance INTO v_buyer_wallet_id, v_buyer_balance FROM wallets WHERE user_id = v_buyer_id;
  IF v_buyer_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Buyer wallet not found.';
  END IF;
  IF v_buyer_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  INSERT INTO orders (buyer_id, seller_id, listing_id, amount, currency, status, payment_method)
  VALUES (v_buyer_id, v_seller_id, p_listing_id, p_amount, 'EUR', 'completed', p_payment_method)
  RETURNING id INTO v_order_id;
  UPDATE wallets SET balance = balance - p_amount, updated_at = NOW() WHERE id = v_buyer_wallet_id;
  INSERT INTO transactions (wallet_id, user_id, type, amount, currency, description, status, metadata)
  VALUES (v_buyer_wallet_id, v_buyer_id, 'purchase', -p_amount, 'EUR', 'Purchase: Listing #' || p_listing_id, 'completed', jsonb_build_object('order_id', v_order_id));
  UPDATE wallets SET balance = balance + p_amount, updated_at = NOW() WHERE user_id = v_seller_id;
  INSERT INTO transactions (wallet_id, user_id, type, amount, currency, description, status, metadata)
  SELECT id, user_id, 'payout', p_amount, 'EUR', 'Sale: Listing #' || p_listing_id, 'completed', jsonb_build_object('order_id', v_order_id)
  FROM wallets WHERE user_id = v_seller_id;
  UPDATE listings SET status = 'sold', updated_at = NOW() WHERE id = p_listing_id;
  INSERT INTO activity_logs (user_id, action, metadata)
  VALUES (v_buyer_id, 'listing_purchase', jsonb_build_object('order_id', v_order_id, 'listing_id', p_listing_id, 'amount', p_amount));
  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RLS ENABLING
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users view own wallet" ON wallets;
    CREATE POLICY "Users view own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users view own transactions" ON transactions;
    CREATE POLICY "Users view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users view own promotions" ON promotions;
    CREATE POLICY "Users view own promotions" ON promotions FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users create reports" ON reports;
    CREATE POLICY "Users create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

    DROP POLICY IF EXISTS "Users view own reports" ON reports;
    CREATE POLICY "Users view own reports" ON reports FOR SELECT USING (auth.uid() = reporter_id);

    DROP POLICY IF EXISTS "Users insert own activity logs" ON activity_logs;
    CREATE POLICY "Users insert own activity logs" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users view own activity logs" ON activity_logs;
    CREATE POLICY "Users view own activity logs" ON activity_logs FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users view involved orders" ON orders;
    CREATE POLICY "Users view involved orders" ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

    DROP POLICY IF EXISTS "Users view own verifications" ON verifications;
    CREATE POLICY "Users view own verifications" ON verifications FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Public read platform settings" ON platform_settings;
    CREATE POLICY "Public read platform settings" ON platform_settings FOR SELECT USING (TRUE);

    DROP POLICY IF EXISTS "Admins manage all reports" ON reports;
    CREATE POLICY "Admins manage all reports" ON reports FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    DROP POLICY IF EXISTS "Admins view all activity" ON activity_logs;
    CREATE POLICY "Admins view all activity" ON activity_logs FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    DROP POLICY IF EXISTS "Admins view all admin actions" ON admin_actions;
    CREATE POLICY "Admins view all admin actions" ON admin_actions FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    DROP POLICY IF EXISTS "Admins manage verifications" ON verifications;
    CREATE POLICY "Admins manage verifications" ON verifications FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- 6. SEED DATA
INSERT INTO platform_settings (key, value) VALUES
('general', '{"siteName": "Slovor Marketplace", "supportEmail": "support@slovor.sk"}'::jsonb),
('system', '{"maintenanceMode": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO categories (name, slug, icon, description, name_en, name_sk, name_cs) VALUES
('Real Estate', 'real-estate', 'home', 'Find your home', 'Real Estate', 'Nehnuteľnosti', 'Nemovitosti'),
('Vehicles', 'vehicles', 'car', 'Cars & Bikes', 'Vehicles', 'Vozidlá', 'Vozidla'),
('Electronics', 'electronics', 'laptop', 'Gagdets', 'Electronics', 'Elektronika', 'Elektronika'),
('Services', 'services', 'tool', 'Local help', 'Services', 'Služby', 'Služby')
ON CONFLICT (slug) DO NOTHING;
