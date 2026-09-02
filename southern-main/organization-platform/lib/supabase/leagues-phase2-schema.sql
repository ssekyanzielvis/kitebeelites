-- Leagues Management Database Schema
-- Phase 2 (Fixtures)

-- 1. Fixtures Table
CREATE TABLE fixtures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  home_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  match_date TIMESTAMP WITH TIME ZONE,
  venue VARCHAR(255),
  status VARCHAR(100) DEFAULT 'Scheduled',
  match_type VARCHAR(100), -- e.g. "Group Stage", "Final"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
