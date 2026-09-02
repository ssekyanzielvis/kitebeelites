-- ==============================================================================
-- STORAGE BUCKET: member-profiles
-- Community Membership System — Kitebe Elites FC
-- ------------------------------------------------------------------------------
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This creates the storage bucket for community member profile images and sets
-- all required access policies.
-- ==============================================================================

DO $$
BEGIN

  -- ============================================================
  -- 1. CREATE BUCKET
  --    Public bucket so profile images are viewable by anyone.
  --    5 MB limit. Images only (jpeg, png, webp, gif).
  -- ============================================================
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'member-profiles',
    'member-profiles',
    true,
    5242880, -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
  ON CONFLICT (id) DO UPDATE SET
    public             = true,
    file_size_limit    = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  -- ============================================================
  -- 2. PUBLIC READ POLICY
  --    Anyone (even unauthenticated visitors) can view profile
  --    images — needed for the public /members directory.
  -- ============================================================
  BEGIN
    CREATE POLICY "member-profiles: public read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'member-profiles');
  EXCEPTION WHEN duplicate_object THEN
    -- Policy already exists, skip
  END;

  -- ============================================================
  -- 3. PUBLIC UPLOAD POLICY (INSERT)
  --    Approved members complete their profile via a one-time
  --    token link — they are NOT authenticated Supabase users,
  --    so upload must be allowed without authentication.
  --    The token validation is enforced server-side in the API.
  -- ============================================================
  BEGIN
    CREATE POLICY "member-profiles: public upload"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'member-profiles');
  EXCEPTION WHEN duplicate_object THEN
    -- Policy already exists, skip
  END;

  -- ============================================================
  -- 4. AUTHENTICATED UPDATE POLICY
  --    Only authenticated admin users can overwrite existing
  --    profile images (e.g. replacing a photo from the admin
  --    panel in the future).
  -- ============================================================
  BEGIN
    CREATE POLICY "member-profiles: admin update"
      ON storage.objects FOR UPDATE
      USING  (bucket_id = 'member-profiles' AND auth.role() = 'authenticated')
      WITH CHECK (bucket_id = 'member-profiles' AND auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN
    -- Policy already exists, skip
  END;

  -- ============================================================
  -- 5. AUTHENTICATED DELETE POLICY
  --    Only authenticated admin users can delete profile images.
  -- ============================================================
  BEGIN
    CREATE POLICY "member-profiles: admin delete"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'member-profiles' AND auth.role() = 'authenticated');
  EXCEPTION WHEN duplicate_object THEN
    -- Policy already exists, skip
  END;

END $$;

-- ==============================================================================
-- VERIFICATION
-- Run the SELECT below after the block above to confirm the bucket was created.
-- ==============================================================================
SELECT
  id                AS bucket_id,
  name              AS bucket_name,
  public            AS is_public,
  file_size_limit   AS size_limit_bytes,
  (file_size_limit / 1048576.0)::NUMERIC(6,2) AS size_limit_mb,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'member-profiles';
