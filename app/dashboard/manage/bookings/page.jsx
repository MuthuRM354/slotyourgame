'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { useRole } from '@/lib/useRole'
import RoleGuard from '@/components/shared/RoleGuard'
import { groundsApi, bookingsApi } from '@/lib/api'

export default function ManageBookingsPage() {
  const { role }                 = useRole()
  const [bookings, setBookings]  = useState([])
  const [loading,  setLoading]   = useState(true)
  const [error,    setError]     = useState('')
  const [actionId, setActionId]  = useState(null)

  useEffect(() => {
    if (!role || (role !== 'ground_admin' && role !== 'super_admin')) { setLoading(false); return }
    groundsApi.list()
      .then(async res => {
        const ground = (res.data ?? [])[0]
        if (ground) {
          const bRes = await bookingsApi.forGround(ground.id)
          setBookings(bRes.data ?? [])
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [role])

  async function act(id, action) {
    setActionId(id)
    try {
      if (action === 'approve') await bookingsApi.approve(id)
      else await bookingsApi.reject(id, 'Rejected by admin')
      setBookings(b => b.map(bk => bk.id === id
        ? { ...bk, status: action === 'approve' ? 'confirmed' : 'rejected' }
        : bk))
    } catch (e) { alert(e.message) }
    finally { setActionId(null) }
  }

  return (
    <RoleGuard role={role} requiredRole="ground_admin" redirect>
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-white">Booking Requests</h2>

        {loading && <div className="flex items-center gap-3 text-slate-400 py-10"><Loader2 size={16} className="animate-spin" /><span className="text-sm">Loading…</span></div>}
        {error   && <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-3.5 rounded-xl"><AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{error}</span></div>}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <CheckCircle2 size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No bookings yet</p>
          </div>
        )}

        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm text-white">{b.teamName ?? b.team?.name ?? 'Team'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{b.date} · {b.startTime} – {b.endTime}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-semibold border ${
                  b.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  b.status === 'pending'   ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>{b.status}</span>
              </div>
              {b.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => act(b.id, 'approve')} disabled={actionId === b.id}
                    className="flex items-center gap-1.5 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                    {actionId === b.id ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />} Approve
                  </button>
                  <button onClick={() => act(b.id, 'reject')} disabled={actionId === b.id}
                    className="flex items-center gap-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                    {actionId === b.id ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={11} />} Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  )
}
