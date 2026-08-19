-- =====================================================
-- KITEBE ELITES FC — ROW LEVEL SECURITY POLICIES
-- =====================================================
-- Run AFTER 01_schema.sql and 02_storage_buckets.sql
-- =====================================================

-- =====================================================
-- PART 1: ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE admins                ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_info           ENABLE ROW LEVEL SECURITY;
ALTER TABLE hello_slides          ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_us              ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision                ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission               ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives            ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values           ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery               ENABLE ROW LEVEL SECURITY;
ALTER TABLE news                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership            ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations             ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics             ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_applications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_applications  ENABLE ROW LEVEL SECURITY;
-- Kitebe-specific tables
ALTER TABLE league_groups         ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_teams          ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_fixtures       ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_standings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_gallery         ENABLE ROW LEVEL SECURITY;
ALTER TABLE members               ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_visits        ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PART 2: PUBLIC READ POLICIES (Visitor Content)
-- =====================================================

-- Hello Slides
DROP POLICY IF EXISTS "Public read hello_slides" ON hello_slides;
CREATE POLICY "Public read hello_slides"
  ON hello_slides FOR SELECT USING (is_active = true);

-- About Us
DROP POLICY IF EXISTS "Public read about_us" ON about_us;
CREATE POLICY "Public read about_us"
  ON about_us FOR SELECT USING (is_active = true);

-- Vision
DROP POLICY IF EXISTS "Public read vision" ON vision;
CREATE POLICY "Public read vision"
  ON vision FOR SELECT USING (is_active = true);

-- Mission
DROP POLICY IF EXISTS "Public read mission" ON mission;
CREATE POLICY "Public read mission"
  ON mission FOR SELECT USING (is_active = true);

-- Objectives
DROP POLICY IF EXISTS "Public read objectives" ON objectives;
CREATE POLICY "Public read objectives"
  ON objectives FOR SELECT USING (is_active = true);

-- Programs
DROP POLICY IF EXISTS "Public read programs" ON programs;
CREATE POLICY "Public read programs"
  ON programs FOR SELECT USING (is_active = true);

-- Achievements
DROP POLICY IF EXISTS "Public read achievements" ON achievements;
CREATE POLICY "Public read achievements"
  ON achievements FOR SELECT USING (is_active = true);

-- Core Values
DROP POLICY IF EXISTS "Public read core_values" ON core_values;
CREATE POLICY "Public read core_values"
  ON core_values FOR SELECT USING (is_active = true);

-- Gallery
DROP POLICY IF EXISTS "Public read gallery" ON gallery;
CREATE POLICY "Public read gallery"
  ON gallery FOR SELECT USING (is_active = true);

-- News
DROP POLICY IF EXISTS "Public read news" ON news;
CREATE POLICY "Public read news"
  ON news FOR SELECT USING (is_active = true);

-- Leadership
DROP POLICY IF EXISTS "Public read leadership" ON leadership;
CREATE POLICY "Public read leadership"
  ON leadership FOR SELECT USING (is_active = true);

-- Footer Info (always public)
DROP POLICY IF EXISTS "Public read footer_info" ON footer_info;
CREATE POLICY "Public read footer_info"
  ON footer_info FOR SELECT USING (true);

-- Theme Settings (always public — drives site colors)
DROP POLICY IF EXISTS "Public read theme_settings" ON theme_settings;
CREATE POLICY "Public read theme_settings"
  ON theme_settings FOR SELECT USING (true);

-- Payment Settings (public — needed on donation page)
DROP POLICY IF EXISTS "Public read payment_settings" ON payment_settings;
CREATE POLICY "Public read payment_settings"
  ON payment_settings FOR SELECT USING (true);

-- =====================================================
-- KITEBE-SPECIFIC PUBLIC READ POLICIES
-- =====================================================

-- League Groups (public — visitors can see Hawah & Shadia groups)
DROP POLICY IF EXISTS "Public read league_groups" ON league_groups;
CREATE POLICY "Public read league_groups"
  ON league_groups FOR SELECT USING (is_active = true);

-- League Teams (public — visitors can view team lists)
DROP POLICY IF EXISTS "Public read league_teams" ON league_teams;
CREATE POLICY "Public read league_teams"
  ON league_teams FOR SELECT USING (is_active = true);

-- League Fixtures (public — visitors can see match schedule)
DROP POLICY IF EXISTS "Public read league_fixtures" ON league_fixtures;
CREATE POLICY "Public read league_fixtures"
  ON league_fixtures FOR SELECT USING (true);

-- League Standings (public — visitors can view the table)
DROP POLICY IF EXISTS "Public read league_standings" ON league_standings;
CREATE POLICY "Public read league_standings"
  ON league_standings FOR SELECT USING (true);

-- Match Gallery (public — match day media)
DROP POLICY IF EXISTS "Public read match_gallery" ON match_gallery;
CREATE POLICY "Public read match_gallery"
  ON match_gallery FOR SELECT USING (is_active = true);

-- Members (public — visitors can see the brotherhood roster)
DROP POLICY IF EXISTS "Public read members" ON members;
CREATE POLICY "Public read members"
  ON members FOR SELECT USING (is_active = true);

-- Charity Visits (public — visitors can see outreach work)
DROP POLICY IF EXISTS "Public read charity_visits" ON charity_visits;
CREATE POLICY "Public read charity_visits"
  ON charity_visits FOR SELECT USING (is_active = true);

-- =====================================================
-- PART 3: PUBLIC INSERT POLICIES (Forms)
-- =====================================================

-- Contact Submissions (anyone can reach out)
DROP POLICY IF EXISTS "Public insert contact_submissions" ON contact_submissions;
CREATE POLICY "Public insert contact_submissions"
  ON contact_submissions FOR INSERT WITH CHECK (true);

-- Donations (anyone can donate)
DROP POLICY IF EXISTS "Public insert donations" ON donations;
CREATE POLICY "Public insert donations"
  ON donations FOR INSERT WITH CHECK (true);

-- Analytics (anyone can log page views)
DROP POLICY IF EXISTS "Public insert analytics" ON analytics;
CREATE POLICY "Public insert analytics"
  ON analytics FOR INSERT WITH CHECK (true);

-- Staff Applications
DROP POLICY IF EXISTS "Public insert staff_applications" ON staff_applications;
CREATE POLICY "Public insert staff_applications"
  ON staff_applications FOR INSERT WITH CHECK (true);

-- Volunteer Applications
DROP POLICY IF EXISTS "Public insert volunteer_applications" ON volunteer_applications;
CREATE POLICY "Public insert volunteer_applications"
  ON volunteer_applications FOR INSERT WITH CHECK (true);

-- Partner Applications
DROP POLICY IF EXISTS "Public insert partner_applications" ON partner_applications;
CREATE POLICY "Public insert partner_applications"
  ON partner_applications FOR INSERT WITH CHECK (true);

-- =====================================================
-- PART 4: ADMIN READ POLICIES (for admin dashboard)
-- =====================================================
-- Note: Admin operations use the service role key which bypasses RLS.
-- These policies are for when Supabase Auth is implemented.
-- The patterns below are templates for future auth integration.

-- Admins can read all contact submissions
 CREATE POLICY "Admin read contact_submissions"
   ON contact_submissions FOR SELECT
   USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()));

-- Admins can read all donations
 CREATE POLICY "Admin read donations"
   ON donations FOR SELECT
   USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()));

-- Admins can read all analytics
 CREATE POLICY "Admin read analytics"
   ON analytics FOR SELECT
   USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()));

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Check which tables have RLS enabled:
 SELECT schemaname, tablename, rowsecurity
 FROM pg_tables
 WHERE schemaname = 'public'
 ORDER BY tablename;

-- Check all active policies:
 SELECT schemaname, tablename, policyname, permissive, roles, cmd
 FROM pg_policies
 WHERE schemaname = 'public'
 ORDER BY tablename, policyname;

-- =====================================================
-- END OF 03_rls_policies.sql
-- Run next: 04_initial_data.sql
-- =====================================================
