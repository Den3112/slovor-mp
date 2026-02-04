-- Migration to align Verifications with Masterplan V2 Product Ready spec
-- Table name: verifications
-- Uses document_url instead of document_data

CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type VARCHAR(30) NOT NULL, -- 'email', 'phone', 'id_document', 'address', 'business'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  document_url TEXT,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own verifications" ON verifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all verifications" ON verifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Index
CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);
