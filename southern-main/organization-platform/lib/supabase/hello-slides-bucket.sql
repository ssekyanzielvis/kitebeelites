-- Create the hello-slides bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('hello-slides', 'hello-slides', true)
ON CONFLICT (id) DO NOTHING;

-- Clean up old incorrect policies
DROP POLICY IF EXISTS "Authenticated users can upload to hello-slides" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update hello-slides" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete hello-slides" ON storage.objects;

-- Allow public read access to hello-slides
DROP POLICY IF EXISTS "Public users can view hello-slides" ON storage.objects;
CREATE POLICY "Public users can view hello-slides"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'hello-slides' );

-- Allow anyone to upload to hello-slides (admin is protected via Next.js middleware)
DROP POLICY IF EXISTS "Public can upload to hello-slides" ON storage.objects;
CREATE POLICY "Public can upload to hello-slides"
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'hello-slides' );

-- Allow anyone to update hello-slides
DROP POLICY IF EXISTS "Public can update hello-slides" ON storage.objects;
CREATE POLICY "Public can update hello-slides"
    ON storage.objects FOR UPDATE
    USING ( bucket_id = 'hello-slides' );

-- Allow anyone to delete hello-slides
DROP POLICY IF EXISTS "Public can delete hello-slides" ON storage.objects;
CREATE POLICY "Public can delete hello-slides"
    ON storage.objects FOR DELETE
    USING ( bucket_id = 'hello-slides' );
