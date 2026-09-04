-- ==============================================================================
-- RELOAD SUPABASE SCHEMA CACHE
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- This command forces the Supabase API (PostgREST) to reload the database schema.
-- It resolves errors like: "Could not find the '...' column of '...' in the schema cache"
NOTIFY pgrst, 'reload schema';
