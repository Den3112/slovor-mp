-- Phase 6: RLS Security Refinements
-- Aligned with Masterplan V2 Phase 6

-- 1. ADMIN ACTIONS
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admin actions" ON admin_actions
    FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 2. REPORTS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports" ON reports
    FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can manage all reports" ON reports
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 3. ACTIVITY LOGS (Refinement)
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own logs (if not done via trigger)
CREATE POLICY "Users can insert own activity logs" ON activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ensure users can see their own logs (Already exists in 20260204000003, but refined here)
DROP POLICY IF EXISTS "Users can view own activity logs" ON activity_logs;
CREATE POLICY "Users can view own activity logs" ON activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs" ON activity_logs
    FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 4. USER VERIFICATIONS (Refinement)
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verifications_new" ON user_verifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all verifications_new" ON user_verifications
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5. CATEGORIES (Public Read)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (TRUE);

-- 6. PLATFORM SETTINGS (Public Read)
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active platform settings" ON platform_settings
    FOR SELECT USING (TRUE);

-- 7. PROFILES (Security Refinement)
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 8. TRANSACTIONS (Refinement)
-- Since user_id was added later, we ensure users can see transactions via user_id directly
CREATE POLICY "Users can view own transactions_direct" ON transactions
    FOR SELECT USING (auth.uid() = user_id);
