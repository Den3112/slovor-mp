-- Add seller reply functionality to reviews
-- Aligned with Masterplan V2 Phase 3

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS seller_reply TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS seller_reply_at TIMESTAMP WITH TIME ZONE;

-- RLS Policy for updating reply (only recipient can reply)
CREATE POLICY "Recipient can update own reviews with replies" ON reviews
    FOR UPDATE USING (auth.uid() = recipient_id)
    WITH CHECK (auth.uid() = recipient_id);
