import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ListChecks, ShieldAlert, Plus } from 'lucide-react'

export const metadata = { title: 'Manage Ground — SlotYourGame' }

export default async function ManageGroundPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (!['ground_admin', 'super_admin'].includes(profile?.role)) {
    return (
      <div className="text-center py-16">
        <p className="text-3xl mb-3">🚫</p>
        <p className="text-white font-medium">Ground Admin Access Only</p>
        <p className="text-gray-500 text-sm mt-1">You need the ground_admin role to access this section.</p>
      </div>
    )
  }

  // Fetch the ground assigned to this admin
  const { data: ground } = await supabase
    .from('grounds')
    .select('*')
    .eq('ground_admin_id', user.id)
    .single()

  // Pending booking count
  const { count: pendingCount } = ground
    ? await supabase
        .from('ground_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('ground_id', ground?.id)
        .eq('status', 'pending')
    : { count: 0 }

  // Blacklist count
  const { count: blacklistCount } = ground
    ? await supabase
        .from('ground_blacklists')
        .select('*', { count: 'exact', head: true })
        .eq('ground_id', ground?.id)
    : { count: 0 }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white">My Ground</h2>

      {!ground ? (
        <div className="bg-[#0c1117] border border-yellow-700/30 rounded-xl p-6 text-center">
          <p className="text-yellow-400 font-medium">No ground assigned yet</p>
          <p className="text-gray-500 text-sm mt-1">
            A league admin needs to register a ground and assign you as its admin.
          </p>
        </div>
      ) : (
        <>
          {/* Ground info */}
          <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{ground.name}</h3>
                <p className="text-sm text-gray-400 mt-0.5">{ground.city}</p>
              </div>
              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-500">{ground.address}</p>
            {ground.contact_phone && (
              <p className="text-sm text-gray-500">📞 {ground.contact_name} · {ground.contact_phone}</p>
            )}

            {/* Slot management */}
            <div className="flex gap-2 pt-2 border-t border-[#1c2432]">
              <Link
                href={`/dashboard/grounds/${ground.id}`}
                className="text-xs bg-[#0a0f18] hover:bg-[#1a2030] text-gray-300 border border-[#1c2432] px-3 py-1.5 rounded-lg transition flex items-center gap-1"
              >
                View ground →
              </Link>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/dashboard/manage/bookings"
              className="bg-[#0c1117] border border-[#1c2432] hover:border-yellow-500/30 rounded-xl p-5 transition group"
            >
              <ListChecks size={20} className="text-yellow-400 mb-2" />
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
              <p className="text-sm text-gray-400 group-hover:text-yellow-400 transition">Pending Bookings</p>
              <p className="text-xs text-gray-600 mt-1">Tap to approve or reject</p>
            </Link>
            <Link
              href="/dashboard/manage/blacklist"
              className="bg-[#0c1117] border border-[#1c2432] hover:border-red-500/30 rounded-xl p-5 transition group"
            >
              <ShieldAlert size={20} className="text-red-400 mb-2" />
              <p className="text-2xl font-bold text-white">{blacklistCount}</p>
              <p className="text-sm text-gray-400 group-hover:text-red-400 transition">Blacklisted Teams</p>
              <p className="text-xs text-gray-600 mt-1">Tap to manage blocks</p>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
