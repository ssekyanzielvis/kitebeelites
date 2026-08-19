-- =====================================================
-- KITEBE ELITES FC — INITIAL SEED DATA
-- =====================================================
-- Organization: Kitebe Elites FC
-- Motto: "Tethered Together"
-- Base: Makerere Main Mosque Library, Kampala, Uganda
-- Website: www.kitebeelites.com | Email: kitebeelitesfc@gmail.com
-- Socials: @kitebeelites (Instagram & TikTok)
-- =====================================================
-- Run AFTER 01_schema.sql, 02_storage_buckets.sql,
-- and 03_rls_policies.sql
-- =====================================================

-- =====================================================
-- 1. DEFAULT THEME (Green & Gold — Kitebe brand)
-- =====================================================
-- Deep forest green primary, gold accent, clean white bg

INSERT INTO theme_settings (backgroundColor, textColor, primaryColor, fontFamily)
VALUES ('#FFFFFF', '#1A1A1A', '#1B5E20', 'Inter')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. FOOTER / ORGANIZATION INFO
-- =====================================================

INSERT INTO footer_info (
  organization_name, location, director, email, phone,
  organization_type, primary_focus,
  instagram_handle, tiktok_handle, website_url
) VALUES (
  'Kitebe Elites FC',
  'Makerere Main Mosque Library, Kampala, Uganda',
  'Chairman — Kitebe Elites FC',
  'kitebeelitesfc@gmail.com',
  '+256 700 000000',
  'Community-Based Sports & Social Impact Organization',
  'Football, Community Outreach, Youth Empowerment & Charity',
  '@kitebeelites',
  '@kitebeelites',
  'https://www.kitebeelites.com'
);

-- =====================================================
-- 3. DEFAULT ADMIN USER
-- =====================================================
-- Email: kitebeelitesfc@gmail.com
-- Password: kitebe2025
-- Hash: SHA-256 of "kitebe2025"
-- IMPORTANT: Change this password immediately after first login!

INSERT INTO admins (full_name, email, password_hash, phone_number)
VALUES (
  'Kitebe Elites Admin',
  'kitebeelitesfc@gmail.com',
  encode(digest('kitebe2025', 'sha256'), 'hex'),
  '+256 700 000000'
);

-- =====================================================
-- 4. PAYMENT SETTINGS (MTN & Airtel Uganda)
-- =====================================================

INSERT INTO payment_settings (mtn_number, mtn_name, airtel_number, airtel_name, manual_payment_instructions)
VALUES (
  '+256 77 0000000',
  'Kitebe Elites FC',
  '+256 75 0000000',
  'Kitebe Elites FC',
  'Send your donation to either mobile money number above, then email us the transaction reference at kitebeelitesfc@gmail.com with your name and purpose of donation. You will receive a confirmation within 24 hours.'
);

-- =====================================================
-- 5. HELLO SLIDES (Homepage Carousel)
-- =====================================================

INSERT INTO hello_slides (image_url, description, order_index, direction) VALUES
  (
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200',
    'Kitebe Elites FC — Tethered Together. A brotherhood of footballers, graduates, and community builders from Makerere to the world.',
    1, 'left'
  ),
  (
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200',
    'Uniting communities through the beautiful game. Every Sunday, every goal — for the people.',
    2, 'left'
  ),
  (
    'https://images.unsplash.com/photo-1551958219-acbc338a7924?w=1200',
    'From hospital visits to charity tournaments — we serve beyond the pitch.',
    3, 'right'
  ),
  (
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200',
    'The Kitebe Elites League 2025–2026 — Hawah Group & Shadia Group. Ten teams. One spirit.',
    4, 'right'
  );

-- =====================================================
-- 6. ABOUT US
-- =====================================================

INSERT INTO about_us (description, image_url, order_index) VALUES
  (
    'Kitebe Elites FC is a community-based sports and social impact organization that originated as a casual Sunday football meet-up for students of diverse educational backgrounds at Makerere University. Over time, it grew into a close-knit network and brotherhood of graduates, professionals, and community members united by a single motto: "Tethered Together".',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900',
    1
  ),
  (
    'Rooted in the Makerere Main Mosque Library — our symbolic home and operational hub — Kitebe Elites FC has evolved from an informal student football group into a formal Community-Based Team (CBT). Our membership spans engineers, medics, educators, technologists, and community leaders who share a passion for football and a commitment to social upliftment.',
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900',
    2
  ),
  (
    'Using football as an entry point and vehicle, we foster brotherhood, community leadership, mentorship, and social welfare. From organizing competitive leagues and charity tournaments to visiting the sick in hospitals and donating football kits to grassroots teams — Kitebe Elites FC is more than a football club. We are a movement.',
    'https://images.unsplash.com/photo-1551958219-acbc338a7924?w=900',
    3
  );

-- =====================================================
-- 7. VISION & MISSION
-- =====================================================

INSERT INTO vision (statement, image_url) VALUES
  (
    'A society where sport builds bridges between people, uplifts the vulnerable, and inspires positive change — from Makerere to the wider world.',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900'
  );

INSERT INTO mission (statement, image_url) VALUES
  (
    'To be a team that uses football as a tool to unite, inspire, and uplift communities — through charity, mentorship, and social engagement — creating a lasting brotherhood that transcends the pitch.',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900'
  );

-- =====================================================
-- 8. OBJECTIVES
-- =====================================================

INSERT INTO objectives (statement, image_url, order_index) VALUES
  (
    'Organize regular, competitive Sunday football sessions and structured league competitions that bring communities together.',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=700',
    1
  ),
  (
    'Conduct meaningful charity and social outreach — visiting hospitals, donating kits and balls, and running open soccer days for local youth.',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700',
    2
  ),
  (
    'Empower youth and women through skill-building programs and mentorship that extend well beyond athletics.',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700',
    3
  ),
  (
    'Build strategic partnerships with mosques, NGOs, sports bodies, and corporate entities to amplify community impact.',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700',
    4
  ),
  (
    'Grow the Kitebe Elites brand from a Kampala institution into an internationally recognized model for community-driven football organizations.',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700',
    5
  );

-- =====================================================
-- 9. PROGRAMS / STRATEGIC PILLARS
-- =====================================================

INSERT INTO programs (title, description, image_url, is_featured, order_index) VALUES
  (
    'Community Football',
    'The heartbeat of Kitebe Elites FC. We host regular Sunday football sessions at Makerere Main Mosque Grounds, run the official Kitebe Elites League (2025–2026) featuring the Hawah Group and Shadia Group — each with five competitive teams — and organize charity tournaments that bring entire communities together. Football is our language; unity is our goal.',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900',
    true, 1
  ),
  (
    'Charity & Social Outreach',
    'We believe in giving back beyond the pitch. Our outreach program organizes direct hospital visits to support patients, procures and donates football kits, jerseys, and balls to grassroots teams, and runs open soccer days to encourage local integration and joy. Every jersey donated. Every visit made. Every smile earned — "Tethered Together".',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900',
    true, 2
  ),
  (
    'Youth & Empowerment',
    'Football opens doors. Kitebe Elites FC supports youth skill-building programs that go far beyond athletics — from mentorship sessions to career guidance. We engage our community and fan base into active civic leaders, helping young people in Kampala and beyond discover their full potential. A stronger youth means a stronger society.',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900',
    true, 3
  ),
  (
    'Partnerships & Collaboration',
    'Great impact requires great alliances. We collaborate with local mosques, non-governmental organizations (NGOs), national sports governing bodies, and corporate entities to amplify our reach and sustainability. Our roots at the Makerere Main Mosque Library anchor us in faith, community, and purpose — and we carry those values into every partnership we build.',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900',
    true, 4
  );

-- =====================================================
-- 10. ACHIEVEMENTS
-- =====================================================

INSERT INTO achievements (title, description, achievement_date, image_url, is_featured, order_index) VALUES
  (
    'Kitebe Elites League 2025–2026 Launch',
    'Successfully launched the inaugural Kitebe Elites League featuring 10 teams across two competitive groups — Hawah Group and Shadia Group. The league represents the culmination of years of Sunday football into a structured, professional competition.',
    '2025-01-01',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900',
    true, 1
  ),
  (
    'Mulago Hospital Charity Visit',
    'Organized a compassionate charity visit to Mulago National Referral Hospital, bringing encouragement, supplies, and community warmth to patients and their families. A powerful reminder that our brotherhood extends beyond football.',
    '2024-11-15',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900',
    true, 2
  ),
  (
    'Football Kit Donation Drive',
    'Donated complete football kits — jerseys, shorts, boots, and footballs — to three grassroots youth teams in Kampala. This initiative reflects our core mission: using football to uplift the next generation.',
    '2024-09-20',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900',
    true, 3
  ),
  (
    'Open Soccer Day — Makerere Community',
    'Hosted a wildly successful Open Soccer Day at Makerere, attracting over 200 community members, youth, and alumni. The day featured football, mentorship talks, and a celebration of the Kitebe brotherhood.',
    '2024-06-28',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900',
    true, 4
  ),
  (
    'Charity Tournament — Tethered Together Cup',
    'Organized the first-ever Tethered Together Cup charity football tournament, raising funds for community outreach programs. Teams from across Kampala participated, with all proceeds going directly to the charity fund.',
    '2024-04-10',
    'https://images.unsplash.com/photo-1551958219-acbc338a7924?w=900',
    true, 5
  );

-- =====================================================
-- 11. CORE VALUES
-- =====================================================

INSERT INTO core_values (title, description, image_url, is_featured, order_index) VALUES
  (
    'Brotherhood (Ukhuwwah)',
    'At our core, we are a family. Every member of Kitebe Elites FC is bound by a deep sense of brotherhood — on the pitch and off it. We look out for each other, celebrate together, and lift each other up. "Tethered Together" is not just a motto; it is how we live.',
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900',
    true, 1
  ),
  (
    'Integrity & Transparency',
    'We conduct all our affairs — from the football pitch to charity distributions — with honesty and accountability. Our community trusts us, and we honour that trust by being transparent in our operations, finances, and decisions.',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900',
    true, 2
  ),
  (
    'Community Service',
    'Football is our vehicle, but service is our destination. We are committed to making a tangible difference in the lives of people around us — through hospital visits, kit donations, mentorship, and open soccer days. We give back because we are from this community.',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900',
    true, 3
  ),
  (
    'Excellence & Growth',
    'We pursue excellence in everything we do — from how we play football to how we run our programs. We push each other to grow as athletes, professionals, and human beings. Mediocrity has no place in the Kitebe brotherhood.',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900',
    true, 4
  ),
  (
    'Faith & Rootedness',
    'Founded at the Makerere Main Mosque Library, faith and moral grounding are woven into our identity. We draw strength from our values and our spiritual roots, using them as a compass for every decision we make as an organization.',
    'https://images.unsplash.com/photo-1551958219-acbc338a7924?w=900',
    true, 5
  );

-- =====================================================
-- 12. LEADERSHIP / EXECUTIVE COMMITTEE
-- =====================================================

INSERT INTO leadership (full_name, title, role_detail, achievement, image_url, member_number, order_index, is_featured) VALUES
  (
    'Chairman',
    'Chairman',
    'Executive oversight and organizational leadership of Kitebe Elites FC. Responsible for the strategic direction of the club and its community impact programs.',
    'Founded and grew Kitebe Elites FC from a Sunday football meetup into a structured community-based organization with a formal league, charity programs, and 20+ active members.',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700',
    20, 1, true
  ),
  (
    'Isham Malamu',
    'Team Captain',
    'Squad leadership and on-pitch management. Responsible for team selection, match strategy, and player morale. The driving force of Kitebe Elites FC on the football field.',
    'Led Kitebe Elites FC through competitive league seasons, maintaining the squad''s competitive edge while fostering a culture of unity and sportsmanship.',
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=700',
    8, 2, true
  ),
  (
    'Bbosa Arafat',
    'Welfare & Assistant Captain',
    'Player welfare, squad logistics, and deputy squad coordination. Ensures the wellbeing of all members and supports the Captain in day-to-day team management.',
    'Instrumental in coordinating hospital visits and charity initiatives, bringing the human side of Kitebe Elites FC to life through compassionate leadership.',
    'https://images.unsplash.com/photo-1583009668174-3fa133b65889?w=700',
    4, 3, true
  ),
  (
    'Manager Katumba',
    'General Duties (Operations)',
    'Administrative operations and coordination. Manages logistics, scheduling, match organization, and the day-to-day administration of the club''s activities.',
    'Established the operational systems that allow Kitebe Elites FC to run smoothly — from match scheduling to kit management to event coordination.',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=700',
    12, 4, true
  ),
  (
    'General Duties & Treasurer',
    'Treasurer',
    'Financial management, accounting, and general administrative operations. Maintains the club''s financial records, manages the charity fund, and ensures responsible use of all resources.',
    'Built a transparent financial management system for Kitebe Elites FC, ensuring every donation and club fund is properly accounted for and directed toward community impact.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700',
    13, 5, true
  ),
  (
    'Publicity & Media',
    'Head of Publicity & Media',
    'Communications, public relations, and social media outreach. Manages the Kitebe Elites FC brand across @kitebeelites on Instagram and TikTok, and drives digital engagement.',
    'Grew the Kitebe Elites FC digital presence to a thriving community online, documenting match days, charity events, and brotherhood moments that connect fans worldwide.',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700',
    25, 6, true
  );

-- =====================================================
-- 13. GALLERY (Football, Charity, Events)
-- =====================================================

INSERT INTO gallery (image_url, description, category, media_type, is_featured) VALUES
  ('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900', 'Kitebe Elites Sunday match at Makerere', 'Matches', 'image', true),
  ('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900', 'Team huddle before kickoff', 'Matches', 'image', true),
  ('https://images.unsplash.com/photo-1551958219-acbc338a7924?w=900', 'Celebrating a goal — the Kitebe way', 'Matches', 'image', true),
  ('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900', 'Full squad on match day', 'Matches', 'image', true),
  ('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900', 'Hospital visit — bringing joy to patients', 'Charity', 'image', true),
  ('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900', 'Football kit donation to local youth team', 'Charity', 'image', true),
  ('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900', 'Open Soccer Day at Makerere', 'Events', 'image', true),
  ('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900', 'Brotherhood — off the pitch', 'Events', 'image', true),
  ('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900', 'Youth training session', 'Training', 'image', true),
  ('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900', 'Skills development workshop', 'Training', 'image', true),
  ('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900', 'Tethered Together Cup — trophy ceremony', 'Events', 'image', true),
  ('https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900', 'Makerere Main Mosque Library — our home', 'Events', 'image', false);

-- =====================================================
-- 14. NEWS / UPDATES
-- =====================================================

INSERT INTO news (title, description, published_date, image_url, is_featured, order_index) VALUES
  (
    'Kitebe Elites League 2025–2026 Season Officially Kicks Off',
    'The Kitebe Elites League 2025–2026 has officially launched, featuring 10 competitive teams divided into two groups. Hawah Group features AMAGEZI, KISAZE, KIKUTIYA, ABAKAMANNYI, and NTOGO STREET. Shadia Group features HF, EMBASSY, KIZZE, LEGENDS, and STANZA. Matches are played every Sunday at Makerere Main Mosque Grounds. Come support your team!',
    '2025-01-10',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900',
    true, 1
  ),
  (
    'Kitebe Elites FC Visits Mulago National Referral Hospital',
    'Members of Kitebe Elites FC made a heartfelt visit to Mulago National Referral Hospital, spending time with patients and their families. The visit is part of our ongoing charity and social outreach program. "Football gives us the platform; service gives us the purpose," said Team Captain Isham Malamu.',
    '2024-11-20',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900',
    true, 2
  ),
  (
    'Football Kit Donation: Empowering Grassroots Youth',
    'Kitebe Elites FC completed a major kit donation drive, providing full football kits — jerseys, shorts, boots, and balls — to three local youth teams in Kampala. "We were once those kids playing barefoot. Now it is our turn to give back," said Bbosa Arafat, Welfare & Assistant Captain.',
    '2024-10-05',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900',
    true, 3
  ),
  (
    'Open Soccer Day Draws 200+ to Makerere',
    'Kitebe Elites FC hosted an exhilarating Open Soccer Day at Makerere, drawing over 200 participants from across the community. The day featured competitive matches, mentorship talks from club members, and a celebration of the brotherhood that defines Kitebe Elites. Mark your calendars — the next Open Soccer Day is coming soon!',
    '2024-07-01',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900',
    true, 4
  ),
  (
    'Kitebe Elites FC Launches Official Website & Social Media',
    'Kitebe Elites FC is proud to announce the launch of our official website at www.kitebeelites.com and our social media presence at @kitebeelites on Instagram and TikTok. Follow us for match updates, charity news, league standings, and behind-the-scenes brotherhood content.',
    '2025-01-01',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900',
    true, 5
  );

-- =====================================================
-- 15. LEAGUE GROUPS
-- =====================================================

INSERT INTO league_groups (name, season, description) VALUES
  (
    'Hawah Group',
    '2025-2026',
    'Hawah Group — 5 competitive teams battling for top-group honors in the Kitebe Elites League 2025–2026 season.'
  ),
  (
    'Shadia Group',
    '2025-2026',
    'Shadia Group — 5 competitive teams competing for Shadia Group supremacy in the Kitebe Elites League 2025–2026 season.'
  );

-- =====================================================
-- 16. LEAGUE TEAMS
-- =====================================================

-- We need the group IDs — insert teams referencing groups by name subquery
INSERT INTO league_teams (group_id, name, short_code, home_ground) VALUES
  -- Hawah Group
  ((SELECT id FROM league_groups WHERE name = 'Hawah Group' AND season = '2025-2026'), 'AMAGEZI',       'AMG', 'Makerere Main Mosque Grounds'),
  ((SELECT id FROM league_groups WHERE name = 'Hawah Group' AND season = '2025-2026'), 'KISAZE',        'KSZ', 'Makerere Main Mosque Grounds'),
  ((SELECT id FROM league_groups WHERE name = 'Hawah Group' AND season = '2025-2026'), 'KIKUTIYA',      'KKT', 'Makerere Main Mosque Grounds'),
  ((SELECT id FROM league_groups WHERE name = 'Hawah Group' AND season = '2025-2026'), 'ABAKAMANNYI',   'ABK', 'Makerere Main Mosque Grounds'),
  ((SELECT id FROM league_groups WHERE name = 'Hawah Group' AND season = '2025-2026'), 'NTOGO STREET',  'NTS', 'Makerere Main Mosque Grounds'),
  -- Shadia Group
  ((SELECT id FROM league_groups WHERE name = 'Shadia Group' AND season = '2025-2026'), 'HF',       'HF',  'Makerere Main Mosque Grounds'),
  ((SELECT id FROM league_groups WHERE name = 'Shadia Group' AND season = '2025-2026'), 'EMBASSY',  'EMB', 'Makerere Main Mosque Grounds'),
  ((SELECT id FROM league_groups WHERE name = 'Shadia Group' AND season = '2025-2026'), 'KIZZE',    'KZZ', 'Makerere Main Mosque Grounds'),
  ((SELECT id FROM league_groups WHERE name = 'Shadia Group' AND season = '2025-2026'), 'LEGENDS',  'LGD', 'Makerere Main Mosque Grounds'),
  ((SELECT id FROM league_groups WHERE name = 'Shadia Group' AND season = '2025-2026'), 'STANZA',   'STZ', 'Makerere Main Mosque Grounds');

-- =====================================================
-- 17. LEAGUE STANDINGS (Initial — all zeroes)
-- =====================================================

INSERT INTO league_standings (group_id, team_id, season, played, won, drawn, lost, goals_for, goals_against)
SELECT
  t.group_id,
  t.id,
  '2025-2026',
  0, 0, 0, 0, 0, 0
FROM league_teams t;

-- =====================================================
-- 18. SAMPLE LEAGUE FIXTURES (Opening Round)
-- =====================================================

-- Hawah Group Fixtures (Round 1)
INSERT INTO league_fixtures (group_id, home_team_id, away_team_id, match_date, match_time, venue, status) VALUES
  (
    (SELECT id FROM league_groups WHERE name = 'Hawah Group' AND season = '2025-2026'),
    (SELECT id FROM league_teams WHERE name = 'AMAGEZI'),
    (SELECT id FROM league_teams WHERE name = 'KISAZE'),
    '2025-01-19', '10:00', 'Makerere Main Mosque Grounds', 'scheduled'
  ),
  (
    (SELECT id FROM league_groups WHERE name = 'Hawah Group' AND season = '2025-2026'),
    (SELECT id FROM league_teams WHERE name = 'KIKUTIYA'),
    (SELECT id FROM league_teams WHERE name = 'ABAKAMANNYI'),
    '2025-01-19', '12:00', 'Makerere Main Mosque Grounds', 'scheduled'
  ),
  (
    (SELECT id FROM league_groups WHERE name = 'Hawah Group' AND season = '2025-2026'),
    (SELECT id FROM league_teams WHERE name = 'NTOGO STREET'),
    (SELECT id FROM league_teams WHERE name = 'AMAGEZI'),
    '2025-01-26', '10:00', 'Makerere Main Mosque Grounds', 'scheduled'
  ),
  (
    (SELECT id FROM league_groups WHERE name = 'Hawah Group' AND season = '2025-2026'),
    (SELECT id FROM league_teams WHERE name = 'KISAZE'),
    (SELECT id FROM league_teams WHERE name = 'KIKUTIYA'),
    '2025-01-26', '12:00', 'Makerere Main Mosque Grounds', 'scheduled'
  );

-- Shadia Group Fixtures (Round 1)
INSERT INTO league_fixtures (group_id, home_team_id, away_team_id, match_date, match_time, venue, status) VALUES
  (
    (SELECT id FROM league_groups WHERE name = 'Shadia Group' AND season = '2025-2026'),
    (SELECT id FROM league_teams WHERE name = 'HF'),
    (SELECT id FROM league_teams WHERE name = 'EMBASSY'),
    '2025-01-19', '10:00', 'Makerere Main Mosque Grounds', 'scheduled'
  ),
  (
    (SELECT id FROM league_groups WHERE name = 'Shadia Group' AND season = '2025-2026'),
    (SELECT id FROM league_teams WHERE name = 'KIZZE'),
    (SELECT id FROM league_teams WHERE name = 'LEGENDS'),
    '2025-01-19', '12:00', 'Makerere Main Mosque Grounds', 'scheduled'
  ),
  (
    (SELECT id FROM league_groups WHERE name = 'Shadia Group' AND season = '2025-2026'),
    (SELECT id FROM league_teams WHERE name = 'STANZA'),
    (SELECT id FROM league_teams WHERE name = 'HF'),
    '2025-01-26', '10:00', 'Makerere Main Mosque Grounds', 'scheduled'
  ),
  (
    (SELECT id FROM league_groups WHERE name = 'Shadia Group' AND season = '2025-2026'),
    (SELECT id FROM league_teams WHERE name = 'EMBASSY'),
    (SELECT id FROM league_teams WHERE name = 'KIZZE'),
    '2025-01-26', '12:00', 'Makerere Main Mosque Grounds', 'scheduled'
  );

-- =====================================================
-- 19. MEMBERS ROSTER
-- =====================================================

INSERT INTO members (member_number, full_name, role, committee, is_executive, is_active, joined_date) VALUES
  (20, 'Chairman',            'Chairman',                   'Executive', true,  true, '2020-01-01'),
  (8,  'Isham Malamu',        'Team Captain',               'Executive', true,  true, '2020-01-01'),
  (4,  'Bbosa Arafat',        'Welfare & Assistant Captain','Executive', true,  true, '2020-01-01'),
  (12, 'Manager Katumba',     'General Duties (Operations)','Executive', true,  true, '2020-01-01'),
  (13, 'Member #13',          'Treasurer',                  'Executive', true,  true, '2020-01-01'),
  (25, 'Member #25',          'Publicity & Media',          'Executive', true,  true, '2020-01-01'),
  (1,  'Member #1',           'Player',                     'General',   false, true, '2020-06-01'),
  (2,  'Member #2',           'Player',                     'General',   false, true, '2020-06-01'),
  (3,  'Member #3',           'Player',                     'General',   false, true, '2020-06-01'),
  (5,  'Member #5',           'Player',                     'General',   false, true, '2020-06-01'),
  (6,  'Member #6',           'Player',                     'General',   false, true, '2020-06-01'),
  (7,  'Member #7',           'Player',                     'General',   false, true, '2020-06-01'),
  (9,  'Member #9',           'Player',                     'General',   false, true, '2021-01-01'),
  (10, 'Member #10',          'Player',                     'General',   false, true, '2021-01-01'),
  (11, 'Member #11',          'Player',                     'General',   false, true, '2021-01-01'),
  (14, 'Member #14',          'Player',                     'General',   false, true, '2021-01-01'),
  (15, 'Member #15',          'Player',                     'General',   false, true, '2021-01-01'),
  (16, 'Member #16',          'Player',                     'General',   false, true, '2021-06-01'),
  (17, 'Member #17',          'Player',                     'General',   false, true, '2021-06-01'),
  (18, 'Member #18',          'Player',                     'General',   false, true, '2022-01-01'),
  (19, 'Member #19',          'Player',                     'General',   false, true, '2022-01-01'),
  (21, 'Member #21',          'Player',                     'General',   false, true, '2022-01-01'),
  (22, 'Member #22',          'Player',                     'General',   false, true, '2022-06-01'),
  (23, 'Member #23',          'Player',                     'General',   false, true, '2023-01-01'),
  (24, 'Member #24',          'Player',                     'General',   false, true, '2023-01-01');

-- =====================================================
-- 20. CHARITY VISITS
-- =====================================================

INSERT INTO charity_visits (title, location, visit_date, description, items_donated, beneficiaries, image_url, category, is_featured) VALUES
  (
    'Mulago National Referral Hospital Visit',
    'Mulago National Referral Hospital, Kampala',
    '2024-11-15',
    'Members of Kitebe Elites FC spent the afternoon at Mulago National Referral Hospital, visiting patients across different wards. The team brought food, encouragement, and community spirit to those who needed it most. A deeply moving experience that reaffirmed why we exist.',
    'Food packages, fruits, Islamic literature',
    45,
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900',
    'Hospital Visit',
    true
  ),
  (
    'Football Kit Donation to Bwaise Youth FC',
    'Bwaise, Kampala',
    '2024-09-20',
    'Kitebe Elites FC donated a full set of football kits to Bwaise Youth FC, a grassroots team of under-16 players. The donation included 16 jerseys, matching shorts, socks, and 3 match-quality footballs. Moments like these remind us that football has the power to change lives.',
    '16 jerseys, shorts, socks, 3 match footballs',
    30,
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900',
    'Kit Donation',
    true
  ),
  (
    'Open Soccer Day — Makerere Community',
    'Makerere Main Mosque Grounds, Kampala',
    '2024-06-28',
    'Kitebe Elites FC hosted a full-day Open Soccer Day welcoming community members of all ages. The event featured friendly matches, skills drills, and a mentorship panel where club professionals shared career insights. Over 200 people attended — the community showed up in full force.',
    'Footballs, refreshments',
    200,
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900',
    'Open Soccer Day',
    true
  ),
  (
    'Tethered Together Cup Charity Tournament',
    'Makerere Main Mosque Grounds, Kampala',
    '2024-04-10',
    'The inaugural Tethered Together Cup brought 8 community teams together for a charity football tournament. Entry fees and sponsorships were channeled directly into our charity fund. The final was a spectacle of skill and sportsmanship — everything Kitebe Elites FC stands for.',
    'Prize kits, medals, charity fund raised: UGX 2,500,000',
    250,
    'https://images.unsplash.com/photo-1551958219-acbc338a7924?w=900',
    'Community Outreach',
    true
  );

-- =====================================================
-- END OF 04_initial_data.sql
-- Run next: (optional) 05_COMPLETE_SETUP.sql
-- =====================================================
