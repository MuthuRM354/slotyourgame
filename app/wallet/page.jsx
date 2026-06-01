'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, AlertCircle, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { walletApi } from '@/lib/api'

const TX_STYLE = {
  TOPUP:          { color: 'text-green-400',  bg: 'bg-green-500/10',  icon: TrendingUp,   sign: '+' },
  BOOKING_DEBIT:  { color: 'text-red-400',    bg: 'bg-red-500/10',    icon: TrendingDown, sign: '-' },
  BOOKING_REFUND: { color: 'text-green-400',  bg: 'bg-green-500/10',  icon: TrendingUp,   sign: '+' },
  PRIZE:          { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: TrendingUp,   sign: '+' },
  ADMIN_CREDIT:   { color: 'text-green-400',  bg: 'bg-green-500/10',  icon: TrendingUp,   sign: '+' },
  ADMIN_DEBIT:    { color: 'text-red-400',    bg: 'bg-red-500/10',    icon: TrendingDown, sign: '-' },
}

function fmt(paise) {
  return `₹${(Math.abs(paise) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

export default function WalletPage() {
  const [balance, setBalance] = useState(null)
  const [txns,    setTxns]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    Promise.all([walletApi.balance(), walletApi.transactions()])
      .then(([bRes, tRes]) => {
        setBalance(bRes.data)
        setTxns(tRes.data?.content ?? tRes.data ?? [])
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <div className="border-b border-white/5 px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={15} /> Dashboard
          </Link>
          <Link href="/grounds" className="text-sm text-green-400 hover:text-green-300 font-semibold">Find Grounds</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wallet</h1>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading wallet…</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-4 rounded-xl mb-6">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <div><p className="font-semibold">Could not load wallet</p><p className="text-xs mt-0.5 opacity-75">{error}</p></div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Balance card */}
            <div className="bg-gradient-to-br from-green-500/15 to-green-600/5 border border-green-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                  <Wallet size={18} className="text-green-400" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Available Balance</p>
              </div>
              <p className="text-3xl font-bold text-white">
                {balance != null ? fmt(balance.balancePaise ?? balance) : '₹0.00'}
              </p>
            </div>

            {/* Transactions */}
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-3">Transaction History</h2>

            {txns.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                <TrendingUp size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No transactions yet</p>
              </div>
            )}

            <div className="space-y-2">
              {txns.map(tx => {
                const style = TX_STYLE[tx.type] ?? { color: 'text-slate-400', bg: 'bg-white/5', icon: TrendingUp, sign: '' }
                const Icon = style.icon
                return (
                  <div key={tx.id} className="flex items-center gap-4 bg-white/3 border border-white/8 rounded-xl px-4 py-3.5">
                    <div className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={14} className={style.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.description ?? tx.type}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-IN') : ''}</p>
                    </div>
                    <p className={`text-sm font-bold ${style.color}`}>
                      {style.sign}{fmt(tx.amountPaise)}
                    </p>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
