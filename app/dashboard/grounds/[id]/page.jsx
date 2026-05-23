'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { bookingsApi } from '@/lib/api'
import { MapPin, Phone, Clock, IndianRupee, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'

function SlotCard({ slot, onBook, booking }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [err, setErr]         = useState('')

  async function handleBook() {
    setLoading(true)
    setErr('')
    try {
      await onBook(slot.id)
      setDone(true)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!slot.is_available) {
    return (
      <div className="bg-[#0a0f18]/50 border border-[#1c2432] rounded-xl p-4 opacity-60">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-white">{slot.slot_date}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {slot.start_time?.slice(0,5)} – {slot.end_time?.slice(0,5)}
            </p>
          </div>
          <Badge label="Booked" variant="cancelled" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-4 hover:border-green-500/30 transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-white">{slot.slot_date}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Clock size={11} /> {slot.start_time?.slice(0,5)} – {slot.end_time?.slice(0,5)}
            </span>
            {slot.price && (
              <span className="flex items-center gap-0.5">
                <IndianRupee size={10} /> {slot.price}
              </span>
            )}
          </div>
          {slot.notes && <p className="text-xs text-gray-600 mt-1">{slot.notes}</p>}
        </div>
        {done ? (
          <Badge label="Requested" variant="pending" />
        ) : (
          <button
            onClick={handleBook}
            disabled={loading}
            className="text-xs bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-semibold px-3 py-1.5 rounded-lg transition"
          >
            {loading ? '…' : 'Book'}
          </button>
        )}
      </div>
      {err && <p className="text-xs text-red-400 mt-2">{err}</p>}
      {done && (
        <p className="text-xs text-yellow-400 mt-2">
          Booking sent — awaiting ground admin approval.
        </p>
      )}
    </div>
  )
}

export default function GroundDetailPage() {
  const { id }                = useParams()
  const [ground, setGround]   = useState(null)
  const [slots, setSlots]     = useState([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [opponentTeamId, setOpponentTeamId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo,   setDateTo]   = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const [{ data: g }, { data: p }] = await Promise.all([
        supabase.from('grounds').select('*').eq('id', id).single(),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
      ])

      setGround(g)
      setProfile(p)

      // Default: next 30 days
      const from = new Date().toISOString().split('T')[0]
      const to   = new Date(Date.now() + 30 * 86400_000).toISOString().split('T')[0]
      setDateFrom(from)
      setDateTo(to)

      const { data: s } = await supabase
        .from('ground_slots')
        .select('*')
        .eq('ground_id', id)
        .gte('slot_date', from)
        .lte('slot_date', to)
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true })

      setSlots(s ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  async function reloadSlots() {
    if (!dateFrom || !dateTo) return
    const supabase = createClient()
    const { data: s } = await supabase
      .from('ground_slots')
      .select('*')
      .eq('ground_id', id)
      .gte('slot_date', dateFrom)
      .lte('slot_date', dateTo)
      .order('slot_date', { ascending: true })
      .order('start_time', { ascending: true })
    setSlots(s ?? [])
  }

  async function bookSlot(slotId) {
    await bookingsApi.create({
      slotId,
      opponentTeamId: opponentTeamId || undefined,
    })
    // Re-fetch slots so the booked one turns grey
    await reloadSlots()
  }

  const isCaptain = ['captain', 'league_admin', 'super_admin'].includes(profile?.role)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />
        <div className="h-64 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />
      </div>
    )
  }

  if (!ground) {
    return <p className="text-gray-500">Ground not found.</p>
  }

  const available = slots.filter((s) => s.is_available)
  const booked    = slots.filter((s) => !s.is_available)

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back */}
      <Link href="/dashboard/grounds" className="flex items-center gap-1 text-sm text-gray-500 hover:text-white transition">
        <ChevronLeft size={15} /> All grounds
      </Link>

      {/* Ground info card */}
      <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{ground.name}</h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1">
              <MapPin size={13} /> {ground.city}
            </div>
          </div>
          <Badge label="Active" variant="confirmed" />
        </div>

        <p className="text-sm text-gray-400">{ground.address}</p>

        {ground.contact_name && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Phone size={13} />
            {ground.contact_name}{ground.contact_phone ? ` · ${ground.contact_phone}` : ''}
          </div>
        )}

        {ground.facilities && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {JSON.parse(ground.facilities ?? '[]').map((f) => (
              <span key={f} className="text-xs bg-[#0a0f18] border border-[#1c2432] text-gray-300 px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        )}

        {ground.maps_url && (
          <a
            href={ground.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:underline"
          >
            <MapPin size={12} /> Open in Google Maps
          </a>
        )}
      </div>

      {/* Slot picker */}
      <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Available Slots</h3>
          <div className="flex gap-2">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="text-xs bg-[#0a0f18] border border-[#1c2432] rounded-lg px-2 py-1.5 text-white" />
            <span className="text-gray-600 self-center text-xs">to</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="text-xs bg-[#0a0f18] border border-[#1c2432] rounded-lg px-2 py-1.5 text-white" />
            <button onClick={reloadSlots}
              className="text-xs bg-[#0a0f18] hover:bg-[#1a2030] text-gray-300 border border-[#1c2432] px-3 py-1.5 rounded-lg transition">
              Go
            </button>
          </div>
        </div>

        {/* Opponent team (optional) */}
        {isCaptain && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Opponent team ID (optional — if you've arranged a match)
            </label>
            <input
              type="text"
              value={opponentTeamId}
              onChange={(e) => setOpponentTeamId(e.target.value)}
              placeholder="UUID of opposing team…"
              className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}

        {!isCaptain && (
          <p className="text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-700/30 rounded-lg px-3 py-2">
            Only captains can book ground slots.
          </p>
        )}

        {slots.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No slots available in this date range.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">{available.length} available · {booked.length} booked</p>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {slots.map((slot) => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  onBook={isCaptain ? bookSlot : null}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
