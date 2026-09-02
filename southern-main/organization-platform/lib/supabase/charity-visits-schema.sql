-- =====================================================
-- CHARITY VISITS SCHEMA
-- =====================================================

CREATE TABLE IF NOT EXISTS charity_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  visit_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Upcoming', -- 'Upcoming' or 'Completed'
  objective TEXT,
  activities TEXT,
  estimated_budget_ugx NUMERIC,
  actual_spent_ugx NUMERIC,
  impact_summary TEXT,
  main_media_url TEXT,
  main_media_type VARCHAR(50) DEFAULT 'image', -- 'image' or 'video'
  funders JSONB DEFAULT '[]'::jsonb, -- Array of objects: { name: string, logo_url: string, type: string }
  gallery JSONB DEFAULT '[]'::jsonb, -- Array of media URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
