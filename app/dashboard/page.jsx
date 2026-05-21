import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Dashboard — SlotYourGame' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, teams(*)')
    .eq('id', user.id)
    .single()

  const role = profile?.role

  // Upcoming fixtures
  const { data: fixtures } = await supabase
    .from('fixtures')
    .select('*')
    .eq('team_id', profile?.team_id)
    .gte('fixture_date', new Date().toISOString().split('T')[0])
    .order('fixture_date', { ascending: true })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome back, {profile?.full_name?.split(' ')[0]}
        </h2>
        <p className="text-gray-400 capitalize">
          {role?.replace('_', ' ')} · {profile?.teams?.name ?? 'No team assigned'}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming Fixtures', value: fixtures?.length ?? 0 },
          { label: 'Team', value: profile?.teams?.short_name ?? '—' },
          { label: 'Role', value: role === 'league_admin' ? 'Admin' : role === 'captain' ? 'Captain' : 'Player' },
          { label: 'CricHeroes', value: profile?.cricheroes_verified ? 'Verified' : 'Unverified' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Upcoming fixtures list */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Upcoming Fixtures</h3>
          <Link href="/dashboard/fixtures" className="text-sm text-green-400 hover:underline">
            View all
          </Link>
        </div>
        {fixtures?.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming fixtures.</p>
        ) : (
          <ul className="space-y-3">
            {fixtures?.map((f) => (
              <li key={f.id} className="flex items-center justify-between border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-white font-medium">vs {f.opponent_name}</p>
                  <p className="text-xs text-gray-400">{f.fixture_date} · {f.ground_name ?? 'TBC'}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  f.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                  f.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                  'bg-yellow-900 text-yellow-300'
                }`}>
                  {f.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Role-specific quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {role === 'player' && (
          <Link href="/dashboard/availability" className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500 transition">
            <p className="text-green-400 text-lg font-bold">Mark Availability</p>
            <p className="text-gray-500 text-sm mt-1">Tell your captain if you're in</p>
          </Link>
        )}
        {(role === 'captain' || role === 'league_admin') && (
          <Link href="/dashboard/fixtures" className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500 transition">
            <p className="text-green-400 text-lg font-bold">Create Fixture</p>
            <p className="text-gray-500 text-sm mt-1">Schedule a match or nets session</p>
          </Link>
        )}
        {(role === 'captain' || role === 'league_admin') && (
          <Link href="/dashboard/roster" className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500 transition">
            <p className="text-green-400 text-lg font-bold">Manage Roster</p>
            <p className="text-gray-500 text-sm mt-1">Add or remove players</p>
          </Link>
        )}
        <Link href="/dashboard/stats" className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500 transition">
          <p className="text-green-400 text-lg font-bold">View Stats</p>
          <p className="text-gray-500 text-sm mt-1">Season performance & history</p>
        </Link>
      </div>
    </div>
  )
}
