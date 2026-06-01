'use client'

import { useState, useEffect } from 'react'
import { marketplaceApi } from '@/lib/api'
import { useRole } from '@/lib/useRole'
import EmptyState from '@/components/ui/EmptyState'
import Tabs from '@/components/ui/Tabs'
import { MapPin, Clock, Plus, Trash2, UserSearch } from 'lucide-react'

function AvailabilityCard({ entry }) {
  const times = (() => {
    try { return JSON.parse(entry.preferred_times ?? '[]') }
    catch { return [] }
  })()

  return (
    <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-white text-sm">{entry.player_id}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1"><MapPin size={11} />{entry.city ?? 'Any'}</span>
            <span>·</span>
            <span>{entry.available_date}</span>
          </div>
        </div>
      </div>
      {times.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {times.map((t) => (
            <span key={t} className="flex items-center gap-1 text-xs bg-[#0a0f18] border border-[#1c2432] text-gray-400 px-2 py-0.5 rounded-full">
              <Clock size={9} /> {t}
            </span>
          ))}
        </div>
      )}
      {entry.notes && <p className="text-xs text-gray-600 italic">{entry.notes}</p>}
    </div>
  )
}

function MyListingRow({ entry, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try { await onDelete(entry.id) }
    finally { setDeleting(false) }
  }

  return (
    <div className="flex items-center justify-between bg-[#0c1117] border border-[#1c2432] rounded-xl px-4 py-3">
      <div>
        <p className="text-sm text-white font-medium">{entry.available_date}</p>
        <p className="text-xs text-gray-500 mt-0.5">{entry.city ?? 'No city'} · {entry.is_active ? 'Active' : 'Hidden'}</p>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-gray-600 hover:text-red-400 transition disabled:opacity-50"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

export default function MarketplacePage() {
  const [tab,       setTab]       = useState('Browse')
  const [date,      setDate]      = useState('')
  const [city,      setCity]      = useState('')
  const [players,   setPlayers]   = useState([])
  const [mine,      setMine]      = useState([])
  const [loading,   setLoading]   = useState(false)
  const { role } = useRole()

  // Post form
  const [form, setForm]   = useState({ availableDate: '', city: '', preferredTimes: '', notes: '' })
  const [posting, setPosting] = useState(false)
  const [postErr, setPostErr] = useState('')
  const [postOk,  setPostOk]  = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => { loadMine() }, [])

  async function search() {
    setLoading(true)
    try {
      const data = await marketplaceApi.browse(date || undefined, city || undefined)
      setPlayers(data?.data ?? data ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function loadMine() {
    try {
      const data = await marketplaceApi.mine()
      setMine(data?.data ?? data ?? [])
    } catch {}
  }

  async function postAvailability(e) {
    e.preventDefault()
    setPosting(true)
    setPostErr('')
    setPostOk(false)
    try {
      const entry = await marketplaceApi.post({
        availableDate: form.availableDate,
        city: form.city,
        preferredTimes: form.preferredTimes
          ? JSON.stringify(form.preferredTimes.split(',').map((s) => s.trim()))
          : undefined,
        notes: form.notes,
      })
      setMine((prev) => [entry?.data ?? entry, ...prev])
      setForm({ availableDate: '', city: '', preferredTimes: '', notes: '' })
      setPostOk(true)
    } catch (e) {
      setPostErr(e.message)
    } finally {
      setPosting(false)
    }
  }

  async function deleteEntry(id) {
    await marketplaceApi.delete(id)
    setMine((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Free Agent Board</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Players post availability · Captains find players for their team
        </p>
      </div>

      <Tabs tabs={['Browse', 'Post Availability', 'My Listings']} value={tab} onChange={setTab}>
        {(active) => (
          <>
            {/* ── Browse ─────────────────────────────────────────────────── */}
            {active === 'Browse' && (
              <div className="space-y-4">
                <div className="flex gap-3 flex-col sm:flex-row">
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    className="flex-1 bg-[#0c1117] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white" />
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                    placeholder="City (optional)…"
                    className="flex-1 bg-[#0c1117] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500" />
                  <button
                    onClick={search}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded-lg text-sm transition"
                  >
                    {loading ? 'Searching…' : 'Search'}
                  </button>
                </div>

                {players.length === 0 ? (
                  <EmptyState
                    icon={<UserSearch size={32} className="text-gray-600" />}
                    title="No players found"
                    description="Try selecting a date to find available players."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {players.map((p) => <AvailabilityCard key={p.id} entry={p} />)}
                  </div>
                )}
              </div>
            )}

            {/* ── Post ───────────────────────────────────────────────────── */}
            {active === 'Post Availability' && (
              <form onSubmit={postAvailability} className="space-y-4 max-w-md">
                {postOk && (
                  <div className="text-sm text-green-300 bg-green-900/30 border border-green-700 rounded-lg px-4 py-3">
                    ✓ Availability posted! Captains can now find you.
                  </div>
                )}
                {postErr && (
                  <div className="text-sm text-red-300 bg-red-900/30 border border-red-700 rounded-lg px-4 py-3">
                    {postErr}
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Available Date *</label>
                  <input type="date" required value={form.availableDate} onChange={set('availableDate')}
                    className="w-full bg-[#0c1117] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">City</label>
                  <input type="text" value={form.city} onChange={set('city')} placeholder="e.g. Chennai"
                    className="w-full bg-[#0c1117] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Preferred times (comma-separated)
                  </label>
                  <input type="text" value={form.preferredTimes} onChange={set('preferredTimes')}
                    placeholder="08:00-10:00, 18:00-20:00"
                    className="w-full bg-[#0c1117] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Notes (optional)</label>
                  <textarea value={form.notes} onChange={set('notes')} rows={2}
                    placeholder="Any extra info for the captain…"
                    className="w-full bg-[#0c1117] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <button
                  type="submit"
                  disabled={posting}
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-semibold px-5 py-2.5 rounded-lg transition text-sm"
                >
                  <Plus size={15} />
                  {posting ? 'Posting…' : 'Post Availability'}
                </button>
              </form>
            )}

            {/* ── My listings ────────────────────────────────────────────── */}
            {active === 'My Listings' && (
              mine.length === 0
                ? <EmptyState icon="🙋" title="No listings yet" description="Post your availability so captains can find you." />
                : <div className="space-y-2">
                    {mine.map((e) => <MyListingRow key={e.id} entry={e} onDelete={deleteEntry} />)}
                  </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  )
}
