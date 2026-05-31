import { useQuery } from '@tanstack/react-query'
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { walletApi } from '@/api/wallet.api'
import { formatCurrency, timeAgo } from '@/utils/formatters'

const TX_ICONS = {
  TOPUP: <ArrowDownLeft size={16} className="text-green-400" />,
  BOOKING_DEBIT: <ArrowUpRight size={16} className="text-red-400" />,
  BOOKING_REFUND: <ArrowDownLeft size={16} className="text-green-400" />,
  PRIZE: <ArrowDownLeft size={16} className="text-yellow-400" />,
  ADMIN_CREDIT: <ArrowDownLeft size={16} className="text-blue-400" />,
  ADMIN_DEBIT: <ArrowUpRight size={16} className="text-orange-400" />,
}

export default function WalletPage() {
  const { data: balance } = useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: () => walletApi.balance(),
    select: (res) => res.data.data?.balancePaise,
  })

  const { data: txPage } = useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: () => walletApi.transactions({ size: 20 }),
    select: (res) => res.data.data?.content,
  })

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Balance card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
          <Wallet size={16} />
          <span>Wallet Balance</span>
        </div>
        <p className="text-3xl font-bold text-white">
          {balance != null ? formatCurrency(balance) : '—'}
        </p>
        <p className="text-blue-200 text-xs mt-1">Available for bookings</p>
      </div>

      {/* Add money placeholder */}
      <div className="glass rounded-xl p-4 mb-6 flex items-center justify-between">
        <span className="text-sm text-gray-300">Add Money via Razorpay</span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          Top Up
        </button>
      </div>

      {/* Transactions */}
      <h2 className="font-semibold mb-4 text-gray-300 text-sm uppercase tracking-wider">
        Transaction History
      </h2>

      <div className="space-y-3">
        {txPage?.map((tx) => {
          const isCredit = tx.amountPaise > 0
          return (
            <div key={tx.id} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                {TX_ICONS[tx.type] || <Wallet size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tx.description || tx.type}</p>
                <p className="text-xs text-gray-500">{timeAgo(tx.createdAt)}</p>
              </div>
              <span className={`font-semibold text-sm ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                {isCredit ? '+' : ''}{formatCurrency(Math.abs(tx.amountPaise))}
              </span>
            </div>
          )
        })}
        {txPage?.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">No transactions yet.</p>
        )}
      </div>
    </div>
  )
}
