-- =====================================================
-- Community Membership System Schema
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension (may already exist)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. COMMUNITY POLICIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS community_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. MEMBER APPLICATIONS TABLE (pending/reviewed)
-- =====================================================
CREATE TABLE IF NOT EXISTS member_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  gender VARCHAR(30) NOT NULL,
  date_of_birth DATE NOT NULL,
  why_join TEXT NOT NULL,
  self_description TEXT NOT NULL,
  academic_background TEXT NOT NULL,
  education_level VARCHAR(100) NOT NULL, -- 'High School','Diploma','Bachelor','Master','PhD','Other'
  additional_info TEXT,
  policies_accepted BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  rejection_reason TEXT,
  approval_token UUID,                   -- one-time token for profile completion link
  profile_completed BOOLEAN DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique index: prevent duplicate applications from same email
CREATE UNIQUE INDEX IF NOT EXISTS idx_member_applications_email
  ON member_applications(email);

-- =====================================================
-- 3. COMMUNITY MEMBERS TABLE (approved & profile done)
-- =====================================================
CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES member_applications(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(30),
  nationality VARCHAR(100),
  gender VARCHAR(30),
  date_of_birth DATE,
  why_join TEXT,
  self_description TEXT,
  academic_background TEXT,
  education_level VARCHAR(100),
  additional_info TEXT,
  profile_image_url TEXT,
  extra_profile_info TEXT,              -- additional info uploaded after approval
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_member_applications_status
  ON member_applications(status);
CREATE INDEX IF NOT EXISTS idx_member_applications_created_at
  ON member_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_members_joined_at
  ON community_members(joined_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_policies_order
  ON community_policies(display_order);

-- =====================================================
-- 5. UPDATED_AT TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_member_applications_updated_at
  BEFORE UPDATE ON member_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_members_updated_at
  BEFORE UPDATE ON community_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_policies_updated_at
  BEFORE UPDATE ON community_policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- member_applications: public can INSERT, only service role can SELECT/UPDATE/DELETE
ALTER TABLE member_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit application"
  ON member_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role manages applications"
  ON member_applications FOR ALL
  USING (true);

-- community_members: public can SELECT active members; service role has full access
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active members"
  ON community_members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role manages members"
  ON community_members FOR ALL
  USING (true);

-- community_policies: public can SELECT active; service role has full access
ALTER TABLE community_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active policies"
  ON community_policies FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role manages policies"
  ON community_policies FOR ALL
  USING (true);

-- =====================================================
-- 7. STORAGE BUCKET: member-profiles
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'member-profiles',
  'member-profiles',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage policy: anyone can upload to member-profiles
CREATE POLICY "Public can upload member profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'member-profiles');

CREATE POLICY "Public can view member profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'member-profiles');

-- =====================================================
-- 8. SEED: Default community policies
-- =====================================================
INSERT INTO community_policies (title, content, display_order, is_active)
VALUES
  (
    'Code of Conduct',
    'All members of the Kitebe Elites FC community are expected to treat each other with respect and dignity. Harassment, discrimination, or any form of abusive behaviour will not be tolerated and may result in removal from the community.',
    1, true
  ),
  (
    'Privacy Policy',
    'By joining our community, you consent to the collection and use of your personal information for the purposes of managing your membership. Your data will not be shared with third parties without your explicit consent. You may request deletion of your data at any time by contacting the administrator.',
    2, true
  ),
  (
    'Membership Responsibilities',
    'Members are expected to actively participate in community activities, uphold the values of the organisation, and contribute positively to the growth of Kitebe Elites FC. Membership may be reviewed if a member is inactive for an extended period.',
    3, true
  ),
  (
    'Media & Content Policy',
    'Any photos or videos taken at community events may be used for promotional purposes on our website and social media. If you do not wish to appear in such media, please notify an administrator. Members must not share confidential community information publicly.',
    4, true
  )
ON CONFLICT DO NOTHING;
