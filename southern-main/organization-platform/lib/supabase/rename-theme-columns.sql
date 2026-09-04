-- ==============================================================================
-- FIX THEME SETTINGS COLUMNS
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- 1. Rename columns to include underscores, matching what the application code expects
ALTER TABLE public.theme_settings RENAME COLUMN backgroundcolor TO background_color;
ALTER TABLE public.theme_settings RENAME COLUMN textcolor TO text_color;
ALTER TABLE public.theme_settings RENAME COLUMN primarycolor TO primary_color;
ALTER TABLE public.theme_settings RENAME COLUMN fontfamily TO font_family;

-- 2. Force the Supabase API to reload the updated schema
NOTIFY pgrst, 'reload schema';
