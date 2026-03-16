-- GIN indexes for JSONB search optimization
-- Applied as part of Audit Fixes Performance Hardening

CREATE INDEX IF NOT EXISTS idx_transactions_metadata_gin ON transactions USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_activity_logs_metadata_gin ON activity_logs USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_listings_attributes_gin ON listings USING GIN (attributes);
