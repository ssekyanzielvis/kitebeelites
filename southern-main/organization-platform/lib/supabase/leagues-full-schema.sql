-- ==========================================
-- FULL LEAGUES MANAGEMENT SCHEMA
-- Phases 1, 2, and 3 Combined
-- ==========================================

-- 1. Leagues Table
CREATE TABLE IF NOT EXISTS leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(100),
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  sport VARCHAR(100),
  competition_type VARCHAR(100),
  season VARCHAR(100),
  gender VARCHAR(100),
  age_category VARCHAR(100),
  location TEXT,
  venue TEXT,
  organizer VARCHAR(255),
  logo_url TEXT,
  cover_url TEXT,
  status VARCHAR(100) DEFAULT 'Draft',
  start_date DATE,
  end_date DATE,
  reg_start_date DATE,
  reg_end_date DATE,
  is_active BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. League Media Table
CREATE TABLE IF NOT EXISTS league_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  description TEXT,
  location VARCHAR(255),
  manager VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Fixtures Table
CREATE TABLE IF NOT EXISTS fixtures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  home_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  match_date TIMESTAMP WITH TIME ZONE,
  venue VARCHAR(255),
  status VARCHAR(100) DEFAULT 'Scheduled',
  match_type VARCHAR(100),
  home_score INTEGER,
  away_score INTEGER,
  match_report TEXT,
  highlights_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Standings Table
CREATE TABLE IF NOT EXISTS standings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(league_id, team_id)
);

-- =====================================================
-- STORAGE BUCKET FOR LEAGUES
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'leagues',
  'leagues',
  true,
  20971520, -- 20MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];

-- Policy: Allow public read access to leagues bucket
CREATE POLICY "Public Access leagues"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'leagues');

-- Policy: Allow authenticated users (admins) to upload/update/delete
CREATE POLICY "Auth users can upload leagues"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'leagues' AND auth.role() = 'authenticated');

CREATE POLICY "Auth users can update leagues"
  ON storage.objects FOR UPDATE
  WITH CHECK (bucket_id = 'leagues' AND auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete leagues"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'leagues' AND auth.role() = 'authenticated');
