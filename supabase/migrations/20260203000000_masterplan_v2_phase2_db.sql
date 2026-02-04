-- Migration Plan Phase 2: Core Data Infrastructure
-- Aligned with Masterplan V2

-- 1. WALLET & TRANSACTIONS
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
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal', 'promotion', 'subscription', 'payout'
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROMOTIONS (Refined)
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(30) NOT NULL, -- 'highlight', 'top_search', 'urgent', 'homepage_featured'
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REPORTS (Abuse/Spam)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL, -- 'scam', 'spam', 'inappropriate', 'wrong_category', 'other'
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'investigating', 'resolved', 'dismissed'
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 4. SUBSCRIPTIONS (Plans)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type VARCHAR(20) DEFAULT 'free', -- 'free', 'pro', 'business'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'past_due', 'cancelled', 'expired'
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ACTIVITY LOG (Simple version)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL, -- 'login', 'listing_create', 'listing_update', 'promotion_buy'
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Add missing indices if any
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_promotions_listing_id ON promotions(listing_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);

-- 7. Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 8. Policies
-- Wallets: user can see own wallet
CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);
-- Transactions: user can see own transactions (via wallet)
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT
USING (EXISTS (SELECT 1 FROM wallets WHERE wallets.id = transactions.wallet_id AND wallets.user_id = auth.uid()));
-- Others are similar...
