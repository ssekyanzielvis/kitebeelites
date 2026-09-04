-- ==============================================================================
-- WHY DONATE RLS POLICY FIX
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- 1. Ensure RLS is enabled on the table
ALTER TABLE public.why_donate ENABLE ROW LEVEL SECURITY;

-- 2. Create the policy allowing anyone (including the admin dashboard) to read the data
DROP POLICY IF EXISTS "Public read access for why_donate" ON public.why_donate;
CREATE POLICY "Public read access for why_donate"
    ON public.why_donate FOR SELECT
    USING (true);
