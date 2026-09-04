-- ==============================================================================
-- FIX STORAGE POLICIES FOR ALL BUCKETS
-- Run this in your Supabase SQL Editor to allow the custom admin panel to upload files
-- ==============================================================================

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
    'achievements',
    'program-sponsors'
  ];
BEGIN
  FOREACH bucket_name IN ARRAY bucket_names
  LOOP
    
    -- Drop previous authenticated-only policies if they exist to avoid confusion
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS "Auth Insert %1$s" ON storage.objects;', bucket_name);
      EXECUTE format('DROP POLICY IF EXISTS "Auth Update %1$s" ON storage.objects;', bucket_name);
      EXECUTE format('DROP POLICY IF EXISTS "Auth Delete %1$s" ON storage.objects;', bucket_name);
    EXCEPTION WHEN OTHERS THEN
    END;

    -- Create Public Insert Policy (Allows custom admin to upload)
    BEGIN
      EXECUTE format('
        CREATE POLICY "Public Insert %1$s"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = %2$L);
      ', bucket_name, bucket_name);
    EXCEPTION WHEN duplicate_object THEN
    END;

    -- Create Public Update Policy
    BEGIN
      EXECUTE format('
        CREATE POLICY "Public Update %1$s"
        ON storage.objects FOR UPDATE
        USING (bucket_id = %2$L);
      ', bucket_name, bucket_name);
    EXCEPTION WHEN duplicate_object THEN
    END;

    -- Create Public Delete Policy
    BEGIN
      EXECUTE format('
        CREATE POLICY "Public Delete %1$s"
        ON storage.objects FOR DELETE
        USING (bucket_id = %2$L);
      ', bucket_name, bucket_name);
    EXCEPTION WHEN duplicate_object THEN
    END;

  END LOOP;
END $$;
