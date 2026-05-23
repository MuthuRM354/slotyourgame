'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, User } from 'lucide-react'
import { hasPermission } from '@/lib/rbac'

const ROLE_LABELS = { league_admin: 'Admin', captain: 'Captain', player: 'Player' }

export default function PlayerRow({ player, currentUserRole, currentUserId }) {
  const [cricheroes, setCricheroes] = useState(player.cricheroes_id ?? '')
  const [saving, setSaving] = useState(false)
  const isSelf = player.id === currentUserId

  async function handleVerify(e) {
    e.preventDefault()
    if (!cricheroes.trim()) return
    setSaving(true)
    await fetch('/api/players/verify-cricheroes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cricheroes_id: cricheroes }),
    })
    setSaving(false)
  }

  return (
    <tr className="border-b border-[#1c2432] last:border-0 hover:bg-[#1a2030]/40 transition">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1c2432] flex items-center justify-center shrink-0">
            <User size={14} className="text-slate-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">{player.full_name}</p>
            <p className="text-gray-500 text-xs">{player.email}</p>
          </div>
        </div>
      </td>
      <td className="p-4 hidden sm:table-cell">
        <span className="text-xs text-gray-400 capitalize">
          {ROLE_LABELS[player.role] ?? player.role}
        </span>
      </td>
      <td className="p-4 hidden md:table-cell">
        <span className="text-xs text-gray-400">{player.teams?.name ?? '—'}</span>
      </td>
      <td className="p-4 hidden sm:table-cell">
        {player.cricheroes_verified ? (
          <div className="flex items-center gap-1 text-green-400 text-xs">
            <CheckCircle size={13} />
            <span>Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <XCircle size={13} />
            <span>Unverified</span>
          </div>
        )}
      </td>
      {currentUserRole !== 'player' && (
        <td className="p-4 text-right">
          {isSelf && !player.cricheroes_verified && (
            <form onSubmit={handleVerify} className="flex items-center gap-2 justify-end">
              <input
                type="text"
                value={cricheroes}
                onChange={(e) => setCricheroes(e.target.value)}
                placeholder="CricHeroes ID"
                className="bg-[#0a0f18] border border-[#1c2432] rounded-lg px-2 py-1 text-xs text-white w-28 focus:outline-none focus:ring-1 focus:ring-green-500/50"
              />
              <button
                type="submit"
                disabled={saving}
                className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 px-2 py-1 rounded transition disabled:opacity-50"
              >
                {saving ? '…' : 'Verify'}
              </button>
            </form>
          )}
        </td>
      )}
    </tr>
  )
}
