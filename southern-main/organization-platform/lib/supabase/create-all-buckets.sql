-- ==============================================================================
-- CREATE ALL STORAGE BUCKETS FOR KITEBE ELITES FC
-- Run this in your Supabase SQL Editor to create all necessary buckets
-- ==============================================================================

-- Array of bucket names used in the application
DO $$
DECLARE
  bucket_name TEXT;
  bucket_names TEXT[] := ARRAY[
    'content',
    'programs',
    'admin-profiles',
    'hello-slides',
    'news',
    'leagues',
    'leadership',
    'gallery',
    'core-values',
    'vision',
    'mission',
    'about-us',
    'objectives',
    'achievements'
  ];
BEGIN
  FOREACH bucket_name IN ARRAY bucket_names
  LOOP
    -- 1. Create the bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      bucket_name,
      bucket_name,
      true,
      20971520, -- 20MB limit
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime', 'application/pdf']
    )
    ON CONFLICT (id) DO UPDATE SET
      public = true,
      file_size_limit = 20971520,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime', 'application/pdf'];

    -- 2. Create Public Read Policy
    BEGIN
      EXECUTE format('
        CREATE POLICY "Public Access %1$s"
        ON storage.objects FOR SELECT
        USING (bucket_id = %2$L);
      ', bucket_name, bucket_name);
    EXCEPTION WHEN duplicate_object THEN
      -- Ignore if policy already exists
    END;

    -- 3. Create Authenticated Insert Policy
    BEGIN
      EXECUTE format('
        CREATE POLICY "Auth Insert %1$s"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = %2$L AND auth.role() = ''authenticated'');
      ', bucket_name, bucket_name);
    EXCEPTION WHEN duplicate_object THEN
    END;

    -- 4. Create Authenticated Update Policy
    BEGIN
      EXECUTE format('
        CREATE POLICY "Auth Update %1$s"
        ON storage.objects FOR UPDATE
        WITH CHECK (bucket_id = %2$L AND auth.role() = ''authenticated'');
      ', bucket_name, bucket_name);
    EXCEPTION WHEN duplicate_object THEN
    END;

    -- 5. Create Authenticated Delete Policy
    BEGIN
      EXECUTE format('
        CREATE POLICY "Auth Delete %1$s"
        ON storage.objects FOR DELETE
        USING (bucket_id = %2$L AND auth.role() = ''authenticated'');
      ', bucket_name, bucket_name);
    EXCEPTION WHEN duplicate_object THEN
    END;

  END LOOP;
END $$;
