-- Enable RLS (if not already enabled)
ALTER TABLE public.program_sponsorships ENABLE ROW LEVEL SECURITY;

-- Allow public to view program sponsorships (so Admin and Visitors can fetch them)
DROP POLICY IF EXISTS "Public can view program sponsorships" ON public.program_sponsorships;
CREATE POLICY "Public can view program sponsorships"
    ON public.program_sponsorships FOR SELECT
    USING (true);

-- Allow public to insert program sponsorships (for the application form)
DROP POLICY IF EXISTS "Public can insert program sponsorships" ON public.program_sponsorships;
CREATE POLICY "Public can insert program sponsorships"
    ON public.program_sponsorships FOR INSERT
    WITH CHECK (true);
