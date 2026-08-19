-- =====================================================
-- KITEBE ELITES FC — COMPLETE SETUP (SINGLE RUN)
-- =====================================================
-- This is the ONE script to rule them all.
-- Paste this entire file into the Supabase SQL Editor
-- and click RUN once to set up the entire database.
--
-- Organization : Kitebe Elites FC
-- Motto        : "Tethered Together"
-- Base         : Makerere Main Mosque Library, Kampala
-- Website      : www.kitebeelites.com
-- Email        : kitebeelitesfc@gmail.com
-- Socials      : @kitebeelites (Instagram & TikTok)
--
-- SECTIONS:
--   A. Extensions
--   B. Tables (schema)
--   C. Indexes & Triggers
--   D. Storage Buckets
--   E. RLS Policies
--   F. Seed Data
--   G. Verification Counts
-- =====================================================

-- =====================================================
-- A. EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- B. TABLES
-- =====================================================

-- Admins
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name     VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone_number  VARCHAR(20),
  image_url     TEXT,
  is_active     BOOLEAN     DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings
CREATE TABLE IF NOT EXISTS site_settings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key   VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_by    UUID REFERENCES admins(id)
);

-- Theme settings
CREATE TABLE IF NOT EXISTS theme_settings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  backgroundColor VARCHAR(7)   DEFAULT '#FFFFFF',
  textColor       VARCHAR(7)   DEFAULT '#1A1A1A',
  primaryColor    VARCHAR(7)   DEFAULT '#1B5E20',
  fontFamily      VARCHAR(100) DEFAULT 'Inter',
  updated_at      TIMESTAMPTZ  DEFAULT NOW(),
  updated_by      UUID REFERENCES admins(id)
);

-- Footer info
CREATE TABLE IF NOT EXISTS footer_info (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_name VARCHAR(255),
  location          TEXT,
  director          VARCHAR(255),
  email             VARCHAR(255),
  phone             VARCHAR(20),
  organization_type VARCHAR(100),
  primary_focus     TEXT,
  instagram_handle  VARCHAR(100),
  tiktok_handle     VARCHAR(100),
  website_url       VARCHAR(255),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Hello slides
CREATE TABLE IF NOT EXISTS hello_slides (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url   TEXT NOT NULL,
  description TEXT,
  order_index INTEGER     DEFAULT 0,
  direction   VARCHAR(10) DEFAULT 'left',
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- About us
CREATE TABLE IF NOT EXISTS about_us (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url   TEXT,
  description TEXT NOT NULL,
  order_index INTEGER     DEFAULT 0,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Vision
CREATE TABLE IF NOT EXISTS vision (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url  TEXT,
  statement  TEXT NOT NULL,
  is_active  BOOLEAN     DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mission
CREATE TABLE IF NOT EXISTS mission (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url  TEXT,
  statement  TEXT NOT NULL,
  is_active  BOOLEAN     DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Objectives
CREATE TABLE IF NOT EXISTS objectives (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url   TEXT,
  statement   TEXT NOT NULL,
  order_index INTEGER     DEFAULT 0,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Programs
CREATE TABLE IF NOT EXISTS programs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url   TEXT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER     DEFAULT 0,
  is_featured BOOLEAN     DEFAULT false,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url        TEXT NOT NULL,
  title            VARCHAR(255) NOT NULL,
  description      TEXT NOT NULL,
  achievement_date DATE NOT NULL,
  order_index      INTEGER     DEFAULT 0,
  is_featured      BOOLEAN     DEFAULT false,
  is_active        BOOLEAN     DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Core values
CREATE TABLE IF NOT EXISTS core_values (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url   TEXT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER     DEFAULT 0,
  is_featured BOOLEAN     DEFAULT false,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url   TEXT NOT NULL,
  description TEXT,
  category    VARCHAR(100),
  media_type  VARCHAR(10) DEFAULT 'image',
  order_index INTEGER     DEFAULT 0,
  is_featured BOOLEAN     DEFAULT false,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- News
CREATE TABLE IF NOT EXISTS news (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url      TEXT NOT NULL,
  title          VARCHAR(255) NOT NULL,
  description    TEXT NOT NULL,
  published_date DATE NOT NULL,
  order_index    INTEGER     DEFAULT 0,
  is_featured    BOOLEAN     DEFAULT false,
  is_active      BOOLEAN     DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Leadership
CREATE TABLE IF NOT EXISTS leadership (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url     TEXT NOT NULL,
  full_name     VARCHAR(255) NOT NULL,
  title         VARCHAR(255) NOT NULL,
  role_detail   TEXT,
  achievement   TEXT,
  member_number INTEGER,
  order_index   INTEGER     DEFAULT 0,
  is_featured   BOOLEAN     DEFAULT false,
  is_active     BOOLEAN     DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Contact submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name     VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone_number  VARCHAR(20),
  gender        VARCHAR(20),
  residence     TEXT,
  message       TEXT,
  is_contacted  BOOLEAN     DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Donations
CREATE TABLE IF NOT EXISTS donations (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name        VARCHAR(255) NOT NULL,
  donor_email       VARCHAR(255),
  donor_phone       VARCHAR(20),
  amount            DECIMAL(10,2) NOT NULL,
  payment_method    VARCHAR(50) NOT NULL,
  payment_reference VARCHAR(255),
  receipt_number    VARCHAR(50) UNIQUE,
  receipt_generated BOOLEAN     DEFAULT false,
  receipt_url       TEXT,
  purpose           VARCHAR(255) DEFAULT 'General Fund',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Payment settings
CREATE TABLE IF NOT EXISTS payment_settings (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mtn_number                  VARCHAR(20),
  mtn_name                    VARCHAR(255),
  airtel_number               VARCHAR(20),
  airtel_name                 VARCHAR(255),
  manual_payment_instructions TEXT,
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics
CREATE TABLE IF NOT EXISTS analytics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path   VARCHAR(255),
  visitor_id  VARCHAR(100),
  session_id  VARCHAR(100),
  action_type VARCHAR(50)  DEFAULT 'page_view',
  visitor_ip  VARCHAR(45),
  device_type VARCHAR(20),
  country     VARCHAR(100),
  user_agent  TEXT,
  referrer    TEXT,
  visited_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- Staff applications
CREATE TABLE IF NOT EXISTS staff_applications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name   VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  nationality VARCHAR(100),
  sex         VARCHAR(20),
  dob         DATE,
  is_approved BOOLEAN     DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteer applications
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name   VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  address     TEXT,
  skills      TEXT,
  is_approved BOOLEAN     DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Partner applications
CREATE TABLE IF NOT EXISTS partner_applications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_name VARCHAR(255) NOT NULL,
  contact_name      VARCHAR(255) NOT NULL,
  email             VARCHAR(255) NOT NULL,
  phone             VARCHAR(20),
  partnership_type  VARCHAR(100),
  message           TEXT,
  is_approved       BOOLEAN     DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── KITEBE-SPECIFIC TABLES ─────────────────────────

-- League groups
CREATE TABLE IF NOT EXISTS league_groups (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(255) NOT NULL,
  season      VARCHAR(20)  NOT NULL,
  description TEXT,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- League teams
CREATE TABLE IF NOT EXISTS league_teams (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id    UUID NOT NULL REFERENCES league_groups(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  short_code  VARCHAR(10),
  logo_url    TEXT,
  captain     VARCHAR(255),
  home_ground VARCHAR(255) DEFAULT 'Makerere Main Mosque Grounds',
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- League fixtures
CREATE TABLE IF NOT EXISTS league_fixtures (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id     UUID NOT NULL REFERENCES league_groups(id),
  home_team_id UUID NOT NULL REFERENCES league_teams(id),
  away_team_id UUID NOT NULL REFERENCES league_teams(id),
  match_date   DATE,
  match_time   TIME,
  venue        VARCHAR(255) DEFAULT 'Makerere Main Mosque Grounds',
  home_score   INTEGER,
  away_score   INTEGER,
  status       VARCHAR(20) DEFAULT 'scheduled',
  match_notes  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_different_teams CHECK (home_team_id <> away_team_id)
);

-- League standings
CREATE TABLE IF NOT EXISTS league_standings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id        UUID NOT NULL REFERENCES league_groups(id),
  team_id         UUID NOT NULL REFERENCES league_teams(id),
  season          VARCHAR(20) NOT NULL DEFAULT '2025-2026',
  played          INTEGER DEFAULT 0,
  won             INTEGER DEFAULT 0,
  drawn           INTEGER DEFAULT 0,
  lost            INTEGER DEFAULT 0,
  goals_for       INTEGER DEFAULT 0,
  goals_against   INTEGER DEFAULT 0,
  goal_difference INTEGER GENERATED ALWAYS AS (goals_for - goals_against) STORED,
  points          INTEGER GENERATED ALWAYS AS ((won * 3) + drawn) STORED,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (group_id, team_id, season)
);

-- Match gallery
CREATE TABLE IF NOT EXISTS match_gallery (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fixture_id  UUID REFERENCES league_fixtures(id) ON DELETE SET NULL,
  image_url   TEXT NOT NULL,
  caption     TEXT,
  media_type  VARCHAR(10) DEFAULT 'image',
  is_featured BOOLEAN     DEFAULT false,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Members roster
CREATE TABLE IF NOT EXISTS members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_number INTEGER UNIQUE,
  full_name     VARCHAR(255) NOT NULL,
  nickname      VARCHAR(100),
  role          VARCHAR(255),
  committee     VARCHAR(255),
  profession    VARCHAR(255),
  field_of_study VARCHAR(255),
  phone         VARCHAR(20),
  email         VARCHAR(255),
  image_url     TEXT,
  jersey_number INTEGER,
  position      VARCHAR(50),
  is_executive  BOOLEAN     DEFAULT false,
  is_active     BOOLEAN     DEFAULT true,
  joined_date   DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Charity visits
CREATE TABLE IF NOT EXISTS charity_visits (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         VARCHAR(255) NOT NULL,
  location      VARCHAR(255) NOT NULL,
  visit_date    DATE NOT NULL,
  description   TEXT,
  items_donated TEXT,
  beneficiaries INTEGER,
  image_url     TEXT,
  category      VARCHAR(100) DEFAULT 'Hospital Visit',
  is_featured   BOOLEAN     DEFAULT false,
  is_active     BOOLEAN     DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- C. INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_hello_slides_order    ON hello_slides(order_index);
CREATE INDEX IF NOT EXISTS idx_about_us_order        ON about_us(order_index);
CREATE INDEX IF NOT EXISTS idx_objectives_order      ON objectives(order_index);
CREATE INDEX IF NOT EXISTS idx_programs_order        ON programs(order_index);
CREATE INDEX IF NOT EXISTS idx_achievements_order    ON achievements(order_index);
CREATE INDEX IF NOT EXISTS idx_core_values_order     ON core_values(order_index);
CREATE INDEX IF NOT EXISTS idx_gallery_order         ON gallery(order_index);
CREATE INDEX IF NOT EXISTS idx_gallery_category      ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_news_order            ON news(order_index);
CREATE INDEX IF NOT EXISTS idx_leadership_order      ON leadership(order_index);
CREATE INDEX IF NOT EXISTS idx_analytics_visited_at  ON analytics(visited_at);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor_id  ON analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at  ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_receipt     ON donations(receipt_number);
CREATE INDEX IF NOT EXISTS idx_league_teams_group    ON league_teams(group_id);
CREATE INDEX IF NOT EXISTS idx_fixtures_group        ON league_fixtures(group_id);
CREATE INDEX IF NOT EXISTS idx_fixtures_date         ON league_fixtures(match_date);
CREATE INDEX IF NOT EXISTS idx_standings_group       ON league_standings(group_id);
CREATE INDEX IF NOT EXISTS idx_standings_points      ON league_standings(points DESC);
CREATE INDEX IF NOT EXISTS idx_members_number        ON members(member_number);
CREATE INDEX IF NOT EXISTS idx_charity_visits_date   ON charity_visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_match_gallery_fixture ON match_gallery(fixture_id);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'admins','site_settings','theme_settings','footer_info',
    'hello_slides','about_us','objectives','programs',
    'achievements','core_values','gallery','news','leadership',
    'league_groups','league_teams','league_fixtures',
    'members','charity_visits'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I;
       CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END $$;

-- =====================================================
-- D. STORAGE BUCKETS (15 total)
-- =====================================================

DO $$
DECLARE
  buckets JSONB := '[
    {"id":"hello-slides",    "limit":10485760},
    {"id":"about-us",        "limit":10485760},
    {"id":"vision",          "limit":10485760},
    {"id":"mission",         "limit":10485760},
    {"id":"objectives",      "limit":10485760},
    {"id":"programs",        "limit":10485760},
    {"id":"achievements",    "limit":10485760},
    {"id":"core-values",     "limit":10485760},
    {"id":"gallery",         "limit":20971520},
    {"id":"news",            "limit":10485760},
    {"id":"leadership",      "limit":5242880},
    {"id":"admin-profiles",  "limit":2097152},
    {"id":"match-gallery",   "limit":26214400},
    {"id":"member-profiles", "limit":5242880},
    {"id":"charity-events",  "limit":10485760}
  ]';
  b JSONB;
BEGIN
  FOR b IN SELECT * FROM jsonb_array_elements(buckets)
  LOOP
    INSERT INTO storage.buckets (id, name, public, file_size_limit)
    VALUES (
      b->>'id', b->>'id', true,
      (b->>'limit')::BIGINT
    )
    ON CONFLICT (id) DO UPDATE SET
      public          = true,
      file_size_limit = (b->>'limit')::BIGINT;
  END LOOP;
END $$;

-- Storage RLS
DROP POLICY IF EXISTS "Kitebe public read storage"     ON storage.objects;
DROP POLICY IF EXISTS "Kitebe authenticated upload"    ON storage.objects;
DROP POLICY IF EXISTS "Kitebe authenticated update"    ON storage.objects;
DROP POLICY IF EXISTS "Kitebe authenticated delete"    ON storage.objects;

CREATE POLICY "Kitebe public read storage"
  ON storage.objects FOR SELECT
  USING (bucket_id IN (
    'hello-slides','about-us','vision','mission','objectives',
    'programs','achievements','core-values','gallery','news',
    'leadership','admin-profiles',
    'match-gallery','member-profiles','charity-events'
  ));

CREATE POLICY "Kitebe authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN (
      'hello-slides','about-us','vision','mission','objectives',
      'programs','achievements','core-values','gallery','news',
      'leadership','admin-profiles',
      'match-gallery','member-profiles','charity-events'
    ) AND auth.role() = 'authenticated'
  );

CREATE POLICY "Kitebe authenticated update"
  ON storage.objects FOR UPDATE
  WITH CHECK (
    bucket_id IN (
      'hello-slides','about-us','vision','mission','objectives',
      'programs','achievements','core-values','gallery','news',
      'leadership','admin-profiles',
      'match-gallery','member-profiles','charity-events'
    ) AND auth.role() = 'authenticated'
  );

CREATE POLICY "Kitebe authenticated delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN (
      'hello-slides','about-us','vision','mission','objectives',
      'programs','achievements','core-values','gallery','news',
      'leadership','admin-profiles',
      'match-gallery','member-profiles','charity-events'
    ) AND auth.role() = 'authenticated'
  );

-- =====================================================
-- E. RLS POLICIES
-- =====================================================

ALTER TABLE admins                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_info            ENABLE ROW LEVEL SECURITY;
ALTER TABLE hello_slides           ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_us               ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission                ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives             ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements           ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values            ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery                ENABLE ROW LEVEL SECURITY;
ALTER TABLE news                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership             ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations              ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics              ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_applications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_applications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_groups          ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_teams           ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_fixtures        ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_standings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_gallery          ENABLE ROW LEVEL SECURITY;
ALTER TABLE members                ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_visits         ENABLE ROW LEVEL SECURITY;

-- Public read — active content tables
DO $$
DECLARE
  t TEXT;
  active_tables TEXT[] := ARRAY[
    'hello_slides','about_us','vision','mission','objectives',
    'programs','achievements','core_values','gallery','news',
    'leadership','league_groups','league_teams','match_gallery',
    'members','charity_visits'
  ];
BEGIN
  FOREACH t IN ARRAY active_tables LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS "Public read %I" ON %I;
       CREATE POLICY "Public read %I" ON %I FOR SELECT USING (is_active = true);',
      t, t, t, t
    );
  END LOOP;
END $$;

-- Public read — unrestricted tables
CREATE POLICY "Public read footer_info"       ON footer_info       FOR SELECT USING (true);
CREATE POLICY "Public read theme_settings"    ON theme_settings    FOR SELECT USING (true);
CREATE POLICY "Public read payment_settings"  ON payment_settings  FOR SELECT USING (true);
CREATE POLICY "Public read league_fixtures"   ON league_fixtures   FOR SELECT USING (true);
CREATE POLICY "Public read league_standings"  ON league_standings  FOR SELECT USING (true);

-- Public insert — forms
CREATE POLICY "Public insert contact_submissions"    ON contact_submissions    FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert donations"              ON donations              FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert analytics"              ON analytics              FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert staff_applications"     ON staff_applications     FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert volunteer_applications" ON volunteer_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert partner_applications"   ON partner_applications   FOR INSERT WITH CHECK (true);

-- =====================================================
-- F. SEED DATA
-- =====================================================

-- Theme
INSERT INTO theme_settings (backgroundColor, textColor, primaryColor, fontFamily)
VALUES ('#FFFFFF', '#1A1A1A', '#1B5E20', 'Inter')
ON CONFLICT DO NOTHING;

-- Footer / Org Info
INSERT INTO footer_info (
  organization_name, location, director, email, phone,
  organization_type, primary_focus,
  instagram_handle, tiktok_handle, website_url
) VALUES (
  'Kitebe Elites FC',
  'Makerere Main Mosque Library, Kampala, Uganda',
  'Chairman — Kitebe Elites FC',
  'kitebeelitesfc@gmail.com',
  '+256 700 000000',
  'Community-Based Sports & Social Impact Organization',
  'Football, Community Outreach, Youth Empowerment & Charity',
  '@kitebeelites',
  '@kitebeelites',
  'https://www.kitebeelites.com'
);

-- Admin user (password: kitebe2025 — CHANGE AFTER FIRST LOGIN)
INSERT INTO admins (full_name, email, password_hash, phone_number)
VALUES (
  'Kitebe Elites Admin',
  'kitebeelitesfc@gmail.com',
  encode(digest('kitebe2025', 'sha256'), 'hex'),
  '+256 700 000000'
) ON CONFLICT (email) DO NOTHING;

-- Payment settings
INSERT INTO payment_settings (mtn_number, mtn_name, airtel_number, airtel_name, manual_payment_instructions)
VALUES (
  '+256 77 0000000', 'Kitebe Elites FC',
  '+256 75 0000000', 'Kitebe Elites FC',
  'Send your donation via mobile money, then email kitebeelitesfc@gmail.com with your transaction reference, name, and purpose. Confirmation within 24 hours.'
);

-- Hello Slides
INSERT INTO hello_slides (image_url, description, order_index, direction) VALUES
  ('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200','Kitebe Elites FC — Tethered Together. Brotherhood, football, and community from Makerere to the world.',1,'left'),
  ('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200','Uniting communities through the beautiful game. Every Sunday, every goal — for the people.',2,'left'),
  ('https://images.unsplash.com/photo-1551958219-acbc338a7924?w=1200','From hospital visits to charity tournaments — we serve beyond the pitch.',3,'right'),
  ('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200','The Kitebe Elites League 2025–2026: Hawah Group & Shadia Group. Ten teams. One spirit.',4,'right');

-- About Us
INSERT INTO about_us (description, image_url, order_index) VALUES
  ('Kitebe Elites FC is a community-based sports and social impact organization that originated as a casual Sunday football meet-up for students of diverse educational backgrounds at Makerere University. Over time, it grew into a close-knit network and brotherhood of graduates, professionals, and community members united by a single motto: "Tethered Together".','https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900',1),
  ('Rooted in the Makerere Main Mosque Library — our symbolic home and operational hub — Kitebe Elites FC has evolved from an informal student football group into a formal Community-Based Team (CBT). Our membership spans engineers, medics, educators, technologists, and community leaders who share a passion for football and a commitment to social upliftment.','https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900',2),
  ('Using football as an entry point and vehicle, we foster brotherhood, community leadership, mentorship, and social welfare. From organizing competitive leagues and charity tournaments to visiting the sick in hospitals and donating football kits to grassroots teams — Kitebe Elites FC is more than a football club. We are a movement.','https://images.unsplash.com/photo-1551958219-acbc338a7924?w=900',3);

-- Vision & Mission
INSERT INTO vision (statement, image_url) VALUES ('A society where sport builds bridges between people, uplifts the vulnerable, and inspires positive change — from Makerere to the wider world.','https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900');
INSERT INTO mission (statement, image_url) VALUES ('To be a team that uses football as a tool to unite, inspire, and uplift communities — through charity, mentorship, and social engagement — creating a lasting brotherhood that transcends the pitch.','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900');

-- Objectives
INSERT INTO objectives (statement, image_url, order_index) VALUES
  ('Organize regular, competitive Sunday football sessions and structured league competitions that bring communities together.','https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=700',1),
  ('Conduct meaningful charity and social outreach — visiting hospitals, donating kits and balls, and running open soccer days.','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700',2),
  ('Empower youth and women through skill-building programs and mentorship that extend beyond athletics.','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700',3),
  ('Build strategic partnerships with mosques, NGOs, sports bodies, and corporate entities to amplify impact.','https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700',4),
  ('Grow the Kitebe Elites brand into an internationally recognized model for community-driven football.','https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700',5);

-- Programs
INSERT INTO programs (title, description, image_url, is_featured, order_index) VALUES
  ('Community Football','The heartbeat of Kitebe Elites FC. We host regular Sunday football sessions, run the Kitebe Elites League 2025–2026 (Hawah Group & Shadia Group), and organize charity tournaments that bring entire communities together.','https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900',true,1),
  ('Charity & Social Outreach','We organize direct hospital visits, donate football kits and jerseys to grassroots teams, and run open soccer days. Every jersey donated. Every visit made. Every smile earned.','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900',true,2),
  ('Youth & Empowerment','Football opens doors. We support youth skill-building programs, mentorship sessions, and career guidance — engaging our community into active civic leaders.','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900',true,3),
  ('Partnerships & Collaboration','We collaborate with local mosques, NGOs, sports governing bodies, and corporate entities to amplify our reach. Our roots at the Makerere Main Mosque Library anchor us in faith and community.','https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900',true,4);

-- Achievements
INSERT INTO achievements (title, description, achievement_date, image_url, is_featured, order_index) VALUES
  ('Kitebe Elites League 2025–2026 Launch','Successfully launched the inaugural Kitebe Elites League featuring 10 teams across Hawah Group and Shadia Group.','2025-01-01','https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900',true,1),
  ('Mulago Hospital Charity Visit','Organized a compassionate charity visit to Mulago National Referral Hospital, bringing encouragement and supplies to patients.','2024-11-15','https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900',true,2),
  ('Football Kit Donation Drive','Donated complete football kits to three grassroots youth teams in Kampala — jerseys, shorts, boots, and footballs.','2024-09-20','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900',true,3),
  ('Open Soccer Day — Makerere Community','Hosted a wildly successful Open Soccer Day at Makerere, attracting over 200 community members, youth, and alumni.','2024-06-28','https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900',true,4),
  ('Tethered Together Cup','Organized the first-ever Tethered Together Cup charity football tournament, raising UGX 2,500,000 for community programs.','2024-04-10','https://images.unsplash.com/photo-1551958219-acbc338a7924?w=900',true,5);

-- Core Values
INSERT INTO core_values (title, description, image_url, is_featured, order_index) VALUES
  ('Brotherhood (Ukhuwwah)','At our core, we are a family. Every member of Kitebe Elites FC is bound by a deep sense of brotherhood — on the pitch and off it. "Tethered Together" is not just a motto; it is how we live.','https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900',true,1),
  ('Integrity & Transparency','We conduct all our affairs with honesty and accountability. Our community trusts us, and we honour that trust through transparent operations, finances, and decisions.','https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900',true,2),
  ('Community Service','Football is our vehicle, but service is our destination. We give back through hospital visits, kit donations, mentorship, and open soccer days — because we are from this community.','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900',true,3),
  ('Excellence & Growth','We pursue excellence in everything we do — from how we play football to how we run our programs. We push each other to grow as athletes, professionals, and human beings.','https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900',true,4),
  ('Faith & Rootedness','Founded at the Makerere Main Mosque Library, faith and moral grounding are woven into our identity. We use our values as a compass for every decision we make.','https://images.unsplash.com/photo-1551958219-acbc338a7924?w=900',true,5);

-- Leadership
INSERT INTO leadership (full_name, title, role_detail, achievement, image_url, member_number, order_index, is_featured) VALUES
  ('Chairman','Chairman','Executive oversight and organizational leadership of Kitebe Elites FC. Responsible for the strategic direction of the club and community impact programs.','Founded and grew Kitebe Elites FC from a Sunday football meetup into a structured CBT with a formal league, charity programs, and 20+ active members.','https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700',20,1,true),
  ('Isham Malamu','Team Captain','Squad leadership and on-pitch management. Responsible for team selection, match strategy, and player morale.','Led Kitebe Elites FC through competitive league seasons while fostering a culture of unity and sportsmanship.','https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=700',8,2,true),
  ('Bbosa Arafat','Welfare & Assistant Captain','Player welfare, squad logistics, and deputy squad coordination. Ensures wellbeing of all members.','Instrumental in coordinating hospital visits and charity initiatives, bringing the human side of Kitebe Elites FC to life.','https://images.unsplash.com/photo-1583009668174-3fa133b65889?w=700',4,3,true),
  ('Manager Katumba','General Duties (Operations)','Administrative operations and coordination. Manages logistics, scheduling, and day-to-day club administration.','Established the operational systems that allow Kitebe Elites FC to run smoothly — from match scheduling to kit management.','https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=700',12,4,true),
  ('General Duties & Treasurer','Treasurer','Financial management, accounting, and general administrative operations. Maintains the club''s financial records.','Built a transparent financial management system ensuring every donation is properly accounted for and directed toward community impact.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700',13,5,true),
  ('Publicity & Media','Head of Publicity & Media','Communications, PR, and social media. Manages @kitebeelites on Instagram and TikTok.','Grew the Kitebe Elites FC digital presence, documenting match days, charity events, and brotherhood moments that connect fans worldwide.','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700',25,6,true);

-- Gallery
INSERT INTO gallery (image_url, description, category, media_type, is_featured) VALUES
  ('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900','Kitebe Elites Sunday match at Makerere','Matches','image',true),
  ('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900','Team huddle before kickoff','Matches','image',true),
  ('https://images.unsplash.com/photo-1551958219-acbc338a7924?w=900','Celebrating a goal — the Kitebe way','Matches','image',true),
  ('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900','Full squad on match day','Matches','image',true),
  ('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900','Hospital visit — bringing joy to patients','Charity','image',true),
  ('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900','Football kit donation to local youth team','Charity','image',true),
  ('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900','Open Soccer Day at Makerere','Events','image',true),
  ('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900','Brotherhood — off the pitch','Events','image',true),
  ('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900','Youth training session','Training','image',true),
  ('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900','Skills development workshop','Training','image',true),
  ('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900','Tethered Together Cup — trophy ceremony','Events','image',true),
  ('https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900','Makerere Main Mosque Library — our home','Events','image',false);

-- News
INSERT INTO news (title, description, published_date, image_url, is_featured, order_index) VALUES
  ('Kitebe Elites League 2025–2026 Season Officially Kicks Off','The Kitebe Elites League 2025–2026 has officially launched! Hawah Group: AMAGEZI, KISAZE, KIKUTIYA, ABAKAMANNYI, NTOGO STREET. Shadia Group: HF, EMBASSY, KIZZE, LEGENDS, STANZA. Every Sunday at Makerere Main Mosque Grounds.','2025-01-10','https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900',true,1),
  ('Kitebe Elites FC Visits Mulago National Referral Hospital','Members visited Mulago National Referral Hospital, spending time with patients. "Football gives us the platform; service gives us the purpose," — Isham Malamu, Team Captain.','2024-11-20','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900',true,2),
  ('Football Kit Donation: Empowering Grassroots Youth','Donated full football kits to three local youth teams. "We were once those kids playing barefoot. Now it is our turn to give back," — Bbosa Arafat, Welfare & Assistant Captain.','2024-10-05','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900',true,3),
  ('Open Soccer Day Draws 200+ to Makerere','Kitebe Elites FC hosted an Open Soccer Day drawing 200+ participants featuring matches, mentorship talks, and community celebration.','2024-07-01','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900',true,4),
  ('Kitebe Elites FC Launches Official Website & Social Media','Our official website is live at www.kitebeelites.com. Follow @kitebeelites on Instagram and TikTok for match updates, charity news, and brotherhood content.','2025-01-01','https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900',true,5);

-- League Groups
INSERT INTO league_groups (name, season, description) VALUES
  ('Hawah Group','2025-2026','Five competitive teams battling for Hawah Group honors in the Kitebe Elites League 2025–2026.'),
  ('Shadia Group','2025-2026','Five competitive teams competing for Shadia Group supremacy in the Kitebe Elites League 2025–2026.');

-- League Teams
INSERT INTO league_teams (group_id, name, short_code) VALUES
  ((SELECT id FROM league_groups WHERE name='Hawah Group'),  'AMAGEZI',      'AMG'),
  ((SELECT id FROM league_groups WHERE name='Hawah Group'),  'KISAZE',       'KSZ'),
  ((SELECT id FROM league_groups WHERE name='Hawah Group'),  'KIKUTIYA',     'KKT'),
  ((SELECT id FROM league_groups WHERE name='Hawah Group'),  'ABAKAMANNYI',  'ABK'),
  ((SELECT id FROM league_groups WHERE name='Hawah Group'),  'NTOGO STREET', 'NTS'),
  ((SELECT id FROM league_groups WHERE name='Shadia Group'), 'HF',           'HF'),
  ((SELECT id FROM league_groups WHERE name='Shadia Group'), 'EMBASSY',      'EMB'),
  ((SELECT id FROM league_groups WHERE name='Shadia Group'), 'KIZZE',        'KZZ'),
  ((SELECT id FROM league_groups WHERE name='Shadia Group'), 'LEGENDS',      'LGD'),
  ((SELECT id FROM league_groups WHERE name='Shadia Group'), 'STANZA',       'STZ');

-- League Standings (all zeroes — season just started)
INSERT INTO league_standings (group_id, team_id, season, played, won, drawn, lost, goals_for, goals_against)
SELECT t.group_id, t.id, '2025-2026', 0,0,0,0,0,0 FROM league_teams t;

-- Sample Fixtures
INSERT INTO league_fixtures (group_id, home_team_id, away_team_id, match_date, match_time, status) VALUES
  ((SELECT id FROM league_groups WHERE name='Hawah Group'),(SELECT id FROM league_teams WHERE name='AMAGEZI'),(SELECT id FROM league_teams WHERE name='KISAZE'),'2025-01-19','10:00','scheduled'),
  ((SELECT id FROM league_groups WHERE name='Hawah Group'),(SELECT id FROM league_teams WHERE name='KIKUTIYA'),(SELECT id FROM league_teams WHERE name='ABAKAMANNYI'),'2025-01-19','12:00','scheduled'),
  ((SELECT id FROM league_groups WHERE name='Hawah Group'),(SELECT id FROM league_teams WHERE name='NTOGO STREET'),(SELECT id FROM league_teams WHERE name='AMAGEZI'),'2025-01-26','10:00','scheduled'),
  ((SELECT id FROM league_groups WHERE name='Shadia Group'),(SELECT id FROM league_teams WHERE name='HF'),(SELECT id FROM league_teams WHERE name='EMBASSY'),'2025-01-19','10:00','scheduled'),
  ((SELECT id FROM league_groups WHERE name='Shadia Group'),(SELECT id FROM league_teams WHERE name='KIZZE'),(SELECT id FROM league_teams WHERE name='LEGENDS'),'2025-01-19','12:00','scheduled'),
  ((SELECT id FROM league_groups WHERE name='Shadia Group'),(SELECT id FROM league_teams WHERE name='STANZA'),(SELECT id FROM league_teams WHERE name='HF'),'2025-01-26','10:00','scheduled');

-- Members Roster
INSERT INTO members (member_number, full_name, role, committee, is_executive, joined_date) VALUES
  (20,'Chairman',            'Chairman',                    'Executive',true,'2020-01-01'),
  (8, 'Isham Malamu',        'Team Captain',                'Executive',true,'2020-01-01'),
  (4, 'Bbosa Arafat',        'Welfare & Assistant Captain', 'Executive',true,'2020-01-01'),
  (12,'Manager Katumba',     'General Duties (Operations)', 'Executive',true,'2020-01-01'),
  (13,'Member #13',          'Treasurer',                   'Executive',true,'2020-01-01'),
  (25,'Member #25',          'Publicity & Media',           'Executive',true,'2020-01-01'),
  (1, 'Member #1',  'Player','General',false,'2020-06-01'),
  (2, 'Member #2',  'Player','General',false,'2020-06-01'),
  (3, 'Member #3',  'Player','General',false,'2020-06-01'),
  (5, 'Member #5',  'Player','General',false,'2020-06-01'),
  (6, 'Member #6',  'Player','General',false,'2020-06-01'),
  (7, 'Member #7',  'Player','General',false,'2020-06-01'),
  (9, 'Member #9',  'Player','General',false,'2021-01-01'),
  (10,'Member #10', 'Player','General',false,'2021-01-01'),
  (11,'Member #11', 'Player','General',false,'2021-01-01'),
  (14,'Member #14', 'Player','General',false,'2021-01-01'),
  (15,'Member #15', 'Player','General',false,'2021-01-01'),
  (16,'Member #16', 'Player','General',false,'2021-06-01'),
  (17,'Member #17', 'Player','General',false,'2021-06-01'),
  (18,'Member #18', 'Player','General',false,'2022-01-01'),
  (19,'Member #19', 'Player','General',false,'2022-01-01'),
  (21,'Member #21', 'Player','General',false,'2022-01-01'),
  (22,'Member #22', 'Player','General',false,'2022-06-01'),
  (23,'Member #23', 'Player','General',false,'2023-01-01'),
  (24,'Member #24', 'Player','General',false,'2023-01-01');

-- Charity Visits
INSERT INTO charity_visits (title, location, visit_date, description, items_donated, beneficiaries, image_url, category, is_featured) VALUES
  ('Mulago National Referral Hospital Visit','Mulago National Referral Hospital, Kampala','2024-11-15','Members spent the afternoon at Mulago visiting patients across different wards, bringing food and community spirit.','Food packages, fruits, Islamic literature',45,'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900','Hospital Visit',true),
  ('Football Kit Donation to Bwaise Youth FC','Bwaise, Kampala','2024-09-20','Donated a full set of football kits to Bwaise Youth FC — 16 jerseys, shorts, socks, and 3 match-quality footballs.','16 jerseys, shorts, socks, 3 match footballs',30,'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900','Kit Donation',true),
  ('Open Soccer Day — Makerere Community','Makerere Main Mosque Grounds, Kampala','2024-06-28','Full-day Open Soccer Day welcoming 200+ community members. Featured matches, skills drills, and a mentorship panel.','Footballs, refreshments',200,'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900','Open Soccer Day',true),
  ('Tethered Together Cup Charity Tournament','Makerere Main Mosque Grounds, Kampala','2024-04-10','The inaugural Tethered Together Cup brought 8 community teams together. All proceeds went to the charity fund.','Prize kits, medals; UGX 2,500,000 raised',250,'https://images.unsplash.com/photo-1551958219-acbc338a7924?w=900','Community Outreach',true);

-- =====================================================
-- G. VERIFICATION COUNTS
-- =====================================================
-- Uncomment and run after setup to verify everything:

-- SELECT 'admins'            AS tbl, COUNT(*) FROM admins
-- UNION ALL SELECT 'footer_info',        COUNT(*) FROM footer_info
-- UNION ALL SELECT 'hello_slides',       COUNT(*) FROM hello_slides
-- UNION ALL SELECT 'about_us',           COUNT(*) FROM about_us
-- UNION ALL SELECT 'vision',             COUNT(*) FROM vision
-- UNION ALL SELECT 'mission',            COUNT(*) FROM mission
-- UNION ALL SELECT 'objectives',         COUNT(*) FROM objectives
-- UNION ALL SELECT 'programs',           COUNT(*) FROM programs
-- UNION ALL SELECT 'achievements',       COUNT(*) FROM achievements
-- UNION ALL SELECT 'core_values',        COUNT(*) FROM core_values
-- UNION ALL SELECT 'gallery',            COUNT(*) FROM gallery
-- UNION ALL SELECT 'news',               COUNT(*) FROM news
-- UNION ALL SELECT 'leadership',         COUNT(*) FROM leadership
-- UNION ALL SELECT 'league_groups',      COUNT(*) FROM league_groups
-- UNION ALL SELECT 'league_teams',       COUNT(*) FROM league_teams
-- UNION ALL SELECT 'league_fixtures',    COUNT(*) FROM league_fixtures
-- UNION ALL SELECT 'league_standings',   COUNT(*) FROM league_standings
-- UNION ALL SELECT 'members',            COUNT(*) FROM members
-- UNION ALL SELECT 'charity_visits',     COUNT(*) FROM charity_visits
-- UNION ALL SELECT 'payment_settings',   COUNT(*) FROM payment_settings
-- ORDER BY tbl;

-- =====================================================
-- END OF 05_COMPLETE_SETUP.sql
-- Kitebe Elites FC — Tethered Together
-- =====================================================
