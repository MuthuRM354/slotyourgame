'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Tabs from '@/components/ui/Tabs'
import EmptyState from '@/components/ui/EmptyState'
import { TrendingUp, Zap, Shield, Target } from 'lucide-react'

// ─── Reusable bar chart ───────────────────────────────────────────────────────
function BarChart({ data, valueKey, labelKey, color = 'bg-green-500', maxOverride }) {
  const max = maxOverride ?? Math.max(...data.map((d) => d[valueKey] ?? 0), 1)
  return (
    <div className="space-y-2">
      {data.map((row, i) => {
        const val = row[valueKey] ?? 0
        const pct = Math.round((val / max) * 100)
        return (
          <div key={i} className="flex items-center gap-3">
            <p className="text-xs text-gray-500 w-24 flex-shrink-0 truncate text-right">
              {row[labelKey] ?? `Match ${i + 1}`}
            </p>
            <div className="flex-1 h-5 bg-[#0a0f18] rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                style={{ width: `${Math.max(pct, val > 0 ? 4 : 0)}%` }}
              >
                {pct > 15 && (
                  <span className="text-xs font-bold text-black/70">{val}</span>
                )}
              </div>
            </div>
            {pct <= 15 && (
              <span className="text-xs text-gray-400 w-6 flex-shrink-0">{val}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Stat tile ────────────────────────────────────────────────────────────────
function StatTile({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-4 space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <Icon size={15} className={color} />
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-600">{sub}</p>}
    </div>
  )
}

// ─── Batting performance overview ─────────────────────────────────────────────
function BattingTab({ stats }) {
  if (!stats.length) {
    return (
      <EmptyState
        icon={<Target size={28} className="text-gray-600" />}
        title="No batting stats yet"
        description="Your batting records will appear here after matches."
      />
    )
  }

  const innings    = stats.filter((s) => s.runs_scored != null)
  const chartData  = innings.slice(-10).map((s) => ({
    label: s.fixtures?.opponent_name ?? 'vs ?',
    runs:  s.runs_scored ?? 0,
    balls: s.balls_faced ?? 0,
  }))
  const best    = Math.max(...innings.map((s) => s.runs_scored ?? 0))
  const totalR  = innings.reduce((a, s) => a + (s.runs_scored ?? 0), 0)
  const avg     = innings.length ? (totalR / innings.length).toFixed(1) : '—'
  const sr      = innings.reduce((a, s) => a + (s.balls_faced ?? 0), 0)
  const strikeR = sr > 0 ? ((totalR / sr) * 100).toFixed(1) : '—'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile label="Total Runs"   value={totalR}   icon={Target}    color="text-green-400" />
        <StatTile label="Innings"      value={innings.length} icon={TrendingUp} color="text-blue-400" />
        <StatTile label="Average"      value={avg}      icon={Zap}       color="text-yellow-400" sub="runs per innings" />
        <StatTile label="Strike Rate"  value={strikeR}  icon={Shield}    color="text-purple-400" sub="per 100 balls" />
      </div>

      <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Runs Per Match</p>
          <span className="text-xs text-gray-500">last {chartData.length} matches</span>
        </div>
        <BarChart data={chartData} valueKey="runs" labelKey="label" color="bg-green-500" />
      </div>

      <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Balls Faced</p>
          <span className="text-xs text-gray-500">last {chartData.length} matches</span>
        </div>
        <BarChart data={chartData} valueKey="balls" labelKey="label" color="bg-blue-500" />
      </div>
    </div>
  )
}

// ─── Bowling performance overview ─────────────────────────────────────────────
function BowlingTab({ stats }) {
  const bowlingInnings = stats.filter((s) => s.wickets_taken != null || s.overs_bowled != null)

  if (!bowlingInnings.length) {
    return (
      <EmptyState
        icon={<Zap size={28} className="text-gray-600" />}
        title="No bowling stats yet"
        description="Your bowling records will appear here after matches."
      />
    )
  }

  const totalWkts = bowlingInnings.reduce((a, s) => a + (s.wickets_taken ?? 0), 0)
  const totalOvers = bowlingInnings.reduce((a, s) => a + parseFloat(s.overs_bowled ?? 0), 0)
  const bestBowl   = Math.max(...bowlingInnings.map((s) => s.wickets_taken ?? 0))
  const economy    = totalOvers > 0
    ? (bowlingInnings.reduce((a, s) => a + (s.runs_conceded ?? 0), 0) / totalOvers).toFixed(2)
    : '—'

  const chartData = bowlingInnings.slice(-10).map((s) => ({
    label:   s.fixtures?.opponent_name ?? 'vs ?',
    wickets: s.wickets_taken ?? 0,
    overs:   parseFloat(s.overs_bowled ?? 0),
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile label="Wickets"    value={totalWkts}     icon={Zap}       color="text-yellow-400" />
        <StatTile label="Overs"      value={totalOvers.toFixed(1)} icon={TrendingUp} color="text-blue-400" />
        <StatTile label="Best"       value={`${bestBowl}W`} icon={Target}   color="text-green-400" sub="in a match" />
        <StatTile label="Economy"    value={economy}       icon={Shield}    color="text-purple-400" sub="runs per over" />
      </div>

      <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Wickets Per Match</p>
          <span className="text-xs text-gray-500">last {chartData.length} matches</span>
        </div>
        <BarChart data={chartData} valueKey="wickets" labelKey="label" color="bg-yellow-500" />
      </div>
    </div>
  )
}

// ─── History table ─────────────────────────────────────────────────────────────
function HistoryTab({ stats }) {
  if (!stats.length) {
    return (
      <EmptyState
        icon={<TrendingUp size={28} className="text-gray-600" />}
        title="No match history"
        description="Your performance logs will appear here."
      />
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm min-w-[540px]">
        <thead>
          <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-[#1c2432]">
            <th className="text-left px-4 py-3">Match</th>
            <th className="text-left px-4 py-3 hidden sm:table-cell">Date</th>
            <th className="px-4 py-3 text-center">Runs</th>
            <th className="px-4 py-3 text-center hidden sm:table-cell">Balls</th>
            <th className="px-4 py-3 text-center">Wkts</th>
            <th className="px-4 py-3 text-center hidden sm:table-cell">Overs</th>
            <th className="px-4 py-3 text-center hidden md:table-cell">Catches</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => (
            <tr key={s.id} className="border-b border-[#1c2432] last:border-0 hover:bg-[#0a0f18]/50">
              <td className="px-4 py-3 text-white font-medium">
                vs {s.fixtures?.opponent_name ?? '?'}
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                {s.fixtures?.fixture_date ?? '—'}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`font-semibold ${(s.runs_scored ?? 0) >= 30 ? 'text-green-400' : 'text-gray-300'}`}>
                  {s.runs_scored ?? '—'}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-gray-400 hidden sm:table-cell">{s.balls_faced ?? '—'}</td>
              <td className="px-4 py-3 text-center">
                <span className={`font-semibold ${(s.wickets_taken ?? 0) >= 2 ? 'text-yellow-400' : 'text-gray-300'}`}>
                  {s.wickets_taken ?? '—'}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-gray-400 hidden sm:table-cell">{s.overs_bowled ?? '—'}</td>
              <td className="px-4 py-3 text-center text-gray-400 hidden md:table-cell">{s.catches ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StatsPage() {
  const [stats,   setStats]   = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)

      const { data: s } = await supabase
        .from('player_stats')
        .select('*, fixtures(opponent_name, fixture_date)')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false })

      setStats(s ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const totals = stats.reduce(
    (acc, s) => ({
      runs:    acc.runs    + (s.runs_scored    ?? 0),
      wickets: acc.wickets + (s.wickets_taken  ?? 0),
      catches: acc.catches + (s.catches        ?? 0),
      innings: acc.innings + 1,
    }),
    { runs: 0, wickets: 0, catches: 0, innings: 0 }
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">
          {profile?.full_name ? `${profile.full_name}'s Stats` : 'My Stats'}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">Career performance across all matches</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-24 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />
            ))}
          </div>
          <div className="h-48 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />
        </div>
      ) : stats.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={32} className="text-gray-600" />}
          title="No stats recorded yet"
          description="Your performance will be tracked after your first match."
        />
      ) : (
        <>
          {/* Career summary tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatTile label="Total Runs"  value={totals.runs}    icon={Target}    color="text-green-400" sub={`${totals.innings} innings`} />
            <StatTile label="Wickets"     value={totals.wickets} icon={Zap}       color="text-yellow-400" />
            <StatTile label="Catches"     value={totals.catches} icon={Shield}    color="text-blue-400" />
            <StatTile label="Matches"     value={totals.innings} icon={TrendingUp} color="text-purple-400" />
          </div>

          {/* Tabbed breakdown */}
          <Tabs tabs={['Batting', 'Bowling', 'History']}>
            {(tab) => (
              <>
                {tab === 'Batting'  && <BattingTab  stats={stats} />}
                {tab === 'Bowling'  && <BowlingTab  stats={stats} />}
                {tab === 'History'  && <HistoryTab  stats={stats} />}
              </>
            )}
          </Tabs>
        </>
      )}
    </div>
  )
}
