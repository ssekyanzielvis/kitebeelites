-- Add logo and message to program sponsorships
ALTER TABLE public.program_sponsorships
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS message TEXT;

-- Create bucket for program sponsors
INSERT INTO storage.buckets (id, name, public)
VALUES ('program-sponsors', 'program-sponsors', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for program-sponsors bucket
DROP POLICY IF EXISTS "Public can view program-sponsors" ON storage.objects;
CREATE POLICY "Public can view program-sponsors"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'program-sponsors' );

DROP POLICY IF EXISTS "Public can upload to program-sponsors" ON storage.objects;
CREATE POLICY "Public can upload to program-sponsors"
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'program-sponsors' );
