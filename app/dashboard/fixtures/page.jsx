import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FixtureCard from '@/components/fixtures/FixtureCard'
import FixtureForm from '@/components/fixtures/FixtureForm'
import { hasPermission } from '@/lib/rbac'

export const metadata = { title: 'Fixtures — SlotYourGame' }

export default async function FixturesPage() {
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
    .order('fixture_date', { ascending: true })

  const canCreate = hasPermission(profile?.role, 'captain')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Fixtures</h2>
        {canCreate && <FixtureForm teamId={profile?.team_id} />}
      </div>

      {fixtures?.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-10 text-center">
          <p className="text-gray-500">No fixtures scheduled yet.</p>
          {canCreate && <p className="text-sm text-gray-600 mt-1">Use the button above to create your first fixture.</p>}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fixtures?.map((fixture) => (
            <FixtureCard key={fixture.id} fixture={fixture} role={profile?.role} />
          ))}
        </div>
      )}
    </div>
  )
}
