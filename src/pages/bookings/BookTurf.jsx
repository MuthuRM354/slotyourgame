import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { turfsApi } from '@/api/turfs.api'
import { formatCurrency, formatDate } from '@/utils/formatters'
import RazorpayButton from '@/components/payments/RazorpayButton'
import { ROUTES } from '@/utils/constants'

export default function BookTurf() {
  const { turfId } = useParams()
  const navigate = useNavigate()

  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [hours, setHours] = useState(1)

  const { data: turf } = useQuery({
    queryKey: ['turf-by-id', turfId],
    queryFn: () => turfsApi.list({ id: turfId }),
    select: (res) => res.data.data?.content?.[0],
  })

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['availability', turfId, date],
    queryFn: () => turfsApi.availability(turfId, date),
    enabled: !!date,
    select: (res) => res.data.data,
  })

  // Compute endTime and amount
  const endTime = startTime
    ? (() => {
        const [h, m] = startTime.split(':').map(Number)
        const end = new Date(0, 0, 0, h + hours, m)
        return `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`
      })()
    : ''

  const amountPaise = turf ? turf.pricePerHour * hours * 100 : 0

  const orderData = {
    turfId: Number(turfId),
    date,
    startTime,
    endTime,
    amountPaise,
  }

  const canBook = date && startTime && amountPaise > 0

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Book a Slot</h1>
      {turf && (
        <p className="text-gray-400 mb-6">{turf.name} • {formatCurrency(turf.pricePerHour * 100)}/hr</p>
      )}

      <div className="glass rounded-2xl p-6 space-y-5">
        {/* Date */}
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Time slot */}
        {date && (
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Start Time</label>
            {slotsLoading ? (
              <div className="h-12 bg-gray-800 rounded-lg animate-pulse" />
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots?.map((slot) => (
                  <button
                    key={slot.startTime}
                    onClick={() => setStartTime(slot.startTime)}
                    disabled={!slot.available}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                      startTime === slot.startTime
                        ? 'bg-blue-600 text-white'
                        : slot.available
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed line-through'
                    }`}
                  >
                    {slot.startTime.slice(0, 5)}
                  </button>
                ))}
                {!slots?.length && (
                  <p className="text-gray-500 text-sm col-span-3">No slots configured for this date.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Duration */}
        {startTime && (
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Duration (hours)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((h) => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hours === h ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {canBook && (
          <div className="bg-gray-800/60 rounded-xl p-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Date</span>
              <span>{formatDate(date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Time</span>
              <span>{startTime.slice(0, 5)} → {endTime}</span>
            </div>
            <div className="flex justify-between font-semibold text-blue-400 mt-2 pt-2 border-t border-gray-700">
              <span>Total</span>
              <span>{formatCurrency(amountPaise)}</span>
            </div>
          </div>
        )}

        {/* Pay button */}
        {canBook && (
          <RazorpayButton
            orderData={orderData}
            onSuccess={() => navigate(ROUTES.BOOKINGS)}
          />
        )}
      </div>
    </div>
  )
}
