'use client'

import { useState, useEffect } from 'react'
import { bookingsApi } from '@/lib/api'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { Calendar, Clock, MapPin, IndianRupee, X } from 'lucide-react'

function BookingRow({ booking, onCancel }) {
  const [cancelling, setCancelling] = useState(false)
  const [reason, setReason]         = useState('')
  const [showForm, setShowForm]     = useState(false)

  async function handleCancel() {
    setCancelling(true)
    try {
      await onCancel(booking.id, reason)
    } finally {
      setCancelling(false)
      setShowForm(false)
    }
  }

  const canCancel = ['pending', 'confirmed'].includes(booking.status)

  return (
    <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{booking.ground_name ?? 'Ground'}</p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar size={11} /> {booking.booking_date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {booking.start_time?.slice(0,5)} – {booking.end_time?.slice(0,5)}
            </span>
            {booking.total_price && (
              <span className="flex items-center gap-0.5">
                <IndianRupee size={10} /> {booking.total_price}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge label={booking.status} />
          <Badge label={booking.payment_status} variant={booking.payment_status} />
        </div>
      </div>

      {booking.rejection_reason && (
        <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
          Rejected: {booking.rejection_reason}
        </p>
      )}

      {booking.status === 'pending' && (
        <p className="text-xs text-yellow-400">
          ⏳ Awaiting ground admin approval.
        </p>
      )}

      {/* Cancel */}
      {canCancel && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="text-xs text-gray-600 hover:text-red-400 transition flex items-center gap-1"
        >
          <X size={11} /> Cancel booking
        </button>
      )}
      {showForm && (
        <div className="space-y-2 border-t border-[#1c2432] pt-2">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for cancellation (optional)"
            className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-lg px-3 py-2 text-xs text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-700/30 px-3 py-1.5 rounded-lg transition"
            >
              {cancelling ? 'Cancelling…' : 'Confirm cancel'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 transition"
            >
              Keep
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')

  async function load() {
    setLoading(true)
    try {
      const data = await bookingsApi.myTeam()
      setBookings(data?.data ?? data ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCancel(id, reason) {
    await bookingsApi.cancel(id, reason)
    setBookings((prev) =>
      prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b)
    )
  }

  const FILTERS = ['all', 'pending', 'confirmed', 'rejected', 'cancelled', 'completed']
  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-white">My Ground Bookings</h2>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition capitalize ${
              filter === f
                ? 'bg-green-500/10 border-green-500/40 text-green-400'
                : 'border-[#1c2432] text-gray-500 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            {f === 'all' ? `All (${bookings.length})` : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No bookings"
          description="Your team hasn't booked any grounds yet."
          action={
            <a href="/dashboard/grounds" className="text-sm text-green-400 hover:underline">
              Browse grounds →
            </a>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingRow key={b.id} booking={b} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  )
}
