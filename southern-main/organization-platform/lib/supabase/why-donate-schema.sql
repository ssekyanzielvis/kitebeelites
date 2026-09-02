-- =====================================================
-- WHY WE DONATE SCHEMA
-- =====================================================

CREATE TABLE IF NOT EXISTS why_donate (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_url TEXT,
  media_type VARCHAR(50) DEFAULT 'image', -- 'image' or 'video'
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: We'll reuse the existing 'content' bucket for any media uploaded here.
