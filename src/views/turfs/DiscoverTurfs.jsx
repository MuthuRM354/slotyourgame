import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Star, Clock, Search } from 'lucide-react'
import { turfsApi } from '@/api/turfs.api'
import { useGeolocation } from '@/hooks/useGeolocation'
import { formatCurrency, formatDistance } from '@/utils/formatters'

export default function DiscoverTurfs() {
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const { position } = useGeolocation()

  // Nearby turfs when GPS is available
  const nearbyQuery = useQuery({
    queryKey: ['turfs', 'nearby', position],
    queryFn: () => turfsApi.nearby(position.lat, position.lng),
    enabled: !!position,
    select: (res) => res.data.data,
  })

  // All/filtered turfs
  const allQuery = useQuery({
    queryKey: ['turfs', 'list', city, search],
    queryFn: () => turfsApi.list({ city: city || undefined, search: search || undefined, size: 20 }),
    select: (res) => res.data.data,
  })

  const turfs = position ? nearbyQuery.data?.content : allQuery.data?.content
  const isLoading = position ? nearbyQuery.isLoading : allQuery.isLoading

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {position ? 'Turfs near you' : 'Find a Turf'}
      </h1>

      {/* Search bar */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search by city…"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      )}

      {/* Turf cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(turfs || []).map((turf) => (
            <TurfCard key={turf.id} turf={turf} />
          ))}
          {turfs?.length === 0 && (
            <p className="text-gray-400 col-span-full text-center py-12">
              No turfs found. Try a different city.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function TurfCard({ turf }) {
  return (
    <Link
      to={`/turfs/${turf.slug}`}
      className="glass rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all group"
    >
      {/* Thumbnail */}
      <div className="h-44 bg-gray-700 relative overflow-hidden">
        {turf.thumbnailUrl ? (
          <img
            src={turf.thumbnailUrl}
            alt={turf.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">🏏</div>
        )}
        {turf.distanceKm != null && (
          <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <MapPin size={11} />
            {formatDistance(turf.distanceKm)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 truncate">{turf.name}</h3>
        <p className="text-gray-400 text-sm flex items-center gap-1 mb-3 truncate">
          <MapPin size={12} /> {turf.city}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-blue-400 font-semibold text-sm">
            {formatCurrency(turf.pricePerHour * 100)}/hr
          </span>
          {turf.averageRating && (
            <span className="flex items-center gap-1 text-yellow-400 text-sm">
              <Star size={13} fill="currentColor" />
              {turf.averageRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
