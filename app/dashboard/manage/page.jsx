'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ListChecks, ShieldAlert, Loader2 } from 'lucide-react'
import { useRole } from '@/lib/useRole'
import RoleGuard from '@/components/shared/RoleGuard'
import { groundsApi, bookingsApi, blacklistApi } from '@/lib/api'

export default function ManageGroundPage() {
  const { role }                      = useRole()
  const [ground,        setGround]    = useState(null)
  const [pendingCount,  setPending]   = useState(0)
  const [blacklistCount,setBlacklist] = useState(0)
  const [loading,       setLoading]   = useState(true)

  useEffect(() => {
    if (role !== 'ground_admin' && role !== 'super_admin') { setLoading(false); return }
    // Load grounds managed by this user
    groundsApi.list()
      .then(async res => {
        const myGround = (res.data ?? [])[0]
        setGround(myGround)
        if (myGround) {
          const [bRes, blRes] = await Promise.allSettled([
            bookingsApi.forGround(myGround.id),
            blacklistApi.list(myGround.id),
          ])
          const bookings = bRes.status === 'fulfilled' ? (bRes.value.data ?? []) : []
          setPending(bookings.filter(b => b.status === 'pending').length)
          setBlacklist(blRes.status === 'fulfilled' ? (blRes.value.data ?? []).length : 0)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [role])

  return (
    <RoleGuard role={role} requiredRole="ground_admin" redirect>
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-white">My Ground</h2>

        {loading && (
          <div className="flex items-center gap-3 text-slate-400 py-10">
            <Loader2 size={16} className="animate-spin" /><span className="text-sm">Loading…</span>
          </div>
        )}

        {!loading && !ground && (
          <div className="bg-[#0c1117] border border-yellow-700/30 rounded-xl p-6 text-center">
            <p className="text-yellow-400 font-medium">No ground registered yet</p>
            <p className="text-slate-500 text-sm mt-1">Register your ground to start accepting bookings.</p>
            <Link href="/grounds" className="text-xs text-green-400 hover:text-green-300 mt-3 inline-block">
              Browse grounds →
            </Link>
          </div>
        )}

        {!loading && ground && (
          <>
            <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{ground.name}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{ground.city ?? ground.location}</p>
                </div>
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full">Active</span>
              </div>
              {ground.address && <p className="text-sm text-slate-500">{ground.address}</p>}
              <div className="pt-2 border-t border-[#1c2432]">
                <Link href={`/dashboard/grounds/${ground.id}`}
                  className="text-xs bg-[#0a0f18] hover:bg-[#1a2030] text-slate-300 border border-[#1c2432] px-3 py-1.5 rounded-lg transition">
                  View ground →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/manage/bookings"
                className="bg-[#0c1117] border border-[#1c2432] hover:border-yellow-500/30 rounded-xl p-5 transition group">
                <ListChecks size={20} className="text-yellow-400 mb-2" />
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
                <p className="text-sm text-slate-400 group-hover:text-yellow-400 transition">Pending Bookings</p>
                <p className="text-xs text-slate-600 mt-1">Tap to approve or reject</p>
              </Link>
              <Link href="/dashboard/manage/blacklist"
                className="bg-[#0c1117] border border-[#1c2432] hover:border-red-500/30 rounded-xl p-5 transition group">
                <ShieldAlert size={20} className="text-red-400 mb-2" />
                <p className="text-2xl font-bold text-white">{blacklistCount}</p>
                <p className="text-sm text-slate-400 group-hover:text-red-400 transition">Blacklisted Teams</p>
                <p className="text-xs text-slate-600 mt-1">Tap to manage blocks</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  )
}
