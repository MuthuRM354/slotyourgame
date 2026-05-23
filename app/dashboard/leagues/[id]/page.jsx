'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { leaguesApi } from '@/lib/api'
import Tabs from '@/components/ui/Tabs'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import {
  Trophy, Calendar, Users, Medal, TrendingUp,
  Shield, ChevronUp, ChevronDown, Minus,
} from 'lucide-react'

// ─── Standings table ──────────────────────────────────────────────────────────
function StandingsTable({ standings }) {
  if (!standings?.length) {
    return (
      <EmptyState
        icon={<TrendingUp size={28} className="text-gray-600" />}
        title="No standings yet"
        description="Standings will appear once matches have been played."
      />
    )
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-[#1c2432]">
            <th className="text-left px-3 py-3 w-8">#</th>
            <th className="text-left px-3 py-3">Team</th>
            <th className="px-3 py-3 text-center">P</th>
            <th className="px-3 py-3 text-center">W</th>
            <th className="px-3 py-3 text-center">L</th>
            <th className="px-3 py-3 text-center">NR</th>
            <th className="px-3 py-3 text-center font-semibold">Pts</th>
            <th className="px-3 py-3 text-center hidden sm:table-cell">NRR</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, idx) => {
            const isTop3 = idx < 3
            const medalColor = ['text-yellow-400', 'text-gray-300', 'text-amber-600'][idx] ?? ''

            return (
              <tr
                key={row.team_id ?? idx}
                className={`border-b border-[#1c2432] last:border-0 transition ${
                  isTop3 ? 'bg-green-500/5' : 'hover:bg-[#0a0f18]/40'
                }`}
              >
                <td className="px-3 py-3">
                  {isTop3
                    ? <Medal size={14} className={medalColor} />
                    : <span className="text-gray-600 text-xs">{idx + 1}</span>}
                </td>
                <td className="px-3 py-3 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <Shield size={13} className="text-gray-600 flex-shrink-0" />
                    {row.team_name ?? row.team_id}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-gray-400">{row.played ?? 0}</td>
                <td className="px-3 py-3 text-center text-green-400 font-medium">{row.won ?? 0}</td>
                <td className="px-3 py-3 text-center text-red-400">{row.lost ?? 0}</td>
                <td className="px-3 py-3 text-center text-gray-500">{row.no_result ?? 0}</td>
                <td className="px-3 py-3 text-center font-bold text-white">{row.points ?? 0}</td>
                <td className="px-3 py-3 text-center text-gray-500 text-xs hidden sm:table-cell">
                  {row.nrr != null
                    ? <span className={row.nrr >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {row.nrr >= 0 ? '+' : ''}{Number(row.nrr).toFixed(3)}
                      </span>
                    : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Match card ───────────────────────────────────────────────────────────────
function MatchCard({ match }) {
  const resultColor = {
    completed: 'border-[#1c2432]/60',
    upcoming:  'border-blue-700/30',
    live:      'border-green-500/60',
  }[match.status] ?? 'border-[#1c2432]'

  return (
    <div className={`bg-[#0c1117] border rounded-xl p-4 space-y-2 ${resultColor}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 flex items-center gap-1.5">
          <Calendar size={11} /> {match.fixture_date ?? match.match_date}
        </span>
        <Badge label={match.status ?? 'scheduled'} />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 text-right">
          <p className="text-sm font-semibold text-white truncate">{match.home_team_name ?? 'Team A'}</p>
          {match.home_score != null && (
            <p className="text-lg font-bold text-green-400">{match.home_score}/{match.home_wickets ?? 0}</p>
          )}
        </div>

        <div className="flex-shrink-0 text-center">
          <span className="text-xs font-bold text-gray-600 bg-[#0a0f18] border border-[#1c2432] px-2 py-1 rounded-full">
            VS
          </span>
        </div>

        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-white truncate">{match.away_team_name ?? match.opponent_name ?? 'Team B'}</p>
          {match.away_score != null && (
            <p className="text-lg font-bold text-gray-300">{match.away_score}/{match.away_wickets ?? 0}</p>
          )}
        </div>
      </div>

      {match.result && (
        <p className="text-xs text-center text-gray-400 bg-[#0a0f18] rounded-lg py-1.5">
          {match.result}
        </p>
      )}
      {match.venue && (
        <p className="text-xs text-center text-gray-600">{match.venue}</p>
      )}
    </div>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────
function OverviewTab({ league }) {
  const INFO = [
    { label: 'Format',     value: league.format },
    { label: 'Start Date', value: league.start_date },
    { label: 'End Date',   value: league.end_date },
    { label: 'Teams',      value: league.teams_count },
    { label: 'Organiser',  value: league.organiser_name },
    { label: 'Location',   value: league.location ?? league.city },
  ].filter((i) => i.value)

  return (
    <div className="space-y-5">
      {league.description && (
        <p className="text-sm text-gray-400 leading-relaxed">{league.description}</p>
      )}

      {INFO.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INFO.map(({ label, value }) => (
            <div key={label} className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-medium text-white mt-1">{String(value)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Prize / Rules */}
      {league.prize_info && (
        <div className="bg-yellow-500/5 border border-yellow-700/20 rounded-xl p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-1">Prize</p>
          <p className="text-sm text-gray-300">{league.prize_info}</p>
        </div>
      )}
      {league.rules && (
        <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rules</p>
          <p className="text-sm text-gray-400 whitespace-pre-line leading-relaxed">{league.rules}</p>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LeagueDetailPage() {
  const { id } = useParams()

  const [league,    setLeague]    = useState(null)
  const [standings, setStandings] = useState([])
  const [matches,   setMatches]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [tab,       setTab]       = useState('Overview')

  useEffect(() => {
    async function load() {
      try {
        const [l, s, m] = await Promise.allSettled([
          leaguesApi.get(id),
          leaguesApi.standings(id),
          leaguesApi.matches(id),
        ])
        if (l.status === 'fulfilled') setLeague(l.value?.data ?? l.value)
        if (s.status === 'fulfilled') setStandings(s.value?.data ?? s.value ?? [])
        if (m.status === 'fulfilled') setMatches(m.value?.data ?? m.value ?? [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const upcoming  = matches.filter((m) => ['upcoming','scheduled'].includes(m.status))
  const completed = matches.filter((m) => m.status === 'completed')

  const statusColor = {
    active:     'bg-green-500/10 border-green-500/30 text-green-400',
    upcoming:   'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    completed:  'bg-gray-700/40 border-gray-600/30 text-gray-400',
    in_progress:'bg-blue-500/10 border-blue-500/30 text-blue-400',
  }[league?.status] ?? 'bg-[#0a0f18] border-[#1c2432] text-gray-400'

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-48 bg-[#0c1117] rounded-lg animate-pulse" />
        <div className="h-40 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />
      </div>
    )
  }

  if (!league) {
    return (
      <EmptyState
        icon={<Trophy size={32} className="text-gray-600" />}
        title="League not found"
        description="This league doesn't exist or you don't have access."
      />
    )
  }

  return (
    <div className="space-y-5">
      {/* League header */}
      <div className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Trophy size={22} className="text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white">{league.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor}`}>
                {league.status?.replace('_', ' ')}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
              {league.format && <span>{league.format}</span>}
              {league.teams_count != null && (
                <span className="flex items-center gap-1"><Users size={11} /> {league.teams_count} teams</span>
              )}
              {league.start_date && (
                <span className="flex items-center gap-1"><Calendar size={11} /> {league.start_date}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={['Overview', `Standings (${standings.length})`, `Matches (${matches.length})`]}
        value={tab}
        onChange={setTab}
      >
        {(active) => (
          <>
            {active.startsWith('Overview') && <OverviewTab league={league} />}

            {active.startsWith('Standings') && (
              <StandingsTable standings={standings} />
            )}

            {active.startsWith('Matches') && (
              <div className="space-y-5">
                {upcoming.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Upcoming</p>
                    {upcoming.map((m, i) => <MatchCard key={m.id ?? i} match={m} />)}
                  </div>
                )}
                {completed.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Results</p>
                    {completed.map((m, i) => <MatchCard key={m.id ?? i} match={m} />)}
                  </div>
                )}
                {matches.length === 0 && (
                  <EmptyState
                    icon={<Calendar size={28} className="text-gray-600" />}
                    title="No matches yet"
                    description="Matches will be scheduled once the league begins."
                  />
                )}
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  )
}
