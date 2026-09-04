-- ==============================================================================
-- CREATE KITEBE GRADUATES TABLE & BUCKET
-- Run this script in your Supabase SQL Editor
-- ==============================================================================

-- 1. Create the graduates table
CREATE TABLE IF NOT EXISTS public.graduates (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    full_name TEXT NOT NULL,
    profile_image_url TEXT,
    graduation_year INTEGER NOT NULL,
    course TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.graduates ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Select Policy (so visitors can see the graduates)
DROP POLICY IF EXISTS "Public can view active graduates" ON public.graduates;
CREATE POLICY "Public can view active graduates"
    ON public.graduates FOR SELECT
    USING (true); -- Custom admin relies on anon, so we allow SELECT for all

-- 4. Create the 'graduates' storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'graduates',
    'graduates',
    true,
    20971520, -- 20MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 20971520,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 5. Create Storage Policies for 'graduates' bucket
-- Allow public read
DROP POLICY IF EXISTS "Public Access graduates" ON storage.objects;
CREATE POLICY "Public Access graduates"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'graduates');

-- Allow anon (custom admin) to insert
DROP POLICY IF EXISTS "Public Insert graduates" ON storage.objects;
CREATE POLICY "Public Insert graduates"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'graduates');

-- Allow anon (custom admin) to update
DROP POLICY IF EXISTS "Public Update graduates" ON storage.objects;
CREATE POLICY "Public Update graduates"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'graduates');

-- Allow anon (custom admin) to delete
DROP POLICY IF EXISTS "Public Delete graduates" ON storage.objects;
CREATE POLICY "Public Delete graduates"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'graduates');
