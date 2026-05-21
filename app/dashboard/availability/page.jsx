import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AvailabilityTracker from '@/components/availability/AvailabilityTracker'

export const metadata = { title: 'Availability — SlotYourGame' }

export default async function AvailabilityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: fixtures } = await supabase
    .from('fixtures')
    .select('*')
    .eq('team_id', profile?.team_id)
    .gte('fixture_date', new Date().toISOString().split('T')[0])
    .order('fixture_date', { ascending: true })

  const fixtureIds = fixtures?.map((f) => f.id) ?? []

  const { data: availability } = fixtureIds.length
    ? await supabase
        .from('availability')
        .select('*, profiles(id, full_name, avatar_url)')
        .in('fixture_id', fixtureIds)
    : { data: [] }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Availability</h2>
      {fixtures?.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-10 text-center">
          <p className="text-gray-500">No upcoming fixtures to track availability for.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {fixtures?.map((fixture) => (
            <AvailabilityTracker
              key={fixture.id}
              fixture={fixture}
              availability={availability?.filter((a) => a.fixture_id === fixture.id) ?? []}
              currentUserId={user.id}
              currentUserRole={profile?.role}
            />
          ))}
        </div>
      )}
    </div>
  )
}
