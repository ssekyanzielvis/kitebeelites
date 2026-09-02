-- ==============================================================================
-- STORAGE BUCKET: gallery
-- Kitebe Elites FC — Gallery Images & Videos
-- ------------------------------------------------------------------------------
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Creates the storage bucket for all gallery photos and videos uploaded by admin.
-- ==============================================================================

DO $$
BEGIN

  -- ============================================================
  -- 1. CREATE BUCKET
  --    Public bucket so all visitors can view gallery media.
  --    20 MB limit. Supports images AND videos.
  -- ============================================================
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'gallery',
    'gallery',
    true,
    20971520, -- 20 MB
    ARRAY[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/avi'
    ]
  )
  ON CONFLICT (id) DO UPDATE SET
    public             = true,
    file_size_limit    = 20971520,
    allowed_mime_types = ARRAY[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/avi'
    ];

  -- ============================================================
  -- 2. PUBLIC READ POLICY
  --    All visitors (including unauthenticated) can view gallery
  --    media on the public /gallery page.
  -- ============================================================
  BEGIN
    CREATE POLICY "gallery: public read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'gallery');
  EXCEPTION WHEN duplicate_object THEN
    -- Already exists, skip
  END;

  -- ============================================================
  -- 3. PUBLIC UPLOAD POLICY (INSERT)
  --    The admin panel uploads through the server-side API route
  --    (/api/upload) which uses the service-role key, so this
  --    policy allows all uploads. The Supabase client in the
  --    admin gallery page uploads directly from the browser
  --    (anon key) so this policy is required.
  -- ============================================================
  BEGIN
    CREATE POLICY "gallery: public upload"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'gallery');
  EXCEPTION WHEN duplicate_object THEN
    -- Already exists, skip
  END;

  -- ============================================================
  -- 4. AUTHENTICATED UPDATE POLICY
  --    Only admin users (authenticated) can overwrite files.
  -- ============================================================
  BEGIN
    CREATE POLICY "gallery: admin update"
      ON storage.objects FOR UPDATE
      USING  (bucket_id = 'gallery' AND auth.role() = 'authenticated')
      WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN
    -- Already exists, skip
  END;

  -- ============================================================
  -- 5. AUTHENTICATED DELETE POLICY
  --    Only admin users (authenticated) can delete gallery files.
  -- ============================================================
  BEGIN
    CREATE POLICY "gallery: admin delete"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN
    -- Already exists, skip
  END;

END $$;

-- ==============================================================================
-- VERIFICATION — run after the block above to confirm the bucket exists
-- ==============================================================================
SELECT
  id                AS bucket_id,
  name              AS bucket_name,
  public            AS is_public,
  (file_size_limit / 1048576.0)::NUMERIC(6,1) AS size_limit_mb,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'gallery';
