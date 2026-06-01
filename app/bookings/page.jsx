'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowLeft, Loader2, AlertCircle, XCircle, CheckCircle2, HelpCircle } from 'lucide-react'
import { bookingsApi } from '@/lib/api'

const STATUS_STYLE = {
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  rejected:  'bg-red-500/10 text-red-400 border-red-500/20',
}
const STATUS_ICON = {
  confirmed: CheckCircle2,
  pending:   HelpCircle,
  cancelled: XCircle,
  rejected:  XCircle,
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    bookingsApi.myTeam()
      .then(res => setBookings(res.data ?? []))
      .catch(e  => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function cancel(id) {
    if (!confirm('Cancel this booking?')) return
    try {
      await bookingsApi.cancel(id, 'Cancelled by user')
      setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: 'cancelled' } : bk))
    } catch (e) { alert(e.message) }
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <div className="border-b border-white/5 px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/grounds" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={15} /> Find Grounds
          </Link>
          <Link href="/dashboard" className="text-sm text-green-400 hover:text-green-300 font-semibold">Dashboard</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">My Bookings</h1>
        <p className="text-slate-400 text-sm mb-6">All your ground reservations</p>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading bookings…</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-4 rounded-xl">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <div><p className="font-semibold">Could not load bookings</p><p className="text-xs mt-0.5 opacity-75">{error}</p></div>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Calendar size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No bookings yet</p>
            <Link href="/grounds" className="text-sm text-green-400 hover:text-green-300 mt-3 inline-block">Browse grounds →</Link>
          </div>
        )}

        <div className="space-y-3">
          {bookings.map(b => {
            const StatusIcon  = STATUS_ICON[b.status] ?? HelpCircle
            const statusStyle = STATUS_STYLE[b.status] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
            return (
              <div key={b.id} className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-bold">{b.groundName ?? b.ground?.name ?? 'Ground'}</h2>
                    <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin size={11} />{b.groundLocation ?? b.ground?.location ?? '—'}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle}`}>
                    <StatusIcon size={11} />
                    <span className="capitalize">{b.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={11} />{b.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={11} />{b.startTime} – {b.endTime}</span>
                </div>

                {['pending', 'confirmed'].includes(b.status) && (
                  <button onClick={() => cancel(b.id)}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-colors">
                    Cancel booking
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
