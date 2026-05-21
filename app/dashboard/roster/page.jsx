import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PlayerRow from '@/components/roster/PlayerRow'
import RoleGuard from '@/components/shared/RoleGuard'

export const metadata = { title: 'Roster — SlotYourGame' }

export default async function RosterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // League admins see all, captains/players see their team
  let query = supabase.from('profiles').select('*, teams(name)')
  if (profile?.role !== 'league_admin') {
    query = query.eq('team_id', profile?.team_id)
  }
  const { data: players } = await query.order('full_name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {profile?.role === 'league_admin' ? 'All Players' : 'Team Roster'}
        </h2>
        <span className="text-sm text-gray-400">{players?.length ?? 0} players</span>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left p-4">Player</th>
              <th className="text-left p-4 hidden sm:table-cell">Role</th>
              <th className="text-left p-4 hidden md:table-cell">Team</th>
              <th className="text-left p-4 hidden sm:table-cell">CricHeroes</th>
              {profile?.role !== 'player' && <th className="text-right p-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {players?.map((player) => (
              <PlayerRow
                key={player.id}
                player={player}
                currentUserRole={profile?.role}
                currentUserId={user.id}
              />
            ))}
          </tbody>
        </table>
        {players?.length === 0 && (
          <p className="text-center text-gray-500 py-10">No players found.</p>
        )}
      </div>
    </div>
  )
}
