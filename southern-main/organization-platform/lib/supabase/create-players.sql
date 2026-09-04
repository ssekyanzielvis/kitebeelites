-- Create the players table
CREATE TABLE public.players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    league_id UUID REFERENCES public.leagues(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    date_of_birth DATE,
    height TEXT,
    weight TEXT,
    speed TEXT,
    marital_status TEXT,
    networth TEXT,
    shirt_number TEXT,
    international_team TEXT,
    best_international_player TEXT,
    favourite_dish TEXT,
    smartest_player_chosen TEXT,
    profile_image_url TEXT,
    origin TEXT,
    academics TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on players"
    ON public.players
    FOR SELECT
    USING (true);

-- Allow authenticated users to manage players
CREATE POLICY "Allow authenticated full access on players"
    ON public.players
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create players bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('players', 'players', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for players bucket
CREATE POLICY "Public Access players"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'players' );

CREATE POLICY "Authenticated users can upload to players"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK ( bucket_id = 'players' );

CREATE POLICY "Authenticated users can update players"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING ( bucket_id = 'players' );

CREATE POLICY "Authenticated users can delete players"
    ON storage.objects FOR DELETE
    TO authenticated
    USING ( bucket_id = 'players' );
