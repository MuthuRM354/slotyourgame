'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Search, Star, Clock, Loader2, AlertCircle } from 'lucide-react'
import { groundsApi } from '@/lib/api'

export default function GroundsPage() {
  const [grounds, setGrounds] = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [error,   setError]   = useState('')

  async function load(city) {
    setLoading(true); setError('')
    try { const r = await groundsApi.list(city); setGrounds(r.data ?? []) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Find a Ground</h2>
      </div>

      <form onSubmit={e => { e.preventDefault(); load(search) }} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by city…" className="input-field pl-10 w-full text-sm" />
        </div>
        <button type="submit" className="btn-primary px-4 py-2 rounded-xl text-sm">Search</button>
      </form>

      {loading && <div className="flex items-center gap-3 text-slate-400 py-8"><Loader2 size={16} className="animate-spin" /><span className="text-sm">Loading grounds…</span></div>}
      {error   && <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-3.5 rounded-xl"><AlertCircle size={14} className="mt-0.5 shrink-0" /><span>{error}</span></div>}

      {!loading && !error && grounds.length === 0 && (
        <div className="text-center py-12 text-slate-500"><MapPin size={28} className="mx-auto mb-2 opacity-40" /><p className="text-sm">No grounds found</p></div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {grounds.map(g => (
          <Link key={g.id} href={`/dashboard/grounds/${g.id}`}
            className="group bg-[#0c1117] border border-[#1c2432] hover:border-green-500/30 rounded-xl p-4 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-sm text-white group-hover:text-green-300 transition-colors">{g.name}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5"><MapPin size={10} />{g.city ?? g.location}</p>
              </div>
              {g.rating && <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold"><Star size={10} fill="currentColor" />{g.rating}</div>}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-400 font-semibold"><Clock size={10} />₹{g.pricePerHour ?? g.price ?? '—'}/hr</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
