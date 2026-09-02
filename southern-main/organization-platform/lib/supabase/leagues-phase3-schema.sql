-- Leagues Management Database Schema
-- Phase 3 (Results & Standings)

-- 1. Alter Fixtures to add Results fields
ALTER TABLE fixtures
ADD COLUMN home_score INTEGER,
ADD COLUMN away_score INTEGER,
ADD COLUMN match_report TEXT,
ADD COLUMN highlights_url TEXT;

-- 2. Create Standings Table
CREATE TABLE standings (
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
