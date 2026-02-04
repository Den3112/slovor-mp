-- Create table for platform-wide settings
CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read general/system settings
CREATE POLICY "Public read platform_settings"
ON platform_settings FOR SELECT
USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins manage platform_settings"
ON platform_settings FOR ALL
USING (
    auth.jwt() ->> 'email' IN ('den31121999@gmail.com', 'admin@slovor.sk', 'moderator@slovor.sk')
);

-- Initial settings data
INSERT INTO platform_settings (key, value) VALUES
('general', '{"siteName": "Slovor Marketplace", "supportEmail": "support@slovor.sk", "footerDescription": "Modern marketplace for Slovakia and Czech Republic. Buy and sell with confidence."}'::jsonb),
('social', '{"facebook": "https://facebook.com/slovor", "instagram": "https://instagram.com/slovor", "twitter": "https://twitter.com/slovor"}'::jsonb),
('system', '{"maintenanceMode": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;
