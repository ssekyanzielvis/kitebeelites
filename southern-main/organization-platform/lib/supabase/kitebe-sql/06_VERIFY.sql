-- =====================================================
-- KITEBE ELITES FC — VERIFICATION QUERIES
-- =====================================================
-- Run these queries in Supabase SQL Editor AFTER
-- running 05_COMPLETE_SETUP.sql to confirm everything
-- is set up correctly.
-- =====================================================

-- =====================================================
-- 1. TABLE ROW COUNTS
-- =====================================================
-- Expected counts after a fresh setup:
--   admins           : 1
--   footer_info      : 1
--   hello_slides     : 4
--   about_us         : 3
--   vision           : 1
--   mission          : 1
--   objectives       : 5
--   programs         : 4
--   achievements     : 5
--   core_values      : 5
--   gallery          : 12
--   news             : 5
--   leadership       : 6
--   league_groups    : 2
--   league_teams     : 10
--   league_fixtures  : 6
--   league_standings : 10
--   members          : 25
--   charity_visits   : 4
--   payment_settings : 1

SELECT
  'admins'           AS table_name, COUNT(*) AS row_count FROM admins
UNION ALL SELECT 'footer_info',        COUNT(*) FROM footer_info
UNION ALL SELECT 'theme_settings',     COUNT(*) FROM theme_settings
UNION ALL SELECT 'payment_settings',   COUNT(*) FROM payment_settings
UNION ALL SELECT 'hello_slides',       COUNT(*) FROM hello_slides
UNION ALL SELECT 'about_us',           COUNT(*) FROM about_us
UNION ALL SELECT 'vision',             COUNT(*) FROM vision
UNION ALL SELECT 'mission',            COUNT(*) FROM mission
UNION ALL SELECT 'objectives',         COUNT(*) FROM objectives
UNION ALL SELECT 'programs',           COUNT(*) FROM programs
UNION ALL SELECT 'achievements',       COUNT(*) FROM achievements
UNION ALL SELECT 'core_values',        COUNT(*) FROM core_values
UNION ALL SELECT 'gallery',            COUNT(*) FROM gallery
UNION ALL SELECT 'news',               COUNT(*) FROM news
UNION ALL SELECT 'leadership',         COUNT(*) FROM leadership
UNION ALL SELECT 'league_groups',      COUNT(*) FROM league_groups
UNION ALL SELECT 'league_teams',       COUNT(*) FROM league_teams
UNION ALL SELECT 'league_fixtures',    COUNT(*) FROM league_fixtures
UNION ALL SELECT 'league_standings',   COUNT(*) FROM league_standings
UNION ALL SELECT 'members',            COUNT(*) FROM members
UNION ALL SELECT 'charity_visits',     COUNT(*) FROM charity_visits
ORDER BY table_name;

-- =====================================================
-- 2. STORAGE BUCKETS (should return 15 rows)
-- =====================================================
SELECT
  id,
  name,
  public,
  pg_size_pretty(file_size_limit::BIGINT) AS max_file_size,
  array_length(allowed_mime_types, 1)     AS mime_types
FROM storage.buckets
ORDER BY name;

-- =====================================================
-- 3. FOOTER INFO (confirm org name is Kitebe Elites FC)
-- =====================================================
SELECT
  organization_name,
  location,
  director,
  email,
  phone,
  instagram_handle,
  tiktok_handle,
  website_url
FROM footer_info;

-- =====================================================
-- 4. THEME SETTINGS (should show deep green #1B5E20)
-- =====================================================
SELECT backgroundColor, textColor, primaryColor, fontFamily
FROM theme_settings;

-- =====================================================
-- 5. ADMIN USER (confirm kitebeelitesfc@gmail.com)
-- =====================================================
SELECT id, full_name, email, is_active, created_at
FROM admins;

-- =====================================================
-- 6. LEAGUE GROUPS
-- =====================================================
SELECT name, season, is_active FROM league_groups ORDER BY name;

-- =====================================================
-- 7. LEAGUE TEAMS BY GROUP
-- =====================================================
SELECT
  g.name  AS group_name,
  t.name  AS team_name,
  t.short_code,
  t.home_ground
FROM league_teams t
JOIN league_groups g ON t.group_id = g.id
ORDER BY g.name, t.name;

-- =====================================================
-- 8. LEAGUE STANDINGS (current — all zeroes at start)
-- =====================================================
SELECT
  g.name    AS group_name,
  t.name    AS team_name,
  s.played,
  s.won,
  s.drawn,
  s.lost,
  s.goals_for,
  s.goals_against,
  s.goal_difference,
  s.points
FROM league_standings s
JOIN league_teams  t ON s.team_id  = t.id
JOIN league_groups g ON s.group_id = g.id
ORDER BY g.name, s.points DESC, s.goal_difference DESC, t.name;

-- =====================================================
-- 9. FIXTURES SCHEDULE
-- =====================================================
SELECT
  g.name           AS group_name,
  ht.name          AS home_team,
  at2.name         AS away_team,
  f.match_date,
  f.match_time,
  f.venue,
  f.status,
  CASE
    WHEN f.home_score IS NOT NULL THEN
      CONCAT(f.home_score, ' - ', f.away_score)
    ELSE 'Not played'
  END              AS result
FROM league_fixtures f
JOIN league_groups g   ON f.group_id     = g.id
JOIN league_teams  ht  ON f.home_team_id = ht.id
JOIN league_teams  at2 ON f.away_team_id = at2.id
ORDER BY g.name, f.match_date, f.match_time;

-- =====================================================
-- 10. EXECUTIVE MEMBERS
-- =====================================================
SELECT
  member_number,
  full_name,
  role,
  committee,
  is_executive
FROM members
WHERE is_executive = true
ORDER BY member_number;

-- =====================================================
-- 11. CHARITY VISITS LOG
-- =====================================================
SELECT
  title,
  location,
  visit_date,
  category,
  beneficiaries,
  items_donated
FROM charity_visits
ORDER BY visit_date DESC;

-- =====================================================
-- 12. RLS POLICIES AUDIT
-- =====================================================
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 13. RLS STATUS — CONFIRM ALL TABLES HAVE RLS ON
-- =====================================================
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- =====================================================
-- 14. PROGRAMS / PILLARS
-- =====================================================
SELECT title, is_featured, order_index, is_active
FROM programs
ORDER BY order_index;

-- =====================================================
-- 15. LEADERSHIP EXECUTIVE COMMITTEE
-- =====================================================
SELECT
  member_number,
  full_name,
  title,
  order_index,
  is_featured,
  is_active
FROM leadership
ORDER BY order_index;

-- =====================================================
-- QUICK PASS/FAIL SUMMARY
-- =====================================================
-- Run this for a fast health check:

SELECT
  CASE WHEN COUNT(*) = 1  THEN 'PASS' ELSE 'FAIL' END AS admin_check
FROM admins;

SELECT
  CASE WHEN COUNT(*) = 1  THEN 'PASS' ELSE 'FAIL' END AS footer_check
FROM footer_info
WHERE organization_name = 'Kitebe Elites FC';

SELECT
  CASE WHEN COUNT(*) = 2  THEN 'PASS' ELSE 'FAIL' END AS groups_check
FROM league_groups;

SELECT
  CASE WHEN COUNT(*) = 10 THEN 'PASS' ELSE 'FAIL' END AS teams_check
FROM league_teams;

SELECT
  CASE WHEN COUNT(*) = 10 THEN 'PASS' ELSE 'FAIL' END AS standings_check
FROM league_standings;

SELECT
  CASE WHEN COUNT(*) >= 6 THEN 'PASS' ELSE 'FAIL' END AS fixtures_check
FROM league_fixtures;

SELECT
  CASE WHEN COUNT(*) = 25 THEN 'PASS' ELSE 'FAIL' END AS members_check
FROM members;

SELECT
  CASE WHEN COUNT(*) = 4  THEN 'PASS' ELSE 'FAIL' END AS charity_check
FROM charity_visits;

-- =====================================================
-- END OF 06_VERIFY.sql
-- Kitebe Elites FC — Tethered Together
-- =====================================================
