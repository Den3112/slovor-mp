-- Saved searches (search subscriptions)
CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    query TEXT, -- search query string
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    location VARCHAR(100),
    min_price DECIMAL(12,2),
    max_price DECIMAL(12,2),
    notify_email BOOLEAN DEFAULT true,
    notify_push BOOLEAN DEFAULT false,
    frequency VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('instant', 'daily', 'weekly')),
    last_notified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX idx_saved_searches_user_id ON saved_searches(user_id);

-- RLS policies
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved searches"
ON saved_searches FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own saved searches"
ON saved_searches FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved searches"
ON saved_searches FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved searches"
ON saved_searches FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
