-- ─── SlotYourGame — Seed / Mock Data ────────────────────────────────────────
-- Run this in Supabase SQL Editor AFTER schema.sql

-- ─── Auth users (demo credentials from brief) ────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, confirmation_sent_at,
  role, aud, created_at, updated_at,
  raw_user_meta_data, raw_app_meta_data
) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'admin@slotyourgame.com',
    crypt('admin123', gen_salt('bf')),
    now(), now(), 'authenticated', 'authenticated', now(), now(),
    '{"full_name":"League Admin","role":"league_admin"}',
    '{"provider":"email","providers":["email"]}'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'captain@renaissance.cc',
    crypt('captain123', gen_salt('bf')),
    now(), now(), 'authenticated', 'authenticated', now(), now(),
    '{"full_name":"Ravi Shastri","role":"captain"}',
    '{"provider":"email","providers":["email"]}'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'player@renaissance.cc',
    crypt('player123', gen_salt('bf')),
    now(), now(), 'authenticated', 'authenticated', now(), now(),
    '{"full_name":"Arjun Mehta","role":"player"}',
    '{"provider":"email","providers":["email"]}'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'player2@renaissance.cc',
    crypt('player123', gen_salt('bf')),
    now(), now(), 'authenticated', 'authenticated', now(), now(),
    '{"full_name":"Sameer Khan","role":"player"}',
    '{"provider":"email","providers":["email"]}'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'player3@renaissance.cc',
    crypt('player123', gen_salt('bf')),
    now(), now(), 'authenticated', 'authenticated', now(), now(),
    '{"full_name":"Dev Patel","role":"player"}',
    '{"provider":"email","providers":["email"]}'
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'player4@renaissance.cc',
    crypt('player123', gen_salt('bf')),
    now(), now(), 'authenticated', 'authenticated', now(), now(),
    '{"full_name":"Priya Nair","role":"player"}',
    '{"provider":"email","providers":["email"]}'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Teams ────────────────────────────────────────────────────────────────────
INSERT INTO public.teams (id, name, short_name, captain_id, home_ground) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Renaissance CC', 'RCC', '00000000-0000-0000-0000-000000000002', 'Victoria Park, London'),
  ('00000000-0000-0000-0000-000000000011', 'Riverside Tigers', 'RST', null, 'Riverside Ground, Manchester')
ON CONFLICT (id) DO NOTHING;

-- ─── Profiles (bypass trigger for seed) ──────────────────────────────────────
INSERT INTO public.profiles (id, email, full_name, role, team_id, cricheroes_id, cricheroes_verified) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@slotyourgame.com',  'League Admin', 'league_admin', null, null, false),
  ('00000000-0000-0000-0000-000000000002', 'captain@renaissance.cc',  'Ravi Shastri', 'captain', '00000000-0000-0000-0000-000000000010', 'CH-10023', true),
  ('00000000-0000-0000-0000-000000000003', 'player@renaissance.cc',   'Arjun Mehta',  'player',  '00000000-0000-0000-0000-000000000010', 'CH-10088', true),
  ('00000000-0000-0000-0000-000000000004', 'player2@renaissance.cc',  'Sameer Khan',  'player',  '00000000-0000-0000-0000-000000000010', null, false),
  ('00000000-0000-0000-0000-000000000005', 'player3@renaissance.cc',  'Dev Patel',    'player',  '00000000-0000-0000-0000-000000000010', null, false),
  ('00000000-0000-0000-0000-000000000006', 'player4@renaissance.cc',  'Priya Nair',   'player',  '00000000-0000-0000-0000-000000000010', 'CH-10201', true)
ON CONFLICT (id) DO NOTHING;

-- ─── Fixtures ─────────────────────────────────────────────────────────────────
INSERT INTO public.fixtures (id, team_id, opponent_name, fixture_date, start_time, end_time, ground_name, ground_address, fixture_type, status, umpire_name, notes, created_by) VALUES
  (
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000010',
    'Riverside Tigers', '2026-06-01', '10:00', '18:00',
    'Victoria Park', 'Victoria Park Rd, London E9 7BT',
    'match', 'confirmed', 'James Browne',
    'League match — bring full whites. Toss at 09:45.',
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000010',
    'Nets Session', '2026-05-28', '18:30', '20:30',
    'Hackney Indoor Cricket', '23 Cassland Rd, London E9 5AA',
    'nets', 'confirmed', null,
    'Focus on batting — bowling machine booked.',
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    '00000000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000010',
    'Hackney Hawks', '2026-06-15', '11:00', '19:00',
    'Hackney Marshes', 'Hackney Marshes, London E9 5PF',
    'match', 'pending', null,
    'Away fixture — car share from ground at 09:30.',
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    '00000000-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000010',
    'East London Invitational', '2026-07-05', '09:00', '18:00',
    'Wanstead Flats', 'Wanstead Flats, London E11',
    'tournament', 'pending', null,
    'T20 tournament. All 11 players must be available. Entry fee £10pp.',
    '00000000-0000-0000-0000-000000000002'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Availability ─────────────────────────────────────────────────────────────
-- Fixture 1 — vs Riverside Tigers
INSERT INTO public.availability (fixture_id, player_id, status, responded_at) VALUES
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000002', 'available',   now()),
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000003', 'available',   now()),
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000004', 'unavailable', now()),
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000005', 'available',   now()),
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000006', 'pending',     null)
ON CONFLICT (fixture_id, player_id) DO NOTHING;

-- Fixture 2 — Nets session
INSERT INTO public.availability (fixture_id, player_id, status, responded_at) VALUES
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', 'available', now()),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000003', 'available', now()),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000004', 'available', now()),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000005', 'pending',   null),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000006', 'pending',   null)
ON CONFLICT (fixture_id, player_id) DO NOTHING;

-- Fixture 3 — vs Hackney Hawks
INSERT INTO public.availability (fixture_id, player_id, status, responded_at) VALUES
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', 'available',   now()),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000003', 'pending',     null),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000004', 'pending',     null),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000005', 'unavailable', now()),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000006', 'available',   now())
ON CONFLICT (fixture_id, player_id) DO NOTHING;

-- ─── Player Stats (past matches) ──────────────────────────────────────────────
INSERT INTO public.player_stats (player_id, fixture_id, runs_scored, balls_faced, wickets_taken, overs_bowled, catches, stumpings) VALUES
  -- Arjun Mehta — vs Riverside Tigers
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000020', 54, 48, 2, 4.0, 1, 0),
  -- Ravi Shastri — vs Riverside Tigers
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000020', 38, 42, 1, 3.0, 0, 0),
  -- Dev Patel — vs Riverside Tigers
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000020', 12, 18, 3, 4.0, 2, 0),
  -- Priya Nair — vs Riverside Tigers
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000020', 27, 31, 0, 2.0, 1, 1)
ON CONFLICT DO NOTHING;
