-- Migration: Purchase function for atomic transactions
-- Aligned with Order Management System

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
  -- 1. Get seller and check listing status
  SELECT user_id INTO v_seller_id FROM listings WHERE id = p_listing_id AND status = 'active';

  IF v_seller_id IS NULL THEN
    RAISE EXCEPTION 'Listing not found or not active';
  END IF;

  -- 2. Prevent self-purchase
  IF v_seller_id = v_buyer_id THEN
    RAISE EXCEPTION 'You cannot buy your own listing';
  END IF;

  -- 3. Get buyer wallet and balance
  SELECT id, balance INTO v_buyer_wallet_id, v_buyer_balance FROM wallets WHERE user_id = v_buyer_id;

  IF v_buyer_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Buyer wallet not found. Please ensure you have a wallet.';
  END IF;

  -- 4. Check balance
  IF v_buyer_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance in wallet';
  END IF;

  -- 5. Atomic Transaction:

  -- A. Create Order
  INSERT INTO orders (buyer_id, seller_id, listing_id, amount, currency, status, payment_method)
  VALUES (v_buyer_id, v_seller_id, p_listing_id, p_amount, 'EUR', 'completed', p_payment_method)
  RETURNING id INTO v_order_id;

  -- B. Deduct from buyer
  UPDATE wallets SET balance = balance - p_amount, updated_at = NOW() WHERE id = v_buyer_wallet_id;

  -- C. Record Transaction for Buyer
  INSERT INTO transactions (wallet_id, user_id, type, amount, currency, description, status, metadata)
  VALUES (v_buyer_wallet_id, v_buyer_id, 'refill', -p_amount, 'EUR', 'Purchase: Listing #' || p_listing_id, 'completed', jsonb_build_object('order_id', v_order_id, 'listing_id', p_listing_id));

  -- D. Add to Seller
  UPDATE wallets SET balance = balance + p_amount, updated_at = NOW() WHERE user_id = v_seller_id;

  -- E. Record Transaction for Seller
  INSERT INTO transactions (wallet_id, user_id, type, amount, currency, description, status, metadata)
  SELECT id, user_id, 'payout', p_amount, 'EUR', 'Sale: Listing #' || p_listing_id, 'completed', jsonb_build_object('order_id', v_order_id, 'listing_id', p_listing_id)
  FROM wallets WHERE user_id = v_seller_id;

  -- F. Mark listing as sold
  UPDATE listings SET status = 'sold', updated_at = NOW() WHERE id = p_listing_id;

  -- G. Log Activity
  INSERT INTO activity_logs (user_id, action, metadata)
  VALUES (v_buyer_id, 'listing_purchase', jsonb_build_object('order_id', v_order_id, 'listing_id', p_listing_id, 'amount', p_amount));

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
