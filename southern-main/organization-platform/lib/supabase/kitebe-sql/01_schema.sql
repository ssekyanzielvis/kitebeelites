-- =====================================================
-- KITEBE ELITES FC — DATABASE SCHEMA
-- =====================================================
-- Organization: Kitebe Elites FC
-- Motto: "Tethered Together"
-- Base: Makerere Main Mosque Library, Kampala, Uganda
-- Website: www.kitebeelites.com
-- =====================================================
-- Run order: 01_schema.sql → 02_storage_buckets.sql
--            → 03_rls_policies.sql → 04_initial_data.sql
-- =====================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- SECTION A: CORE PLATFORM TABLES
-- (Identical structure to original — all admins,
--  theming, footer, slides etc.)
-- =====================================================

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name        VARCHAR(255)  NOT NULL,
  email            VARCHAR(255)  UNIQUE NOT NULL,
  password_hash    TEXT          NOT NULL,
  phone_number     VARCHAR(20),
  image_url        TEXT,
  is_active        BOOLEAN       DEFAULT true,
  created_at       TIMESTAMPTZ   DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   DEFAULT NOW()
);

-- Site settings table (key-value store for global config)
CREATE TABLE IF NOT EXISTS site_settings (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key    VARCHAR(100)  UNIQUE NOT NULL,
  setting_value  TEXT,
  updated_at     TIMESTAMPTZ   DEFAULT NOW(),
  updated_by     UUID          REFERENCES admins(id)
);

-- Theme customization table
CREATE TABLE IF NOT EXISTS theme_settings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  backgroundColor   VARCHAR(7)    DEFAULT '#FFFFFF',
  textColor         VARCHAR(7)    DEFAULT '#111111',
  primaryColor      VARCHAR(7)    DEFAULT '#1B5E20',  -- Kitebe deep green
  fontFamily        VARCHAR(100)  DEFAULT 'Inter',
  updated_at        TIMESTAMPTZ   DEFAULT NOW(),
  updated_by        UUID          REFERENCES admins(id)
);

-- Footer information table
CREATE TABLE IF NOT EXISTS footer_info (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_name VARCHAR(255),
  location          TEXT,
  director          VARCHAR(255),   -- Chairman field
  email             VARCHAR(255),
  phone             VARCHAR(20),
  organization_type VARCHAR(100),
  primary_focus     TEXT,
  instagram_handle  VARCHAR(100),
  tiktok_handle     VARCHAR(100),
  website_url       VARCHAR(255),
  updated_at        TIMESTAMPTZ   DEFAULT NOW()
);

-- =====================================================
-- SECTION B: CONTENT / MARKETING TABLES
-- =====================================================

-- Hero / Hello Slides (homepage carousel)
CREATE TABLE IF NOT EXISTS hello_slides (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url    TEXT         NOT NULL,
  description  TEXT,
  order_index  INTEGER      DEFAULT 0,
  direction    VARCHAR(10)  DEFAULT 'left',  -- 'left' | 'right'
  is_active    BOOLEAN      DEFAULT true,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- About Us content
CREATE TABLE IF NOT EXISTS about_us (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url    TEXT,
  description  TEXT         NOT NULL,
  order_index  INTEGER      DEFAULT 0,
  is_active    BOOLEAN      DEFAULT true,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- Vision
CREATE TABLE IF NOT EXISTS vision (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url   TEXT,
  statement   TEXT        NOT NULL,
  is_active   BOOLEAN     DEFAULT true,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Mission
CREATE TABLE IF NOT EXISTS mission (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url   TEXT,
  statement   TEXT        NOT NULL,
  is_active   BOOLEAN     DEFAULT true,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Objectives / Goals
CREATE TABLE IF NOT EXISTS objectives (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url    TEXT,
  statement    TEXT        NOT NULL,
  order_index  INTEGER     DEFAULT 0,
  is_active    BOOLEAN     DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Programs / Pillars  (Community Football, Charity, Youth, Partnerships)
CREATE TABLE IF NOT EXISTS programs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url    TEXT         NOT NULL,
  title        VARCHAR(255) NOT NULL,
  description  TEXT         NOT NULL,
  order_index  INTEGER      DEFAULT 0,
  is_featured  BOOLEAN      DEFAULT false,
  is_active    BOOLEAN      DEFAULT true,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url         TEXT         NOT NULL,
  title             VARCHAR(255) NOT NULL,
  description       TEXT         NOT NULL,
  achievement_date  DATE         NOT NULL,
  order_index       INTEGER      DEFAULT 0,
  is_featured       BOOLEAN      DEFAULT false,
  is_active         BOOLEAN      DEFAULT true,
  created_at        TIMESTAMPTZ  DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  DEFAULT NOW()
);

-- Core Values
CREATE TABLE IF NOT EXISTS core_values (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url    TEXT         NOT NULL,
  title        VARCHAR(255) NOT NULL,
  description  TEXT         NOT NULL,
  order_index  INTEGER      DEFAULT 0,
  is_featured  BOOLEAN      DEFAULT false,
  is_active    BOOLEAN      DEFAULT true,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- Gallery (general, football events, charity)
CREATE TABLE IF NOT EXISTS gallery (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url    TEXT         NOT NULL,
  description  TEXT,
  category     VARCHAR(100),  -- 'Matches', 'Charity', 'Events', 'Training', 'Off-Pitch'
  media_type   VARCHAR(10)  DEFAULT 'image',  -- 'image' | 'video'
  order_index  INTEGER      DEFAULT 0,
  is_featured  BOOLEAN      DEFAULT false,
  is_active    BOOLEAN      DEFAULT true,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- News / Updates
CREATE TABLE IF NOT EXISTS news (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url       TEXT         NOT NULL,
  title           VARCHAR(255) NOT NULL,
  description     TEXT         NOT NULL,
  published_date  DATE         NOT NULL,
  order_index     INTEGER      DEFAULT 0,
  is_featured     BOOLEAN      DEFAULT false,
  is_active       BOOLEAN      DEFAULT true,
  created_at      TIMESTAMPTZ  DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  DEFAULT NOW()
);

-- Leadership / Executive Team
CREATE TABLE IF NOT EXISTS leadership (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url    TEXT         NOT NULL,
  full_name    VARCHAR(255) NOT NULL,
  title        VARCHAR(255) NOT NULL,   -- e.g. "Team Captain"
  role_detail  TEXT,                   -- extra context / bio
  achievement  TEXT,                   -- career/leadership highlights
  member_number INTEGER,               -- e.g. Member #8
  order_index  INTEGER      DEFAULT 0,
  is_featured  BOOLEAN      DEFAULT false,
  is_active    BOOLEAN      DEFAULT true,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- =====================================================
-- SECTION C: ENGAGEMENT TABLES
-- =====================================================

-- Contact submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name     VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone_number  VARCHAR(20),
  gender        VARCHAR(20),
  residence     TEXT,
  message       TEXT,
  is_contacted  BOOLEAN      DEFAULT false,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- Donations (for charity fund support)
CREATE TABLE IF NOT EXISTS donations (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name         VARCHAR(255) NOT NULL,
  donor_email        VARCHAR(255),
  donor_phone        VARCHAR(20),
  amount             DECIMAL(10,2) NOT NULL,
  payment_method     VARCHAR(50)  NOT NULL,   -- 'mtn', 'airtel', 'card', 'manual'
  payment_reference  VARCHAR(255),
  receipt_number     VARCHAR(50)  UNIQUE,
  receipt_generated  BOOLEAN      DEFAULT false,
  receipt_url        TEXT,
  purpose            VARCHAR(255) DEFAULT 'General Fund', -- 'Kit Donation', 'Hospital Visit', etc.
  created_at         TIMESTAMPTZ  DEFAULT NOW()
);

-- Payment settings (MTN / Airtel numbers for donation page)
CREATE TABLE IF NOT EXISTS payment_settings (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mtn_number                  VARCHAR(20),
  mtn_name                    VARCHAR(255),
  airtel_number               VARCHAR(20),
  airtel_name                 VARCHAR(255),
  manual_payment_instructions TEXT,
  updated_at                  TIMESTAMPTZ  DEFAULT NOW()
);

-- Analytics (page view tracking)
CREATE TABLE IF NOT EXISTS analytics (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path    VARCHAR(255),
  visitor_id   VARCHAR(100),
  session_id   VARCHAR(100),
  action_type  VARCHAR(50)   DEFAULT 'page_view',
  visitor_ip   VARCHAR(45),
  device_type  VARCHAR(20),
  country      VARCHAR(100),
  user_agent   TEXT,
  referrer     TEXT,
  visited_at   TIMESTAMPTZ   DEFAULT NOW()
);

-- Staff applications
CREATE TABLE IF NOT EXISTS staff_applications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name    VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  phone        VARCHAR(20)  NOT NULL,
  nationality  VARCHAR(100),
  sex          VARCHAR(20),
  dob          DATE,
  is_approved  BOOLEAN      DEFAULT false,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- Volunteer applications
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name   VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  address     TEXT,
  skills      TEXT,
  is_approved BOOLEAN      DEFAULT false,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
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
  is_approved       BOOLEAN      DEFAULT false,
  created_at        TIMESTAMPTZ  DEFAULT NOW()
);

-- =====================================================
-- SECTION D: KITEBE ELITES FC — FOOTBALL-SPECIFIC TABLES
-- =====================================================

-- League Groups (Hawah Group & Shadia Group)
CREATE TABLE IF NOT EXISTS league_groups (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(255) NOT NULL,       -- e.g. 'Hawah Group'
  season       VARCHAR(20)  NOT NULL,       -- e.g. '2025-2026'
  description  TEXT,
  is_active    BOOLEAN      DEFAULT true,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- League Teams (10 teams across 2 groups)
CREATE TABLE IF NOT EXISTS league_teams (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id     UUID         NOT NULL REFERENCES league_groups(id) ON DELETE CASCADE,
  name         VARCHAR(255) NOT NULL,       -- e.g. 'AMAGEZI', 'HF', 'EMBASSY'
  short_code   VARCHAR(10),                 -- e.g. 'AMG', 'HF'
  logo_url     TEXT,
  captain      VARCHAR(255),
  home_ground  VARCHAR(255) DEFAULT 'Makerere Main Mosque Grounds',
  is_active    BOOLEAN      DEFAULT true,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- League Fixtures / Match Schedule
CREATE TABLE IF NOT EXISTS league_fixtures (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id       UUID         NOT NULL REFERENCES league_groups(id),
  home_team_id   UUID         NOT NULL REFERENCES league_teams(id),
  away_team_id   UUID         NOT NULL REFERENCES league_teams(id),
  match_date     DATE,
  match_time     TIME,
  venue          VARCHAR(255) DEFAULT 'Makerere Main Mosque Grounds',
  home_score     INTEGER,                   -- NULL = not played yet
  away_score     INTEGER,
  status         VARCHAR(20)  DEFAULT 'scheduled',  -- 'scheduled' | 'played' | 'postponed' | 'cancelled'
  match_notes    TEXT,
  created_at     TIMESTAMPTZ  DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  DEFAULT NOW(),
  CONSTRAINT chk_different_teams CHECK (home_team_id <> away_team_id)
);

-- League Standings (auto-computed or manually maintained)
CREATE TABLE IF NOT EXISTS league_standings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id        UUID    NOT NULL REFERENCES league_groups(id),
  team_id         UUID    NOT NULL REFERENCES league_teams(id),
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

-- Match Gallery (match-day photos and videos)
CREATE TABLE IF NOT EXISTS match_gallery (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fixture_id  UUID         REFERENCES league_fixtures(id) ON DELETE SET NULL,
  image_url   TEXT         NOT NULL,
  caption     TEXT,
  media_type  VARCHAR(10)  DEFAULT 'image',  -- 'image' | 'video'
  is_featured BOOLEAN      DEFAULT false,
  is_active   BOOLEAN      DEFAULT true,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- Members / Full Roster (20+ registered members)
CREATE TABLE IF NOT EXISTS members (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_number     INTEGER      UNIQUE,             -- Official member # (e.g. #8, #20)
  full_name         VARCHAR(255) NOT NULL,
  nickname          VARCHAR(100),
  role              VARCHAR(255),                    -- e.g. 'Team Captain', 'Treasurer'
  committee         VARCHAR(255),                    -- e.g. 'Executive', 'General'
  profession        VARCHAR(255),                    -- e.g. 'Software Engineer'
  field_of_study    VARCHAR(255),                    -- e.g. 'Biomedical Technology'
  phone             VARCHAR(20),
  email             VARCHAR(255),
  image_url         TEXT,
  jersey_number     INTEGER,
  position          VARCHAR(50),                     -- Football position
  is_executive      BOOLEAN      DEFAULT false,
  is_active         BOOLEAN      DEFAULT true,
  joined_date       DATE,
  created_at        TIMESTAMPTZ  DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  DEFAULT NOW()
);

-- Charity & Social Outreach Visits
CREATE TABLE IF NOT EXISTS charity_visits (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           VARCHAR(255) NOT NULL,             -- e.g. 'Hospital Visit — Mulago'
  location        VARCHAR(255) NOT NULL,
  visit_date      DATE         NOT NULL,
  description     TEXT,
  items_donated   TEXT,                              -- e.g. 'Football kits, jerseys, 5 balls'
  beneficiaries   INTEGER,                           -- Number of people reached
  image_url       TEXT,
  category        VARCHAR(100) DEFAULT 'Hospital Visit',  -- 'Hospital Visit' | 'Kit Donation' | 'Open Soccer Day' | 'Community Outreach'
  is_featured     BOOLEAN      DEFAULT false,
  is_active       BOOLEAN      DEFAULT true,
  created_at      TIMESTAMPTZ  DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  DEFAULT NOW()
);

-- =====================================================
-- SECTION E: INDEXES
-- =====================================================

-- Core content indexes
CREATE INDEX IF NOT EXISTS idx_hello_slides_order        ON hello_slides(order_index);
CREATE INDEX IF NOT EXISTS idx_about_us_order            ON about_us(order_index);
CREATE INDEX IF NOT EXISTS idx_objectives_order          ON objectives(order_index);
CREATE INDEX IF NOT EXISTS idx_programs_order            ON programs(order_index);
CREATE INDEX IF NOT EXISTS idx_achievements_order        ON achievements(order_index);
CREATE INDEX IF NOT EXISTS idx_core_values_order         ON core_values(order_index);
CREATE INDEX IF NOT EXISTS idx_gallery_order             ON gallery(order_index);
CREATE INDEX IF NOT EXISTS idx_gallery_category          ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_news_order                ON news(order_index);
CREATE INDEX IF NOT EXISTS idx_leadership_order          ON leadership(order_index);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_visited_at      ON analytics(visited_at);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor_id      ON analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id      ON analytics(session_id);

-- Contact & donations indexes
CREATE INDEX IF NOT EXISTS idx_contact_created_at        ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_created_at      ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_receipt         ON donations(receipt_number);

-- Football-specific indexes
CREATE INDEX IF NOT EXISTS idx_league_teams_group        ON league_teams(group_id);
CREATE INDEX IF NOT EXISTS idx_fixtures_group            ON league_fixtures(group_id);
CREATE INDEX IF NOT EXISTS idx_fixtures_date             ON league_fixtures(match_date);
CREATE INDEX IF NOT EXISTS idx_standings_group           ON league_standings(group_id);
CREATE INDEX IF NOT EXISTS idx_standings_points          ON league_standings(points DESC);
CREATE INDEX IF NOT EXISTS idx_members_number            ON members(member_number);
CREATE INDEX IF NOT EXISTS idx_charity_visits_date       ON charity_visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_match_gallery_fixture     ON match_gallery(fixture_id);

-- =====================================================
-- SECTION F: AUTO-UPDATE TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
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
       CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END
$$;

-- =====================================================
-- END OF 01_schema.sql
-- Run next: 02_storage_buckets.sql
-- =====================================================
