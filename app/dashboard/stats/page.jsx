import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Stats — SlotYourGame' }

export default async function StatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: stats } = await supabase
    .from('player_stats')
    .select('*, fixtures(opponent_name, fixture_date)')
    .eq('player_id', user.id)
    .order('created_at', { ascending: false })

  const totals = (stats ?? []).reduce(
    (acc, s) => ({
      runs: acc.runs + (s.runs_scored ?? 0),
      wickets: acc.wickets + (s.wickets_taken ?? 0),
      catches: acc.catches + (s.catches ?? 0),
      innings: acc.innings + 1,
    }),
    { runs: 0, wickets: 0, catches: 0, innings: 0 }
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        {profile?.full_name}&apos;s Stats
      </h2>

      {/* Season totals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Runs', value: totals.runs },
          { label: 'Wickets', value: totals.wickets },
          { label: 'Catches', value: totals.catches },
          { label: 'Innings', value: totals.innings },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Per-match breakdown */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h3 className="font-semibold text-white">Match History</h3>
        </div>
        {stats?.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No stats recorded yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
                <th className="text-left p-4">Match</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Runs</th>
                <th className="text-left p-4 hidden sm:table-cell">Balls</th>
                <th className="text-left p-4">Wkts</th>
                <th className="text-left p-4 hidden sm:table-cell">Overs</th>
                <th className="text-left p-4 hidden md:table-cell">Catches</th>
              </tr>
            </thead>
            <tbody>
              {stats?.map((s) => (
                <tr key={s.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                  <td className="p-4 text-white">vs {s.fixtures?.opponent_name}</td>
                  <td className="p-4 text-gray-400 text-sm">{s.fixtures?.fixture_date}</td>
                  <td className="p-4 text-green-400 font-semibold">{s.runs_scored}</td>
                  <td className="p-4 text-gray-400 hidden sm:table-cell">{s.balls_faced}</td>
                  <td className="p-4 text-yellow-400 font-semibold">{s.wickets_taken}</td>
                  <td className="p-4 text-gray-400 hidden sm:table-cell">{s.overs_bowled}</td>
                  <td className="p-4 text-gray-400 hidden md:table-cell">{s.catches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
