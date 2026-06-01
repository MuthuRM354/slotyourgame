'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Loader2, AlertCircle, Target, Shield, Zap } from 'lucide-react'
import { statsApi, playersApi } from '@/lib/api'

function StatBar({ label, value, max, color = 'bg-green-500' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{label}</span><span className="font-bold text-white">{value}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function StatsPage() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    playersApi.me()
      .then(r => statsApi.player(r.data?.id ?? r.data?.userId))
      .then(r => setStats(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white">My Stats</h2>

      {loading && <div className="flex items-center gap-3 text-slate-400 py-8"><Loader2 size={16} className="animate-spin" /><span className="text-sm">Loading stats…</span></div>}
      {error   && <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-3.5 rounded-xl"><AlertCircle size={14} className="mt-0.5 shrink-0" /><span>{error}</span></div>}

      {!loading && !error && !stats && (
        <div className="text-center py-16 text-slate-500">
          <TrendingUp size={32} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No stats yet</p>
          <p className="text-sm mt-1">Play matches to see your stats here</p>
        </div>
      )}

      {stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Matches', value: stats.matches ?? 0, icon: Target,  color: 'text-blue-400' },
              { label: 'Runs',    value: stats.runs ?? 0,    icon: TrendingUp, color: 'text-green-400' },
              { label: 'Wickets', value: stats.wickets ?? 0, icon: Shield,  color: 'text-orange-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-4 text-center">
                <Icon size={16} className={`${color} mx-auto mb-2`} />
                <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 space-y-4">
            <p className="text-sm font-semibold text-slate-300 uppercase tracking-widest text-xs">Batting</p>
            <StatBar label="Average"    value={stats.battingAverage ?? 0} max={100} color="bg-green-500" />
            <StatBar label="Strike Rate" value={stats.strikeRate ?? 0}   max={200} color="bg-blue-500" />
            <StatBar label="High Score"  value={stats.highScore ?? 0}    max={200} color="bg-yellow-500" />
          </div>

          {(stats.wickets > 0 || stats.economy != null) && (
            <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 space-y-4">
              <p className="text-sm font-semibold text-slate-300 uppercase tracking-widest text-xs">Bowling</p>
              <StatBar label="Economy"   value={stats.economy ?? 0}       max={12}  color="bg-orange-500" />
              <StatBar label="Best"      value={stats.bestBowling ?? 0}   max={10}  color="bg-red-500" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
