'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Star, Clock, Search, Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import { groundsApi } from '@/lib/api'

export default function GroundsPage() {
  const [grounds, setGrounds] = useState([])
  const [city,    setCity]    = useState('')
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  async function fetchGrounds(c) {
    setLoading(true)
    setError('')
    try {
      const res = await groundsApi.list(c)
      setGrounds(res.data ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGrounds() }, [])

  function handleSearch(e) {
    e.preventDefault()
    fetchGrounds(search)
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-4 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-green-400 font-bold text-lg tracking-tight">SlotYourGame</Link>
          <div className="flex gap-3">
            <Link href="/bookings" className="text-sm text-slate-400 hover:text-white transition-colors">My Bookings</Link>
            <Link href="/dashboard" className="text-sm text-green-400 hover:text-green-300 font-semibold transition-colors">Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">Find a Ground</h1>
        <p className="text-slate-400 text-sm mb-6">Browse and book cricket grounds near you</p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by city (e.g. Chennai, Mumbai…)"
              className="input-field pl-10 w-full" />
          </div>
          <button type="submit" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">Search</button>
        </form>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading grounds…</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-4 rounded-xl mb-4">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Could not load grounds</p>
              <p className="text-xs mt-0.5 opacity-75">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && grounds.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <MapPin size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No grounds found</p>
            <p className="text-sm mt-1">Try a different city</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {grounds.map(g => (
            <Link key={g.id} href={`/grounds/${g.id}`}
              className="group block bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-green-500/30 hover:bg-white/5 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-bold text-base group-hover:text-green-300 transition-colors">{g.name}</h2>
                  <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin size={11} />
                    {g.location ?? g.city}
                  </p>
                </div>
                {g.rating && (
                  <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold bg-yellow-400/10 px-2 py-1 rounded-lg">
                    <Star size={11} fill="currentColor" />
                    {g.rating}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={11} />
                  <span>₹{g.pricePerHour ?? g.price ?? '—'}/hr</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-green-400 font-semibold">
                  View slots <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
