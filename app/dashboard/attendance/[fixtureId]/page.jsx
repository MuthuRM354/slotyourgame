'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { attendanceApi } from '@/lib/api'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { CheckCircle2, XCircle, HelpCircle, Users, Calendar, Clock } from 'lucide-react'

const RSVP_OPTIONS = [
  {
    status: 'attending',
    label: "I'm In",
    icon: CheckCircle2,
    color: 'bg-green-500/10 hover:bg-green-500/20 border-green-700/40 text-green-400',
    activeColor: 'bg-green-500/30 border-green-400 text-green-300',
  },
  {
    status: 'not_attending',
    label: "Can't Make It",
    icon: XCircle,
    color: 'bg-red-500/10 hover:bg-red-500/20 border-red-700/40 text-red-400',
    activeColor: 'bg-red-500/30 border-red-400 text-red-300',
  },
  {
    status: 'maybe',
    label: 'Maybe',
    icon: HelpCircle,
    color: 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-700/40 text-yellow-400',
    activeColor: 'bg-yellow-500/30 border-yellow-400 text-yellow-300',
  },
]

function AttendeeRow({ entry }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1c2432] last:border-0">
      <p className="text-sm text-gray-300">{entry.player_id}</p>
      <Badge label={entry.status} />
    </div>
  )
}

function SummaryBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400 capitalize">{label.replace('_', ' ')}</span>
        <span className="text-gray-500">{count}</span>
      </div>
      <div className="h-1.5 bg-[#0a0f18] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function AttendancePage() {
  const { fixtureId } = useParams()

  const [fixture,  setFixture]  = useState(null)
  const [myStatus, setMyStatus] = useState(null)   // current user's response
  const [summary,  setSummary]  = useState(null)
  const [roster,   setRoster]   = useState([])
  const [role,     setRole]     = useState('player')
  const [marking,  setMarking]  = useState(false)
  const [err,      setErr]      = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get role
      const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setRole(p?.role ?? 'player')

      // Get fixture details from Supabase directly
      const { data: fix } = await supabase
        .from('fixtures')
        .select('*')
        .eq('id', fixtureId)
        .single()
      setFixture(fix)

      // Load my RSVP
      try {
        const me = await attendanceApi.me(fixtureId)
        setMyStatus(me?.status ?? 'pending')
      } catch { setMyStatus('pending') }

      // Load summary
      try {
        const s = await attendanceApi.summary(fixtureId)
        setSummary(s)
      } catch {}

      // Load full roster (captain+)
      if (['captain', 'league_admin', 'super_admin'].includes(p?.role)) {
        try {
          const list = await attendanceApi.list(fixtureId)
          setRoster(list?.data ?? list ?? [])
        } catch {}
      }

      setLoading(false)
    }
    load()
  }, [fixtureId])

  async function markRSVP(status) {
    setMarking(true)
    setErr('')
    try {
      await attendanceApi.mark(fixtureId, status)
      setMyStatus(status)
      // Refresh summary
      const s = await attendanceApi.summary(fixtureId)
      setSummary(s)
    } catch (e) {
      setErr(e.message)
    } finally {
      setMarking(false)
    }
  }

  const isCaptainPlus = ['captain', 'league_admin', 'super_admin'].includes(role)
  const total = summary ? (summary.total ?? Object.values(summary).reduce((a, b) => a + b, 0)) : 0

  return (
    <div className="space-y-6 max-w-xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Match Attendance</h2>
        {fixture && (
          <div className="flex flex-wrap gap-3 text-sm text-gray-400 mt-1">
            <span className="flex items-center gap-1.5">
              <Users size={14} /> vs {fixture.opponent_name ?? 'TBD'}
            </span>
            {fixture.fixture_date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {fixture.fixture_date}
              </span>
            )}
            {fixture.start_time && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {fixture.start_time?.slice(0, 5)}
              </span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* RSVP buttons */}
          <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 space-y-4">
            <p className="text-sm font-medium text-gray-300">Your RSVP</p>
            {err && (
              <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
                {err}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              {RSVP_OPTIONS.map(({ status, label, icon: Icon, color, activeColor }) => {
                const isActive = myStatus === status
                return (
                  <button
                    key={status}
                    onClick={() => markRSVP(status)}
                    disabled={marking}
                    className={`flex-1 flex items-center justify-center gap-2 border rounded-xl px-4 py-3 text-sm font-medium transition disabled:opacity-50 ${
                      isActive ? activeColor : color
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                    {isActive && <span className="text-xs opacity-70">(current)</span>}
                  </button>
                )
              })}
            </div>
            {myStatus && myStatus !== 'pending' && (
              <p className="text-xs text-gray-500">
                You responded · tap any option to change your RSVP
              </p>
            )}
          </div>

          {/* Summary */}
          {summary && (
            <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-300">Team Response</p>
                <span className="text-xs text-gray-600">{total} total</span>
              </div>
              <SummaryBar label="attending"     count={summary.attending     ?? 0} total={total} color="bg-green-500" />
              <SummaryBar label="maybe"         count={summary.maybe         ?? 0} total={total} color="bg-yellow-500" />
              <SummaryBar label="not_attending" count={summary.not_attending ?? 0} total={total} color="bg-red-500" />
              <SummaryBar label="pending"       count={summary.pending       ?? 0} total={total} color="bg-gray-600" />
            </div>
          )}

          {/* Full roster — captains only */}
          {isCaptainPlus && (
            <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#1c2432] flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Player Responses</p>
                <span className="text-xs text-gray-500">{roster.length} players</span>
              </div>
              {roster.length === 0 ? (
                <EmptyState
                  icon={<Users size={28} className="text-gray-600" />}
                  title="No responses yet"
                  description="Players haven't marked their availability for this match."
                />
              ) : (
                <div className="px-5 py-1">
                  {roster.map((e) => (
                    <AttendeeRow key={e.id ?? e.player_id} entry={e} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
