'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, MapPin } from 'lucide-react'
import clsx from 'clsx'

const STATUS_ICONS = {
  available: <CheckCircle size={15} className="text-green-400" />,
  unavailable: <XCircle size={15} className="text-red-400" />,
  pending: <Clock size={15} className="text-yellow-400" />,
}

const STATUS_STYLES = {
  available: 'bg-green-500/10 text-green-300 border-green-700/40',
  unavailable: 'bg-red-500/10 text-red-300 border-red-700/40',
  pending: 'bg-yellow-500/10 text-yellow-300 border-yellow-700/40',
}

export default function AvailabilityTracker({ fixture, availability, currentUserId, currentUserRole }) {
  const [rows, setRows] = useState(availability)
  const [loading, setLoading] = useState(null)

  const myRow = rows.find((a) => a.player_id === currentUserId)

  const counts = rows.reduce(
    (acc, a) => ({ ...acc, [a.status]: (acc[a.status] ?? 0) + 1 }),
    { available: 0, unavailable: 0, pending: 0 }
  )

  async function respond(status) {
    if (!myRow) return
    setLoading(status)
    const res = await fetch(`/api/availability/${myRow.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setRows((prev) => prev.map((r) => (r.id === updated.id ? { ...r, status: updated.status } : r)))
    }
    setLoading(null)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-semibold text-white">vs {fixture.opponent_name}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span>{fixture.fixture_date}</span>
            {fixture.ground_name && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {fixture.ground_name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-green-400 font-semibold">{counts.available} in</span>
          <span className="text-red-400 font-semibold">{counts.unavailable} out</span>
          <span className="text-yellow-400 font-semibold">{counts.pending} pending</span>
        </div>
      </div>

      {/* My response (players only) */}
      {myRow && (
        <div className="px-5 py-3 bg-gray-800/40 border-b border-gray-800 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            Your status:{' '}
            <span className={clsx('font-medium capitalize', {
              'text-green-400': myRow.status === 'available',
              'text-red-400': myRow.status === 'unavailable',
              'text-yellow-400': myRow.status === 'pending',
            })}>
              {myRow.status}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => respond('available')}
              disabled={loading !== null || myRow.status === 'available'}
              className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-700/30 px-3 py-1.5 rounded-lg transition disabled:opacity-40"
            >
              {loading === 'available' ? '…' : "I'm In"}
            </button>
            <button
              onClick={() => respond('unavailable')}
              disabled={loading !== null || myRow.status === 'unavailable'}
              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-700/30 px-3 py-1.5 rounded-lg transition disabled:opacity-40"
            >
              {loading === 'unavailable' ? '…' : "Can't Make It"}
            </button>
          </div>
        </div>
      )}

      {/* Squad list (captain/admin) */}
      {(currentUserRole === 'captain' || currentUserRole === 'league_admin') && (
        <div className="divide-y divide-gray-800">
          {rows.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 font-medium">
                  {a.profiles?.full_name?.charAt(0) ?? '?'}
                </div>
                <span className="text-sm text-white">{a.profiles?.full_name ?? 'Unknown'}</span>
              </div>
              <div className={clsx('flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border', STATUS_STYLES[a.status])}>
                {STATUS_ICONS[a.status]}
                <span className="capitalize">{a.status}</span>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-center text-gray-600 text-sm py-6">No availability data yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
