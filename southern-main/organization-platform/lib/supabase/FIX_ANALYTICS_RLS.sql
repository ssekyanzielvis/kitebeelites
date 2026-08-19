-- Fix analytics RLS and table structure
-- Run this in Supabase SQL Editor

-- Disable RLS on analytics to allow public inserts
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;

-- Drop and recreate analytics table with correct structure
DROP TABLE IF EXISTS analytics CASCADE;

CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path VARCHAR(255),
  visitor_id VARCHAR(100),
  session_id VARCHAR(100),
  action_type VARCHAR(50) DEFAULT 'page_view',
  visitor_ip VARCHAR(45),
  device_type VARCHAR(20),
  country VARCHAR(100),
  user_agent TEXT,
  referrer TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_analytics_visited_at ON analytics(visited_at);
CREATE INDEX idx_analytics_visitor_id ON analytics(visitor_id);
CREATE INDEX idx_analytics_session_id ON analytics(session_id);
