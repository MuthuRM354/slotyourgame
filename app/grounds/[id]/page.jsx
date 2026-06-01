'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, Clock, ArrowLeft, Loader2, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react'
import { groundsApi, bookingsApi } from '@/lib/api'
import { isLoggedIn } from '@/lib/auth'

export default function GroundDetailPage() {
  const { id }    = useParams()
  const router    = useRouter()
  const [ground,  setGround]  = useState(null)
  const [slots,   setSlots]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [booking, setBooking] = useState(null)  // selected slot
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError,   setBookingError]   = useState('')
  const [booked,  setBooked]  = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)

  useEffect(() => {
    async function load() {
      try {
        const [gRes, sRes] = await Promise.all([
          groundsApi.get(id),
          groundsApi.slots(id, date, date),
        ])
        setGround(gRes.data)
        setSlots(sRes.data ?? [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, date])

  async function handleBook(slot) {
    if (!isLoggedIn()) { router.push(`/auth/login?next=/grounds/${id}`); return }
    setBooking(slot)
    setBookingLoading(true)
    setBookingError('')
    try {
      await bookingsApi.create({ groundId: id, slotId: slot.id, date })
      setBooked(true)
    } catch (e) {
      setBookingError(e.message)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#060b14] flex items-center justify-center gap-3 text-slate-400">
      <Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading ground…</span>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#060b14] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle size={32} className="mx-auto mb-3 text-red-400" />
        <p className="text-red-400 font-semibold">{error}</p>
        <Link href="/grounds" className="text-sm text-slate-400 mt-3 block hover:text-white">← Back to grounds</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <div className="border-b border-white/5 px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/grounds" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={15} /> All Grounds
          </Link>
          <Link href="/bookings" className="text-sm text-green-400 hover:text-green-300 font-semibold">My Bookings</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Ground info */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-xl font-bold">{ground?.name}</h1>
            {ground?.rating && (
              <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold bg-yellow-400/10 px-2 py-1 rounded-lg">
                <Star size={11} fill="currentColor" />{ground.rating}
              </div>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
            <MapPin size={13} />{ground?.location ?? ground?.city}
          </p>
          {ground?.description && <p className="text-sm text-slate-400 mb-4">{ground.description}</p>}
          <div className="flex items-center gap-1.5 text-sm text-green-400 font-semibold">
            <Clock size={13} />₹{ground?.pricePerHour ?? ground?.price ?? '—'} per hour
          </div>
        </div>

        {/* Date picker */}
        <div className="flex items-center gap-3 mb-5">
          <Calendar size={15} className="text-slate-400" />
          <label className="text-sm text-slate-400">Pick a date:</label>
          <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
            className="input-field text-sm px-3 py-2" />
        </div>

        {/* Booking success */}
        {booked && (
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-4 rounded-xl mb-5">
            <CheckCircle2 size={18} />
            <div>
              <p className="font-semibold text-sm">Booking confirmed!</p>
              <Link href="/bookings" className="text-xs underline mt-0.5 block">View my bookings →</Link>
            </div>
          </div>
        )}

        {bookingError && (
          <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-3.5 rounded-xl mb-5">
            <AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{bookingError}</span>
          </div>
        )}

        {/* Slots */}
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-3">Available Slots</h2>

        {slots.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            <Clock size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No slots available for this date</p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {slots.map(slot => (
            <button key={slot.id} onClick={() => handleBook(slot)}
              disabled={!slot.available || bookingLoading}
              className={`flex items-center justify-between p-4 rounded-xl border text-sm font-semibold transition-all ${
                slot.available
                  ? 'border-white/10 bg-white/3 hover:border-green-500/40 hover:bg-green-500/5 text-white cursor-pointer'
                  : 'border-white/5 bg-white/2 text-slate-600 cursor-not-allowed'
              }`}>
              <div className="flex items-center gap-2">
                <Clock size={13} className={slot.available ? 'text-green-400' : 'text-slate-600'} />
                <span>{slot.startTime} – {slot.endTime}</span>
              </div>
              {bookingLoading && booking?.id === slot.id
                ? <Loader2 size={13} className="animate-spin text-green-400" />
                : <span className={`text-xs px-2 py-0.5 rounded-full ${slot.available ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-slate-600'}`}>
                    {slot.available ? 'Book' : 'Taken'}
                  </span>
              }
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
