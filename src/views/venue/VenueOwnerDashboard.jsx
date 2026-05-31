/**
 * Placeholder — VENUE_OWNER sees their turfs + incoming bookings.
 * Full CRUD via turfsApi.create / turfsApi.update.
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { turfsApi } from '@/api/turfs.api'

export default function VenueOwnerDashboard() {
  const { data: turfs } = useQuery({
    queryKey: ['my-turfs'],
    queryFn: () => turfsApi.list({ mine: true }),
    select: (res) => res.data.data?.content,
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Turfs</h1>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Add Turf
        </button>
      </div>

      {!turfs?.length && (
        <div className="text-center py-16 text-gray-400">
          <p>You haven't listed any turfs yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {turfs?.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-gray-400 text-sm">{t.city}</p>
            </div>
            <Link to={`/turfs/${t.slug}`} className="text-blue-400 text-sm hover:underline">
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
