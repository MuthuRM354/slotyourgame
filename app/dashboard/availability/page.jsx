'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, CheckCircle2, XCircle, HelpCircle, Clock, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { fixturesApi, attendanceApi } from '@/lib/api'

const RSVP_STYLE = {
  yes:   'text-green-400 bg-green-500/10 border-green-500/20',
  no:    'text-red-400 bg-red-500/10 border-red-500/20',
  maybe: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
}
const RSVP_ICON = { yes: CheckCircle2, no: XCircle, maybe: HelpCircle }

export default function AvailabilityPage() {
  const [fixtures, setFixtures] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    fixturesApi.upcoming()
      .then(r => setFixtures(r.data ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5 max-w-3xl">
      <h2 className="text-2xl font-bold text-white">Attendance</h2>
      <p className="text-sm text-slate-400">Mark your availability for upcoming fixtures.</p>

      {loading && <div className="flex items-center gap-3 text-slate-400 py-8"><Loader2 size={16} className="animate-spin" /><span className="text-sm">Loading fixtures…</span></div>}
      {error   && <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-3.5 rounded-xl"><AlertCircle size={14} className="mt-0.5 shrink-0" /><span>{error}</span></div>}

      {!loading && !error && fixtures.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Calendar size={32} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No upcoming fixtures</p>
        </div>
      )}

      <div className="space-y-3">
        {fixtures.map(f => {
          const rsvp = f.myRsvp?.toLowerCase()
          const Icon = RSVP_ICON[rsvp] ?? HelpCircle
          return (
            <Link key={f.id} href={`/dashboard/attendance/${f.id}`}
              className="group flex items-center justify-between bg-[#0c1117] border border-[#1c2432] hover:border-green-500/20 rounded-xl p-4 transition-all">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-white mb-1">{f.team1Name ?? f.homeTeam} vs {f.team2Name ?? f.awayTeam}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={10} />{f.date}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{f.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                {rsvp && (
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${RSVP_STYLE[rsvp]}`}>
                    <Icon size={11} />{rsvp}
                  </span>
                )}
                <ChevronRight size={14} className="text-slate-600 group-hover:text-green-400 transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
