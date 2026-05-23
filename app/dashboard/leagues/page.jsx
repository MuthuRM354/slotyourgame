'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { leaguesApi } from '@/lib/api'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'
import { Trophy, ChevronRight, Users, Calendar } from 'lucide-react'

function LeagueCard({ league }) {
  const statusColor = {
    active:     'bg-green-500/10 border-green-500/30 text-green-400',
    upcoming:   'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    completed:  'bg-gray-700/40 border-gray-600/30 text-gray-400',
    in_progress:'bg-blue-500/10 border-blue-500/30 text-blue-400',
  }[league.status] ?? 'bg-[#0a0f18] border-[#1c2432] text-gray-400'

  return (
    <Link
      href={`/dashboard/leagues/${league.id}`}
      className="group bg-[#0c1117] border border-[#1c2432] hover:border-green-700/40 rounded-xl p-5 flex items-center gap-4 transition"
    >
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
        <Trophy size={20} className="text-green-400" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-white text-sm truncate">{league.name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor}`}>
            {league.status?.replace('_', ' ') ?? 'unknown'}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
          {league.format && <span>{league.format}</span>}
          {league.teams_count !== undefined && (
            <span className="flex items-center gap-1">
              <Users size={10} /> {league.teams_count} teams
            </span>
          )}
          {league.start_date && (
            <span className="flex items-center gap-1">
              <Calendar size={10} /> {league.start_date}
            </span>
          )}
        </div>
        {league.description && (
          <p className="text-xs text-gray-600 mt-1 truncate">{league.description}</p>
        )}
      </div>

      <ChevronRight size={16} className="text-gray-600 group-hover:text-green-400 flex-shrink-0 transition" />
    </Link>
  )
}

export default function LeaguesPage() {
  const [leagues,  setLeagues]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('all')

  useEffect(() => {
    async function load() {
      try {
        const data = await leaguesApi.list()
        setLeagues(data?.data ?? data ?? [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const STATUS_FILTERS = ['all', 'active', 'upcoming', 'in_progress', 'completed']

  const filtered = filter === 'all'
    ? leagues
    : leagues.filter((l) => l.status === filter)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Leagues</h2>
        <p className="text-sm text-gray-500 mt-0.5">Browse tournaments and competitive leagues</p>
      </div>

      {/* Filter strip */}
      <div className="flex gap-1.5 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition capitalize ${
              filter === f
                ? 'bg-green-500/10 border-green-500/40 text-green-400'
                : 'border-[#1c2432] text-gray-500 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            {f === 'all'
              ? `All (${leagues.length})`
              : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Trophy size={32} className="text-gray-600" />}
          title="No leagues found"
          description={
            filter === 'all'
              ? 'No leagues have been created yet.'
              : `No ${filter.replace('_', ' ')} leagues at the moment.`
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <LeagueCard key={l.id} league={l} />
          ))}
        </div>
      )}
    </div>
  )
}
