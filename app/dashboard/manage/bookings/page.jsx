'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { bookingsApi } from '@/lib/api'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import Tabs from '@/components/ui/Tabs'
import { Calendar, Clock, IndianRupee, CheckCircle, XCircle, Users } from 'lucide-react'

function BookingCard({ booking, onApprove, onReject }) {
  const [action,  setAction]  = useState(null)   // 'approve' | 'reject'
  const [reason,  setReason]  = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [err,     setErr]     = useState('')

  async function submit() {
    setLoading(true)
    setErr('')
    try {
      if (action === 'approve') await onApprove(booking.id)
      else                      await onReject(booking.id, reason)
      setDone(true)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-[#0c1117] border rounded-xl p-4 space-y-3 ${
      done
        ? action === 'approve' ? 'border-green-700/40' : 'border-red-700/40'
        : 'border-[#1c2432]'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Team booking · {booking.booking_date}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Clock size={11} /> {booking.start_time?.slice(0,5)} – {booking.end_time?.slice(0,5)}
            </span>
            {booking.total_price && (
              <span className="flex items-center gap-0.5">
                <IndianRupee size={10} /> {booking.total_price}
              </span>
            )}
            {booking.opponent_team_id && (
              <span className="flex items-center gap-1">
                <Users size={11} /> Has opponent (match request)
              </span>
            )}
          </div>
          {booking.notes && (
            <p className="text-xs text-gray-600 mt-1 italic">{booking.notes}</p>
          )}
        </div>
        <Badge label={done ? (action === 'approve' ? 'confirmed' : 'rejected') : booking.status} />
      </div>

      {done ? (
        <p className={`text-xs ${action === 'approve' ? 'text-green-400' : 'text-red-400'}`}>
          {action === 'approve' ? '✓ Booking approved.' : '✗ Booking rejected.'}
        </p>
      ) : booking.status === 'pending' ? (
        !action ? (
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setAction('approve')}
              className="flex items-center gap-1.5 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-700/30 px-3 py-1.5 rounded-lg transition"
            >
              <CheckCircle size={13} /> Approve
            </button>
            <button
              onClick={() => setAction('reject')}
              className="flex items-center gap-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-700/30 px-3 py-1.5 rounded-lg transition"
            >
              <XCircle size={13} /> Reject
            </button>
          </div>
        ) : (
          <div className="space-y-2 border-t border-[#1c2432] pt-2">
            <p className="text-xs font-medium text-white capitalize">{action} this booking?</p>
            {action === 'reject' && (
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason (shown to captain)…"
                className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-lg px-3 py-2 text-xs text-white"
              />
            )}
            {err && <p className="text-xs text-red-400">{err}</p>}
            <div className="flex gap-2">
              <button
                onClick={submit}
                disabled={loading}
                className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${
                  action === 'approve'
                    ? 'bg-green-500 hover:bg-green-400 text-black'
                    : 'bg-red-500 hover:bg-red-400 text-white'
                } disabled:opacity-50`}
              >
                {loading ? '…' : `Confirm ${action}`}
              </button>
              <button
                onClick={() => { setAction(null); setReason(''); setErr('') }}
                className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1.5 transition"
              >
                Back
              </button>
            </div>
          </div>
        )
      ) : null}
    </div>
  )
}

export default function ManageBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [groundId, setGroundId] = useState(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data: ground } = await supabase
        .from('grounds')
        .select('id')
        .eq('ground_admin_id', user.id)
        .single()

      if (!ground) { setLoading(false); return }
      setGroundId(ground.id)

      try {
        const data = await bookingsApi.forGround(ground.id)
        setBookings(data?.data ?? data ?? [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleApprove(id) {
    await bookingsApi.approve(id)
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'confirmed' } : b))
  }

  async function handleReject(id, reason) {
    await bookingsApi.reject(id, reason)
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'rejected', rejection_reason: reason } : b))
  }

  const pending   = bookings.filter((b) => b.status === 'pending')
  const confirmed = bookings.filter((b) => b.status === 'confirmed')
  const others    = bookings.filter((b) => !['pending','confirmed'].includes(b.status))

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-white">Manage Bookings</h2>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-24 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />)}
        </div>
      ) : !groundId ? (
        <EmptyState icon="🏟️" title="No ground assigned" description="You need a ground assigned to your account to manage bookings." />
      ) : (
        <Tabs tabs={['Pending', 'Confirmed', 'History']}>
          {(tab) => (
            <>
              {tab === 'Pending' && (
                pending.length === 0
                  ? <EmptyState icon="✅" title="All caught up" description="No pending bookings to action." />
                  : <div className="space-y-3">
                      {pending.length > 0 && (
                        <p className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-700/30 rounded-lg px-3 py-2">
                          {pending.length} booking{pending.length > 1 ? 's' : ''} awaiting your approval
                        </p>
                      )}
                      {pending.map((b) => (
                        <BookingCard key={b.id} booking={b} onApprove={handleApprove} onReject={handleReject} />
                      ))}
                    </div>
              )}
              {tab === 'Confirmed' && (
                confirmed.length === 0
                  ? <EmptyState icon="📅" title="No confirmed bookings" />
                  : <div className="space-y-3">
                      {confirmed.map((b) => <BookingCard key={b.id} booking={b} onApprove={handleApprove} onReject={handleReject} />)}
                    </div>
              )}
              {tab === 'History' && (
                others.length === 0
                  ? <EmptyState icon="📋" title="No history yet" />
                  : <div className="space-y-3">
                      {others.map((b) => <BookingCard key={b.id} booking={b} onApprove={handleApprove} onReject={handleReject} />)}
                    </div>
              )}
            </>
          )}
        </Tabs>
      )}
    </div>
  )
}
