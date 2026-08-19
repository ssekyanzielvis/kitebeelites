-- =====================================================
-- KITEBE ELITES FC — STORAGE BUCKETS
-- =====================================================
-- Creates all 15 Supabase Storage buckets:
--   12 original content buckets + 3 Kitebe-specific
-- Run in Supabase SQL Editor AFTER 01_schema.sql
-- =====================================================

-- =====================================================
-- PART 1: CREATE ALL STORAGE BUCKETS
-- =====================================================

-- 1. Hero Slides Bucket (images + videos for homepage carousel)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hello-slides', 'hello-slides', true,
  10485760,  -- 10 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']
) ON CONFLICT (id) DO UPDATE SET
  public              = true,
  file_size_limit     = 10485760,
  allowed_mime_types  = ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'];

-- 2. About Us Content Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'about-us', 'about-us', true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif'];

-- 3. Vision Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vision', 'vision', true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif'];

-- 4. Mission Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mission', 'mission', true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif'];

-- 5. Objectives Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'objectives', 'objectives', true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif'];

-- 6. Programs / Pillars Bucket (football, charity, youth, partnerships)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'programs', 'programs', true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'];

-- 7. Achievements Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'achievements', 'achievements', true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'];

-- 8. Core Values Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'core-values', 'core-values', true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif'];

-- 9. General Gallery Bucket (images and videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery', 'gallery', true,
  20971520,  -- 20 MB (larger for videos)
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml',
        'video/mp4','video/webm','video/quicktime','video/x-msvideo']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 20971520,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml',
                             'video/mp4','video/webm','video/quicktime','video/x-msvideo'];

-- 10. News / Updates Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news', 'news', true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'];

-- 11. Leadership / Executive Profiles Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'leadership', 'leadership', true,
  5242880,   -- 5 MB (profile photos only)
  ARRAY['image/jpeg','image/png','image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 5242880,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];

-- 12. Admin Profile Images Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'admin-profiles', 'admin-profiles', true,
  2097152,   -- 2 MB
  ARRAY['image/jpeg','image/png','image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 2097152,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];

-- =====================================================
-- KITEBE-SPECIFIC BUCKETS (3 new)
-- =====================================================

-- 13. Match Gallery Bucket (match-day photos & highlights)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'match-gallery', 'match-gallery', true,
  26214400,  -- 25 MB (for video highlights)
  ARRAY['image/jpeg','image/png','image/webp','image/gif',
        'video/mp4','video/webm','video/quicktime']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 26214400,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif',
                             'video/mp4','video/webm','video/quicktime'];

-- 14. Member Profiles Bucket (individual member photos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'member-profiles', 'member-profiles', true,
  5242880,   -- 5 MB
  ARRAY['image/jpeg','image/png','image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 5242880,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];

-- 15. Charity Events Bucket (hospital visits, kit donations, outreach)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'charity-events', 'charity-events', true,
  10485760,  -- 10 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm']
) ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'];

-- =====================================================
-- PART 2: STORAGE RLS POLICIES
-- =====================================================

-- Define the full list of bucket IDs for convenience
-- Buckets: hello-slides, about-us, vision, mission, objectives, programs,
--          achievements, core-values, gallery, news, leadership, admin-profiles,
--          match-gallery, member-profiles, charity-events

-- Policy: Allow public READ access to all buckets
DROP POLICY IF EXISTS "Public read all buckets" ON storage.objects;
CREATE POLICY "Public read all buckets"
  ON storage.objects FOR SELECT
  USING (bucket_id IN (
    'hello-slides','about-us','vision','mission','objectives',
    'programs','achievements','core-values','gallery','news',
    'leadership','admin-profiles',
    'match-gallery','member-profiles','charity-events'
  ));

-- Policy: Allow authenticated users (admins) to UPLOAD files
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
CREATE POLICY "Authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN (
      'hello-slides','about-us','vision','mission','objectives',
      'programs','achievements','core-values','gallery','news',
      'leadership','admin-profiles',
      'match-gallery','member-profiles','charity-events'
    )
    AND auth.role() = 'authenticated'
  );

-- Policy: Allow authenticated users (admins) to UPDATE files
DROP POLICY IF EXISTS "Authenticated update" ON storage.objects;
CREATE POLICY "Authenticated update"
  ON storage.objects FOR UPDATE
  WITH CHECK (
    bucket_id IN (
      'hello-slides','about-us','vision','mission','objectives',
      'programs','achievements','core-values','gallery','news',
      'leadership','admin-profiles',
      'match-gallery','member-profiles','charity-events'
    )
    AND auth.role() = 'authenticated'
  );

-- Policy: Allow authenticated users (admins) to DELETE files
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;
CREATE POLICY "Authenticated delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN (
      'hello-slides','about-us','vision','mission','objectives',
      'programs','achievements','core-values','gallery','news',
      'leadership','admin-profiles',
      'match-gallery','member-profiles','charity-events'
    )
    AND auth.role() = 'authenticated'
  );

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Run this to confirm all 15 buckets exist:
-- SELECT id, name, public,
--        pg_size_pretty(file_size_limit::BIGINT) AS max_file_size,
--        array_length(allowed_mime_types, 1) AS mime_type_count
-- FROM storage.buckets
-- ORDER BY name;

-- =====================================================
-- END OF 02_storage_buckets.sql
-- Run next: 03_rls_policies.sql
-- =====================================================
