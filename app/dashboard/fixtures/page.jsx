'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ChevronRight, Loader2, AlertCircle, Plus } from 'lucide-react'
import { fixturesApi } from '@/lib/api'
import { useRole } from '@/lib/useRole'
import { isCaptainOrAbove } from '@/lib/rbac'

const STATUS_COLOR = {
  scheduled:  'bg-slate-500/10 text-slate-400 border-slate-500/20',
  live:       'bg-green-500/10 text-green-400 border-green-500/20',
  completed:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
  postponed:  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
}

export default function FixturesPage() {
  const { role }                    = useRole()
  const [fixtures, setFixtures]     = useState([])
  const [loading,  setLoading]      = useState(true)
  const [error,    setError]        = useState('')

  useEffect(() => {
    fixturesApi.list()
      .then(r => setFixtures(r.data ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Fixtures</h2>
        {isCaptainOrAbove(role) && (
          <button className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm">
            <Plus size={14} /> New Fixture
          </button>
        )}
      </div>

      {loading && <div className="flex items-center gap-3 text-slate-400 py-8"><Loader2 size={16} className="animate-spin" /><span className="text-sm">Loading fixtures…</span></div>}
      {error   && <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-3.5 rounded-xl"><AlertCircle size={14} className="mt-0.5 shrink-0" /><span>{error}</span></div>}

      {!loading && !error && fixtures.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Calendar size={32} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No fixtures yet</p>
          {isCaptainOrAbove(role) && <p className="text-sm mt-1">Create your first fixture to get started</p>}
        </div>
      )}

      <div className="space-y-3">
        {fixtures.map(f => (
          <Link key={f.id} href={`/dashboard/attendance/${f.id}`}
            className="group flex items-center justify-between bg-[#0c1117] border border-[#1c2432] hover:border-green-500/20 rounded-xl p-4 transition-all">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-sm text-white truncate">{f.team1Name ?? f.homeTeam} vs {f.team2Name ?? f.awayTeam}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold shrink-0 ${STATUS_COLOR[f.status] ?? STATUS_COLOR.scheduled}`}>
                  {f.type ?? f.matchType ?? 'T20'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={10} />{f.date}</span>
                <span className="flex items-center gap-1"><Clock size={10} />{f.time}</span>
                {f.venue && <span className="flex items-center gap-1 truncate"><MapPin size={10} />{f.venue}</span>}
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-600 group-hover:text-green-400 transition-colors shrink-0 ml-2" />
          </Link>
        ))}
      </div>
    </div>
  )
}
