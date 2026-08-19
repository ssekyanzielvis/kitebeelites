-- FIX STORAGE RLS POLICY ERRORS
-- Run this in Supabase SQL Editor to allow file uploads

-- =============================================================================
-- DISABLE RLS ON STORAGE (For Development Only)
-- =============================================================================

-- Option 1: Disable RLS completely (easiest for development)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- CREATE ADMINS TABLE (if not exists)
-- =============================================================================

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  phone_number TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS on admins table for development
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- VERIFY STORAGE BUCKETS EXIST
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('admin-profiles', 'admin-profiles', true),
  ('hello-slides', 'hello-slides', true),
  ('gallery', 'gallery', true),
  ('programs', 'programs', true),
  ('achievements', 'achievements', true),
  ('news', 'news', true),
  ('leadership', 'leadership', true),
  ('core-values', 'core-values', true),
  ('about-us', 'about-us', true),
  ('vision', 'vision', true),
  ('mission', 'mission', true),
  ('objectives', 'objectives', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- =============================================================================
-- VERIFICATION
-- =============================================================================

SELECT '✅ Storage RLS disabled - uploads should work now' AS message;
SELECT 'Buckets available: ' || COUNT(*)::text AS bucket_status FROM storage.buckets;
SELECT 'Admins table ready: ' || CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admins') THEN 'Yes' ELSE 'No' END AS admin_table_status;
