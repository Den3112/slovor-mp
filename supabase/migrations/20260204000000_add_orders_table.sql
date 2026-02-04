-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled', 'refunded'
  payment_method VARCHAR(20), -- 'wallet', 'stripe', 'paypal'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own orders (as buyer or seller)"
  ON orders FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS orders_buyer_id_idx ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS orders_seller_id_idx ON orders(seller_id);
CREATE INDEX IF NOT EXISTS orders_listing_id_idx ON orders(listing_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
