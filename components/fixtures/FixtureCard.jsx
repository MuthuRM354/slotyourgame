'use client'

import { useState } from 'react'
import { MapPin, Clock, Tag } from 'lucide-react'
import clsx from 'clsx'
import { hasPermission } from '@/lib/rbac'

const STATUS_STYLES = {
  confirmed: 'bg-green-900/40 text-green-300 border-green-700',
  cancelled: 'bg-red-900/40 text-red-300 border-red-700',
  pending: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
}

const TYPE_LABELS = { match: 'Match', nets: 'Nets', tournament: 'Tournament' }

export default function FixtureCard({ fixture, role }) {
  const [status, setStatus] = useState(fixture.status)
  const [loading, setLoading] = useState(false)
  const canEdit = hasPermission(role, 'captain')

  async function updateStatus(newStatus) {
    setLoading(true)
    const res = await fetch(`/api/fixtures/${fixture.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) setStatus(newStatus)
    setLoading(false)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-3 hover:border-gray-700 transition">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-white text-lg">vs {fixture.opponent_name}</p>
          <p className="text-green-400 text-sm font-medium">{fixture.fixture_date}</p>
        </div>
        <span className={clsx('text-xs px-2 py-1 rounded-full border font-medium shrink-0', STATUS_STYLES[status])}>
          {status}
        </span>
      </div>

      <div className="space-y-1.5 text-sm text-gray-400">
        {fixture.ground_name && (
          <div className="flex items-center gap-2">
            <MapPin size={13} className="shrink-0" />
            <span>{fixture.ground_name}</span>
          </div>
        )}
        {fixture.start_time && (
          <div className="flex items-center gap-2">
            <Clock size={13} className="shrink-0" />
            <span>{fixture.start_time}{fixture.end_time ? ` – ${fixture.end_time}` : ''}</span>
          </div>
        )}
        {fixture.fixture_type && (
          <div className="flex items-center gap-2">
            <Tag size={13} className="shrink-0" />
            <span>{TYPE_LABELS[fixture.fixture_type] ?? fixture.fixture_type}</span>
          </div>
        )}
      </div>

      {fixture.notes && (
        <p className="text-xs text-gray-500 border-t border-gray-800 pt-3">{fixture.notes}</p>
      )}

      {canEdit && (
        <div className="flex gap-2 pt-1 border-t border-gray-800">
          {status !== 'confirmed' && (
            <button
              onClick={() => updateStatus('confirmed')}
              disabled={loading}
              className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              Confirm
            </button>
          )}
          {status !== 'cancelled' && (
            <button
              onClick={() => updateStatus('cancelled')}
              disabled={loading}
              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  )
}
