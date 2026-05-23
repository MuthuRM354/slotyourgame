import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const TEAM_ID   = '00000000-0000-0000-0000-000000000010'
const TEAM_ID_2 = '00000000-0000-0000-0000-000000000011'

const USERS = [
  { id: '00000000-0000-0000-0000-000000000001', email: 'admin@slotyourgame.com',  password: 'admin123',   full_name: 'League Admin', role: 'league_admin', team_id: null,    cricheroes_id: null,      verified: false },
  { id: '00000000-0000-0000-0000-000000000002', email: 'captain@renaissance.cc', password: 'captain123', full_name: 'Ravi Shastri', role: 'captain',      team_id: TEAM_ID, cricheroes_id: 'CH-10023', verified: true  },
  { id: '00000000-0000-0000-0000-000000000003', email: 'player@renaissance.cc',  password: 'player123',  full_name: 'Arjun Mehta',  role: 'player',       team_id: TEAM_ID, cricheroes_id: 'CH-10088', verified: true  },
  { id: '00000000-0000-0000-0000-000000000004', email: 'player2@renaissance.cc', password: 'player123',  full_name: 'Sameer Khan',  role: 'player',       team_id: TEAM_ID, cricheroes_id: null,      verified: false },
  { id: '00000000-0000-0000-0000-000000000005', email: 'player3@renaissance.cc', password: 'player123',  full_name: 'Dev Patel',    role: 'player',       team_id: TEAM_ID, cricheroes_id: null,      verified: false },
  { id: '00000000-0000-0000-0000-000000000006', email: 'player4@renaissance.cc', password: 'player123',  full_name: 'Priya Nair',   role: 'player',       team_id: TEAM_ID, cricheroes_id: 'CH-10201', verified: true  },
]

const FIXTURES = [
  { id: '00000000-0000-0000-0000-000000000020', team_id: TEAM_ID, opponent_name: 'Riverside Tigers',        fixture_date: '2026-06-01', start_time: '10:00', end_time: '18:00', ground_name: 'Victoria Park',          ground_address: 'Victoria Park Rd, London E9 7BT',    fixture_type: 'match',      status: 'confirmed', umpire_name: 'James Browne', notes: 'League match — bring full whites. Toss at 09:45.' },
  { id: '00000000-0000-0000-0000-000000000021', team_id: TEAM_ID, opponent_name: 'Nets Session',            fixture_date: '2026-05-28', start_time: '18:30', end_time: '20:30', ground_name: 'Hackney Indoor Cricket', ground_address: '23 Cassland Rd, London E9 5AA',      fixture_type: 'nets',       status: 'confirmed', umpire_name: null,           notes: 'Focus on batting — bowling machine booked.' },
  { id: '00000000-0000-0000-0000-000000000022', team_id: TEAM_ID, opponent_name: 'Hackney Hawks',           fixture_date: '2026-06-15', start_time: '11:00', end_time: '19:00', ground_name: 'Hackney Marshes',        ground_address: 'Hackney Marshes, London E9 5PF',     fixture_type: 'match',      status: 'pending',   umpire_name: null,           notes: 'Away fixture — car share from ground at 09:30.' },
  { id: '00000000-0000-0000-0000-000000000023', team_id: TEAM_ID, opponent_name: 'East London Invitational', fixture_date: '2026-07-05', start_time: '09:00', end_time: '18:00', ground_name: 'Wanstead Flats',         ground_address: 'Wanstead Flats, London E11',         fixture_type: 'tournament', status: 'pending',   umpire_name: null,           notes: 'T20 tournament. All 11 players must be available. Entry fee £10pp.' },
]

const AVAILABILITY = [
  // Fixture 1 — vs Riverside Tigers (confirmed)
  { fixture_id: '00000000-0000-0000-0000-000000000020', player_id: '00000000-0000-0000-0000-000000000002', status: 'available'   },
  { fixture_id: '00000000-0000-0000-0000-000000000020', player_id: '00000000-0000-0000-0000-000000000003', status: 'available'   },
  { fixture_id: '00000000-0000-0000-0000-000000000020', player_id: '00000000-0000-0000-0000-000000000004', status: 'unavailable' },
  { fixture_id: '00000000-0000-0000-0000-000000000020', player_id: '00000000-0000-0000-0000-000000000005', status: 'available'   },
  { fixture_id: '00000000-0000-0000-0000-000000000020', player_id: '00000000-0000-0000-0000-000000000006', status: 'pending'     },
  // Fixture 2 — Nets
  { fixture_id: '00000000-0000-0000-0000-000000000021', player_id: '00000000-0000-0000-0000-000000000002', status: 'available' },
  { fixture_id: '00000000-0000-0000-0000-000000000021', player_id: '00000000-0000-0000-0000-000000000003', status: 'available' },
  { fixture_id: '00000000-0000-0000-0000-000000000021', player_id: '00000000-0000-0000-0000-000000000004', status: 'available' },
  { fixture_id: '00000000-0000-0000-0000-000000000021', player_id: '00000000-0000-0000-0000-000000000005', status: 'pending'   },
  { fixture_id: '00000000-0000-0000-0000-000000000021', player_id: '00000000-0000-0000-0000-000000000006', status: 'pending'   },
  // Fixture 3 — vs Hackney Hawks
  { fixture_id: '00000000-0000-0000-0000-000000000022', player_id: '00000000-0000-0000-0000-000000000002', status: 'available'   },
  { fixture_id: '00000000-0000-0000-0000-000000000022', player_id: '00000000-0000-0000-0000-000000000003', status: 'pending'     },
  { fixture_id: '00000000-0000-0000-0000-000000000022', player_id: '00000000-0000-0000-0000-000000000004', status: 'pending'     },
  { fixture_id: '00000000-0000-0000-0000-000000000022', player_id: '00000000-0000-0000-0000-000000000005', status: 'unavailable' },
  { fixture_id: '00000000-0000-0000-0000-000000000022', player_id: '00000000-0000-0000-0000-000000000006', status: 'available'   },
]

const STATS = [
  { player_id: '00000000-0000-0000-0000-000000000003', fixture_id: '00000000-0000-0000-0000-000000000020', runs_scored: 54, balls_faced: 48, wickets_taken: 2, overs_bowled: 4.0, catches: 1, stumpings: 0 },
  { player_id: '00000000-0000-0000-0000-000000000002', fixture_id: '00000000-0000-0000-0000-000000000020', runs_scored: 38, balls_faced: 42, wickets_taken: 1, overs_bowled: 3.0, catches: 0, stumpings: 0 },
  { player_id: '00000000-0000-0000-0000-000000000005', fixture_id: '00000000-0000-0000-0000-000000000020', runs_scored: 12, balls_faced: 18, wickets_taken: 3, overs_bowled: 4.0, catches: 2, stumpings: 0 },
  { player_id: '00000000-0000-0000-0000-000000000006', fixture_id: '00000000-0000-0000-0000-000000000020', runs_scored: 27, balls_faced: 31, wickets_taken: 0, overs_bowled: 2.0, catches: 1, stumpings: 1 },
]

async function seed() {
  console.log('🌱 Seeding SlotYourGame...\n')

  // 1. Teams
  console.log('Creating teams...')
  const { error: teamErr } = await supabase.from('teams').upsert([
    { id: TEAM_ID,   name: 'Renaissance CC',  short_name: 'RCC', home_ground: 'Victoria Park, London' },
    { id: TEAM_ID_2, name: 'Riverside Tigers', short_name: 'RST', home_ground: 'Riverside Ground, Manchester' },
  ])
  if (teamErr) console.error('  Teams error:', teamErr.message)
  else console.log('  ✓ Teams created')

  // 2. Auth users
  console.log('Creating auth users...')
  for (const u of USERS) {
    const { error } = await supabase.auth.admin.createUser({
      user_metadata: { full_name: u.full_name, role: u.role },
      email: u.email,
      password: u.password,
      email_confirm: true,
    })
    if (error && !error.message.includes('already been registered')) {
      console.error(`  User ${u.email} error:`, error.message)
    } else {
      console.log(`  ✓ ${u.email}`)
    }
  }

  // 3. Look up real auth UUIDs and upsert profiles
  console.log('Upserting profiles...')
  for (const u of USERS) {
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const authUser = users.find(au => au.email === u.email)
    if (!authUser) { console.error(`  Could not find auth user ${u.email}`); continue }

    const { error } = await supabase.from('profiles').upsert({
      id: authUser.id,
      email: u.email,
      full_name: u.full_name,
      role: u.role,
      team_id: u.team_id,
      cricheroes_id: u.cricheroes_id,
      cricheroes_verified: u.verified,
    })
    if (error) console.error(`  Profile ${u.email} error:`, error.message)
    else console.log(`  ✓ ${u.full_name} (${u.role})`)
  }

  // 4. Fixtures
  console.log('Creating fixtures...')
  const { data: captain } = await supabase.auth.admin.listUsers()
  const captainUser = captain.users.find(u => u.email === 'captain@renaissance.cc')
  const captainId = captainUser?.id

  const fixturesWithCreator = FIXTURES.map(f => ({ ...f, created_by: captainId }))
  const { error: fixErr } = await supabase.from('fixtures').upsert(fixturesWithCreator)
  if (fixErr) console.error('  Fixtures error:', fixErr.message)
  else console.log(`  ✓ ${FIXTURES.length} fixtures created`)

  // 5. Availability — map player emails to real auth UUIDs
  console.log('Creating availability...')
  const { data: { users: allUsers } } = await supabase.auth.admin.listUsers()
  const emailToId = Object.fromEntries(allUsers.map(u => [u.email, u.id]))

  const availRows = AVAILABILITY.map(a => {
    const playerEmail = USERS.find(u => {
      const oldId = u.id
      return oldId === a.player_id
    })?.email
    return { ...a, player_id: emailToId[playerEmail] ?? a.player_id }
  })

  const { error: availErr } = await supabase.from('availability').upsert(availRows, { onConflict: 'fixture_id,player_id' })
  if (availErr) console.error('  Availability error:', availErr.message)
  else console.log(`  ✓ ${availRows.length} availability rows`)

  // 6. Player stats
  console.log('Creating player stats...')
  const statsRows = STATS.map(s => {
    const playerEmail = USERS.find(u => u.id === s.player_id)?.email
    return { ...s, player_id: emailToId[playerEmail] ?? s.player_id }
  })
  const { error: statsErr } = await supabase.from('player_stats').upsert(statsRows)
  if (statsErr) console.error('  Stats error:', statsErr.message)
  else console.log(`  ✓ ${statsRows.length} stat rows`)

  console.log('\n✅ Seed complete!')
  console.log('\nDemo logins:')
  console.log('  admin@slotyourgame.com  / admin123')
  console.log('  captain@renaissance.cc / captain123')
  console.log('  player@renaissance.cc  / player123')
}

seed().catch(console.error)
