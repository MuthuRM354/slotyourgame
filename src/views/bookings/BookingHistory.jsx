import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, MapPin, Clock, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { bookingsApi } from '@/api/bookings.api'
import { formatDate, formatTime, formatCurrency } from '@/utils/formatters'

const STATUS_COLORS = {
  CONFIRMED: 'text-green-400 bg-green-400/10',
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  COMPLETED: 'text-gray-400 bg-gray-400/10',
  NO_SHOW: 'text-orange-400 bg-orange-400/10',
}

export default function BookingHistory() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingsApi.myBookings({ size: 20 }),
    select: (res) => res.data.data?.content,
  })

  const cancelMutation = useMutation({
    mutationFn: (id) => bookingsApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking cancelled')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Cancellation failed')
    },
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && data?.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
          <p>No bookings yet. Go find a turf!</p>
        </div>
      )}

      <div className="space-y-4">
        {data?.map((booking) => (
          <div key={booking.id} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{booking.turfName}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-0.5">
                  <MapPin size={12} /> {booking.turfCity}
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[booking.status]}`}>
                {booking.status}
              </span>
            </div>

            <div className="flex gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <CalendarDays size={13} className="text-gray-500" />
                {formatDate(booking.bookingDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-gray-500" />
                {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <span className="text-blue-400 font-semibold">{formatCurrency(booking.amountPaise)}</span>
              {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                <button
                  onClick={() => {
                    if (window.confirm('Cancel this booking?')) {
                      cancelMutation.mutate(booking.id)
                    }
                  }}
                  disabled={cancelMutation.isPending}
                  className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  <XCircle size={14} /> Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
