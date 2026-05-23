'use client'

/**
 * Availability page — shows upcoming fixtures with the player's RSVP status.
 * Uses the new match_attendance table.
 * Clicking a fixture goes to /dashboard/attendance/[id] to change the response.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { Calendar, CheckCircle2, XCircle, HelpCircle, Clock, ChevronRight } from 'lucide-react'

const RSVP_CHIP = {
  attending: {
    icon:  <CheckCircle2 size={13} className="text-green-400" />,
    label: "I'm In",
    cls:   'bg-green-500/10 border-green-500/30 text-green-400',
  },
  not_attending: {
    icon:  <XCircle size={13} className="text-red-400" />,
    label: "Can't make it",
    cls:   'bg-red-500/10 border-red-500/30 text-red-400',
  },
  maybe: {
    icon:  <HelpCircle size={13} className="text-yellow-400" />,
    label: 'Maybe',
    cls:   'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  },
  pending: {
    icon:  <Clock size={13} className="text-gray-500" />,
    label: 'No response',
    cls:   'bg-[#0a0f18] border-[#1c2432] text-gray-500',
  },
}

function FixtureRsvpRow({ fixture, myStatus }) {
  const chip = RSVP_CHIP[myStatus] ?? RSVP_CHIP.pending

  return (
    <Link
      href={`/dashboard/attendance/${fixture.id}`}
      className="group bg-[#0c1117] border border-[#1c2432] hover:border-green-700/40 rounded-xl p-4 flex items-center gap-4 transition"
    >
      {/* Date bubble */}
      <div className="flex-shrink-0 w-11 text-center">
        <p className="text-xs text-gray-500 uppercase leading-none">
          {fixture.fixture_date
            ? new Date(fixture.fixture_date).toLocaleString('default', { month: 'short' })
            : '—'}
        </p>
        <p className="text-xl font-bold text-white leading-none mt-0.5">
          {fixture.fixture_date ? new Date(fixture.fixture_date).getDate() : '—'}
        </p>
      </div>

      <div className="w-px h-9 bg-[#0a0f18] flex-shrink-0" />

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-semibold text-white truncate">
          vs {fixture.opponent_name ?? 'TBD'}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {fixture.start_time && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={10} /> {fixture.start_time.slice(0, 5)}
            </span>
          )}
          {fixture.venue && (
            <span className="text-xs text-gray-500 truncate">{fixture.venue}</span>
          )}
          {fixture.match_type && (
            <span className="text-xs text-gray-600">{fixture.match_type}</span>
          )}
        </div>
      </div>

      {/* RSVP chip */}
      <div className={`flex-shrink-0 flex items-center gap-1.5 text-xs border px-2.5 py-1 rounded-full ${chip.cls}`}>
        {chip.icon}
        <span className="hidden sm:inline">{chip.label}</span>
      </div>

      <ChevronRight size={14} className="text-gray-600 group-hover:text-green-400 flex-shrink-0 transition" />
    </Link>
  )
}

export default function AvailabilityPage() {
  const [fixtures, setFixtures] = useState([])
  const [rsvpMap,  setRsvpMap]  = useState({})
  const [loading,  setLoading]  = useState(true)

  // Counts
  const yes     = Object.values(rsvpMap).filter((s) => s === 'attending').length
  const no      = Object.values(rsvpMap).filter((s) => s === 'not_attending').length
  const maybe   = Object.values(rsvpMap).filter((s) => s === 'maybe').length
  const pending = fixtures.length - yes - no - maybe

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: p } = await supabase.from('profiles').select('team_id').eq('id', user.id).single()

      const today = new Date().toISOString().split('T')[0]

      const { data: fx } = await supabase
        .from('fixtures')
        .select('*')
        .eq('team_id', p?.team_id)
        .gte('fixture_date', today)
        .order('fixture_date', { ascending: true })

      setFixtures(fx ?? [])

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

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">My Availability</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Let your captain know which matches you can make
        </p>
      </div>

      {/* Summary strip */}
      {!loading && fixtures.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "I'm In",       value: yes,     cls: 'text-green-400' },
            { label: 'Maybe',         value: maybe,   cls: 'text-yellow-400' },
            { label: "Can't Make It", value: no,      cls: 'text-red-400' },
            { label: 'No Response',   value: pending, cls: 'text-gray-500' },
          ].map(({ label, value, cls }) => (
            <div key={label} className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-3 text-center">
              <p className={`text-xl font-bold ${cls}`}>{value}</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Fixtures list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />
          ))}
        </div>
      ) : fixtures.length === 0 ? (
        <EmptyState
          icon={<Calendar size={32} className="text-gray-600" />}
          title="No upcoming fixtures"
          description="Your captain will schedule matches soon. Check back here to RSVP."
          action={
            <Link href="/dashboard/fixtures" className="text-sm text-green-400 hover:underline">
              View all fixtures →
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {fixtures.map((f) => (
            <FixtureRsvpRow
              key={f.id}
              fixture={f}
              myStatus={rsvpMap[f.id] ?? 'pending'}
            />
          ))}
          <p className="text-xs text-center text-gray-600 pt-1">
            Tap any fixture to change your RSVP
          </p>
        </div>
      )}
    </div>
  )
}
