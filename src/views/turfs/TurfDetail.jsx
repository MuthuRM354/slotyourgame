import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Star, Clock, ChevronRight } from 'lucide-react'
import { turfsApi } from '@/api/turfs.api'
import { formatCurrency } from '@/utils/formatters'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'

export default function TurfDetail() {
  const { slug } = useParams()
  const { isAuthenticated } = useAuth()

  const { data: turf, isLoading, isError } = useQuery({
    queryKey: ['turf', slug],
    queryFn: () => turfsApi.get(slug),
    select: (res) => res.data.data,
  })

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="h-64 bg-gray-800 rounded-2xl animate-pulse" />
        <div className="h-8 bg-gray-800 rounded-lg animate-pulse w-1/2" />
        <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
      </div>
    )
  }

  if (isError || !turf) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400">Turf not found.</p>
        <Link to={ROUTES.TURFS} className="text-blue-400 mt-4 inline-block">← Back to turfs</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero image */}
      <div className="h-64 sm:h-80 bg-gray-700 rounded-2xl overflow-hidden mb-6">
        {turf.thumbnailUrl ? (
          <img src={turf.thumbnailUrl} alt={turf.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🏏</div>
        )}
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{turf.name}</h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {turf.address}, {turf.city}
          </span>
          {turf.averageRating && (
            <span className="flex items-center gap-1 text-yellow-400">
              <Star size={14} fill="currentColor" />
              {turf.averageRating.toFixed(1)} ({turf.totalReviews} reviews)
            </span>
          )}
        </div>
      </div>

      {/* Pricing + CTA */}
      <div className="glass rounded-2xl p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Starting from</p>
          <p className="text-2xl font-bold text-blue-400">
            {formatCurrency(turf.pricePerHour * 100)}<span className="text-sm text-gray-400">/hr</span>
          </p>
        </div>
        {isAuthenticated ? (
          <Link
            to={`/book/${turf.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-1"
          >
            Book Now <ChevronRight size={16} />
          </Link>
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Sign in to Book
          </Link>
        )}
      </div>

      {/* Description */}
      {turf.description && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">About this turf</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{turf.description}</p>
        </div>
      )}

      {/* Amenities */}
      {turf.amenities?.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {turf.amenities.map((a) => (
              <span key={a} className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
