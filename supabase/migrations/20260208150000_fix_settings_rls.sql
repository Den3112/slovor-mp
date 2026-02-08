-- Fix Admin RLS for Platform Settings
-- Enables Admins to Manage System Configuration

-- 1. PLATFORM SETTINGS: Allow Admins full control
-- Note: 'Anyone can view' policy already exists.

CREATE POLICY "Admins can insert platform settings" ON platform_settings
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update platform settings" ON platform_settings
    FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete platform settings" ON platform_settings
    FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
