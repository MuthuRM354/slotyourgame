import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CalendarDays, Wallet, MapPin, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { bookingsApi } from '@/api/bookings.api'
import { walletApi } from '@/api/wallet.api'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { ROUTES } from '@/utils/constants'

export default function Dashboard() {
  const { user } = useAuth()

  const { data: recentBookings } = useQuery({
    queryKey: ['bookings', 'recent'],
    queryFn: () => bookingsApi.myBookings({ size: 3 }),
    select: (res) => res.data.data?.content,
  })

  const { data: balance } = useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: () => walletApi.balance(),
    select: (res) => res.data.data?.balancePaise,
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Hey, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Ready for your next game?</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to={ROUTES.WALLET} className="glass rounded-2xl p-4 hover:border-blue-500/40 transition-all">
          <Wallet size={20} className="text-blue-400 mb-3" />
          <p className="text-xs text-gray-400 mb-1">Wallet Balance</p>
          <p className="text-xl font-bold">{balance != null ? formatCurrency(balance) : '—'}</p>
        </Link>
        <Link to={ROUTES.BOOKINGS} className="glass rounded-2xl p-4 hover:border-blue-500/40 transition-all">
          <CalendarDays size={20} className="text-green-400 mb-3" />
          <p className="text-xs text-gray-400 mb-1">Upcoming</p>
          <p className="text-xl font-bold">
            {recentBookings?.filter(b => b.status === 'CONFIRMED').length ?? '—'}
          </p>
        </Link>
      </div>

      {/* CTA */}
      <Link
        to={ROUTES.TURFS}
        className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl px-5 py-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <MapPin size={20} />
          <span className="font-semibold">Find a turf nearby</span>
        </div>
        <ChevronRight size={20} />
      </Link>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Bookings</h2>
          <Link to={ROUTES.BOOKINGS} className="text-blue-400 text-sm">See all</Link>
        </div>
        <div className="space-y-3">
          {recentBookings?.map((b) => (
            <div key={b.id} className="glass rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{b.turfName}</p>
                <p className="text-xs text-gray-400">{formatDate(b.bookingDate)}</p>
              </div>
              <span className="text-blue-400 text-sm font-semibold">{formatCurrency(b.amountPaise)}</span>
            </div>
          ))}
          {recentBookings?.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
