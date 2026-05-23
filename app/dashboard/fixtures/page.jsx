'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { hasPermission } from '@/lib/rbac'
import Tabs from '@/components/ui/Tabs'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import {
  Calendar, Clock, MapPin, Users, ChevronRight,
  Plus, CheckCircle2, XCircle, HelpCircle,
} from 'lucide-react'

const STATUS_COLOR = {
  scheduled:  'border-[#1c2432]',
  live:       'border-green-500/60',
  completed:  'border-[#1c2432]/60',
  cancelled:  'border-red-700/30',
  postponed:  'border-yellow-700/30',
}

const RSVP_ICON = {
  attending:     <CheckCircle2 size={13} className="text-green-400" />,
  not_attending: <XCircle size={13} className="text-red-400" />,
  maybe:         <HelpCircle size={13} className="text-yellow-400" />,
  pending:       null,
}

function FixtureRow({ fixture, myRsvp }) {
  const borderClass = STATUS_COLOR[fixture.status] ?? 'border-[#1c2432]'
  const isPast = fixture.status === 'completed' || fixture.status === 'cancelled'

  return (
    <Link
      href={`/dashboard/attendance/${fixture.id}`}
      className={`group bg-[#0c1117] border ${borderClass} hover:border-green-700/40 rounded-xl p-4 flex items-center gap-4 transition`}
    >
      {/* Date block */}
      <div className="flex-shrink-0 w-12 text-center">
        <p className="text-xs text-gray-500 uppercase">
          {fixture.fixture_date
            ? new Date(fixture.fixture_date).toLocaleString('default', { month: 'short' })
            : '—'}
        </p>
        <p className="text-2xl font-bold text-white leading-none">
          {fixture.fixture_date ? new Date(fixture.fixture_date).getDate() : '—'}
        </p>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-[#0a0f18] flex-shrink-0" />

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-white truncate">
            vs {fixture.opponent_name ?? 'TBD'}
          </p>
          <Badge label={fixture.status ?? 'scheduled'} />
          {isPast && fixture.result && (
            <span className="text-xs text-gray-400 bg-[#0a0f18] border border-[#1c2432] px-2 py-0.5 rounded-full">
              {fixture.result}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {fixture.fixture_date && (
            <span className="flex items-center gap-1"><Calendar size={10} />{fixture.fixture_date}</span>
          )}
          {fixture.start_time && (
            <span className="flex items-center gap-1"><Clock size={10} />{fixture.start_time?.slice(0, 5)}</span>
          )}
          {fixture.venue && (
            <span className="flex items-center gap-1"><MapPin size={10} />{fixture.venue}</span>
          )}
          {fixture.match_type && (
            <span className="flex items-center gap-1"><Users size={10} />{fixture.match_type}</span>
          )}
        </div>
      </div>

      {/* RSVP + chevron */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {myRsvp && myRsvp !== 'pending' && (
          <span title={`You: ${myRsvp}`}>{RSVP_ICON[myRsvp]}</span>
        )}
        <ChevronRight size={15} className="text-gray-600 group-hover:text-green-400 transition" />
      </div>
    </Link>
  )
}

export default function FixturesPage() {
  const [fixtures,  setFixtures]  = useState([])
  const [rsvpMap,   setRsvpMap]   = useState({})   // fixtureId → status
  const [profile,   setProfile]   = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)

  // New fixture form state
  const [form,      setForm]      = useState({ opponent_name: '', fixture_date: '', start_time: '', venue: '', match_type: '' })
  const [saving,    setSaving]    = useState(false)
  const [formErr,   setFormErr]   = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)

      const { data: fx } = await supabase
        .from('fixtures')
        .select('*')
        .eq('team_id', p?.team_id)
        .order('fixture_date', { ascending: true })

      setFixtures(fx ?? [])

      // Load own attendance for each fixture (best-effort)
      if (fx?.length) {
        const { data: att } = await supabase
          .from('match_attendance')
          .select('fixture_id, status')
          .eq('player_id', user.id)
          .in('fixture_id', fx.map((f) => f.id))

        const map = {}
        for (const a of att ?? []) map[a.fixture_id] = a.status
        setRsvpMap(map)
      }

      setLoading(false)
    }
    load()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    setFormErr('')
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('fixtures')
        .insert({ ...form, team_id: profile?.team_id })
        .select()
        .single()
      if (error) throw new Error(error.message)
      setFixtures((prev) => [...prev, data].sort((a, b) =>
        (a.fixture_date ?? '').localeCompare(b.fixture_date ?? '')
      ))
      setForm({ opponent_name: '', fixture_date: '', start_time: '', venue: '', match_type: '' })
      setShowForm(false)
    } catch (err) {
      setFormErr(err.message)
    } finally {
      setSaving(false)
    }
  }

  const today    = new Date().toISOString().split('T')[0]
  const upcoming = fixtures.filter((f) => !f.fixture_date || f.fixture_date >= today)
  const past     = fixtures.filter((f) => f.fixture_date && f.fixture_date < today)

  const canCreate = hasPermission(profile?.role, 'captain')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Fixtures</h2>
          <p className="text-sm text-gray-500 mt-0.5">Tap a match to mark your attendance</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-1.5 text-sm bg-green-500 hover:bg-green-400 text-black font-semibold px-3 py-2 rounded-lg transition"
          >
            <Plus size={15} /> New Fixture
          </button>
        )}
      </div>

      {/* Create fixture form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-[#0c1117] border border-green-700/30 rounded-xl p-5 space-y-3"
        >
          <p className="text-sm font-semibold text-green-400">Schedule a new fixture</p>
          {formErr && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
              {formErr}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Opponent *</label>
              <input required value={form.opponent_name} onChange={set('opponent_name')}
                placeholder="e.g. Chennai Challengers"
                className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Date *</label>
              <input required type="date" value={form.fixture_date} onChange={set('fixture_date')}
                className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Start Time</label>
              <input type="time" value={form.start_time} onChange={set('start_time')}
                className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Venue</label>
              <input value={form.venue} onChange={set('venue')} placeholder="Ground name or address"
                className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Format</label>
              <select value={form.match_type} onChange={set('match_type')}
                className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select format</option>
                {['T10', 'T20', 'ODI', 'Test', 'Box Cricket', 'Tape Ball'].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving}
              className="text-sm bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded-lg transition">
              {saving ? 'Saving…' : 'Create Fixture'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setFormErr('') }}
              className="text-sm text-gray-500 hover:text-gray-300 px-3 py-2 transition">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />
          ))}
        </div>
      ) : fixtures.length === 0 ? (
        <EmptyState
          icon={<Calendar size={32} className="text-gray-600" />}
          title="No fixtures yet"
          description={canCreate ? 'Use the button above to schedule your first match.' : 'Your captain will schedule fixtures soon.'}
        />
      ) : (
        <Tabs tabs={[`Upcoming (${upcoming.length})`, `Past (${past.length})`]}>
          {(tab) => (
            <>
              {tab.startsWith('Upcoming') && (
                upcoming.length === 0 ? (
                  <EmptyState icon="📅" title="No upcoming fixtures" description="Nothing scheduled yet." />
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((f) => (
                      <FixtureRow key={f.id} fixture={f} myRsvp={rsvpMap[f.id]} />
                    ))}
                  </div>
                )
              )}
              {tab.startsWith('Past') && (
                past.length === 0 ? (
                  <EmptyState icon="📋" title="No past fixtures" description="Completed matches will appear here." />
                ) : (
                  <div className="space-y-3">
                    {[...past].reverse().map((f) => (
                      <FixtureRow key={f.id} fixture={f} myRsvp={rsvpMap[f.id]} />
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </Tabs>
      )}
    </div>
  )
}
