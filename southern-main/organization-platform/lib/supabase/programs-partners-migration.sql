-- 1. Create partners table
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    organization_name TEXT NOT NULL,
    business_name TEXT,
    logo_url TEXT,
    offer TEXT NOT NULL,
    email TEXT NOT NULL,
    nationality TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for partners
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active partners
CREATE POLICY "Allow public read on active partners"
    ON public.partners
    FOR SELECT
    TO public
    USING (is_active = true);

-- Allow authenticated full access on partners
CREATE POLICY "Allow authenticated full access on partners"
    ON public.partners
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Create partner-logos storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for partner-logos bucket
CREATE POLICY "Public Access partner_logos"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'partner-logos' );

CREATE POLICY "Authenticated users can upload to partner_logos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK ( bucket_id = 'partner-logos' );

CREATE POLICY "Authenticated users can update partner_logos"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING ( bucket_id = 'partner-logos' );

CREATE POLICY "Authenticated users can delete partner_logos"
    ON storage.objects FOR DELETE
    TO authenticated
    USING ( bucket_id = 'partner-logos' );


-- 3. Alter programs table to add start_date, end_date, and budget_items
ALTER TABLE public.programs
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS budget_items JSONB DEFAULT '[]'::jsonb;

-- 4. Create program_sponsorships table
CREATE TABLE IF NOT EXISTS public.program_sponsorships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    amount_or_item TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for program_sponsorships
ALTER TABLE public.program_sponsorships ENABLE ROW LEVEL SECURITY;

-- Allow public to insert sponsorship applications
CREATE POLICY "Allow public insert on program_sponsorships"
    ON public.program_sponsorships
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow authenticated to manage sponsorship applications
CREATE POLICY "Allow authenticated full access on program_sponsorships"
    ON public.program_sponsorships
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
