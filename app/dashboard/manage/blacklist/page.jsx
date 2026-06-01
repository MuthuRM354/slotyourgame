'use client'

import { useState, useEffect } from 'react'
import { blacklistApi, groundsApi } from '@/lib/api'
import EmptyState from '@/components/ui/EmptyState'
import { ShieldAlert, Trash2, Plus } from 'lucide-react'

function BlacklistRow({ entry, onRemove }) {
  const [removing, setRemoving] = useState(false)

  async function handleRemove() {
    if (!confirm('Remove this team from the blacklist?')) return
    setRemoving(true)
    try {
      await onRemove(entry.team_id)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="flex items-start justify-between bg-[#0c1117] border border-[#1c2432] rounded-xl px-4 py-3">
      <div>
        <p className="text-sm font-medium text-white">{entry.team_id}</p>
        {entry.reason && (
          <p className="text-xs text-gray-500 mt-0.5">Reason: {entry.reason}</p>
        )}
        <p className="text-xs text-gray-600 mt-0.5">
          Blocked by {entry.blacklisted_by} · {new Date(entry.created_at).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={handleRemove}
        disabled={removing}
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-400 transition disabled:opacity-50"
        title="Remove from blacklist"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default function BlacklistPage() {
  const [entries, setEntries]     = useState([])
  const [groundId, setGroundId]   = useState(null)
  const [loading, setLoading]     = useState(true)
  const [teamId, setTeamId]       = useState('')
  const [reason, setReason]       = useState('')
  const [adding, setAdding]       = useState(false)
  const [showForm, setShowForm]   = useState(false)
  const [err, setErr]             = useState('')

  useEffect(() => {
    async function load() {
      try {
        const gRes = await groundsApi.list()
        const ground = (gRes.data ?? [])[0]
        if (!ground) { setLoading(false); return }
        setGroundId(ground.id)
        const data = await blacklistApi.list(ground.id)
        setEntries(data?.data ?? data ?? [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleAdd() {
    if (!teamId.trim()) return
    setAdding(true)
    setErr('')
    try {
      const entry = await blacklistApi.add(groundId, teamId.trim(), reason)
      setEntries((prev) => [entry?.data ?? entry, ...prev])
      setTeamId('')
      setReason('')
      setShowForm(false)
    } catch (e) {
      setErr(e.message)
    } finally {
      setAdding(false)
    }
  }

  async function handleRemove(teamId) {
    await blacklistApi.remove(groundId, teamId)
    setEntries((prev) => prev.filter((e) => e.team_id !== teamId))
  }

  return (
    <div className="space-y-5 max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Blacklist</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Blacklisted teams cannot book your ground.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-700/30 px-3 py-2 rounded-lg transition"
        >
          <Plus size={14} /> Block a team
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-[#0c1117] border border-red-700/30 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-red-400 flex items-center gap-1.5">
            <ShieldAlert size={15} /> Block a team
          </p>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Team UUID</label>
            <input
              type="text"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="Paste the team UUID…"
              className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Reason (shown to the team)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Damaged pitch last visit"
              className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {err && <p className="text-xs text-red-400">{err}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={adding || !teamId.trim()}
              className="text-xs bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              {adding ? 'Blocking…' : 'Block team'}
            </button>
            <button
              onClick={() => { setShowForm(false); setErr('') }}
              className="text-xs text-gray-500 hover:text-gray-300 px-3 py-2 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[1,2].map((i) => <div key={i} className="h-16 bg-[#0c1117] rounded-xl border border-[#1c2432] animate-pulse" />)}
        </div>
      ) : !groundId ? (
        <EmptyState icon="🏟️" title="No ground assigned" />
      ) : entries.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No teams blocked"
          description="All teams can book your ground. Block a team if they misbehave."
        />
      ) : (
        <div className="space-y-2">
          {entries.map((e) => (
            <BlacklistRow key={e.id} entry={e} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  )
}
