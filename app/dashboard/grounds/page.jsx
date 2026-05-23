'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { MapPin, Phone, Search, CheckCircle } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

export default function GroundsPage() {
  const [grounds, setGrounds]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [city, setCity]         = useState('')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const supabase = createClient()
      let query = supabase
        .from('grounds')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (city.trim()) {
        query = query.ilike('city', `%${city.trim()}%`)
      }

      const { data } = await query
      setGrounds(data ?? [])
      setLoading(false)
    }
    load()
  }, [city])

  const filtered = search
    ? grounds.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.city.toLowerCase().includes(search.toLowerCase())
      )
    : grounds

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Cricket Grounds</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search grounds…"
            className="w-full bg-[#0c1117] border border-[#1c2432] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Filter by city…"
          className="sm:w-44 bg-[#0c1117] border border-[#1c2432] rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0c1117] rounded-xl border border-[#1c2432] p-5 animate-pulse h-44" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🏟️"
          title="No grounds found"
          description={city ? `No active grounds in "${city}". Try a different city.` : 'No active grounds registered yet.'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g) => (
            <Link
              key={g.id}
              href={`/dashboard/grounds/${g.id}`}
              className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-5 hover:border-green-500/40 hover:bg-[#0a0f18]/60 transition group flex flex-col gap-3"
            >
              {/* Name */}
              <div>
                <h3 className="font-semibold text-white group-hover:text-green-400 transition">
                  {g.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <MapPin size={11} />
                  {g.city}
                </div>
              </div>

              {/* Address */}
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{g.address}</p>

              {/* Facilities */}
              {g.facilities && (
                <div className="flex flex-wrap gap-1">
                  {JSON.parse(g.facilities ?? '[]').slice(0, 3).map((f) => (
                    <span key={f} className="text-xs bg-[#0a0f18] border border-[#1c2432] text-gray-400 px-2 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1c2432] mt-auto">
                {g.contact_phone ? (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone size={11} /> {g.contact_phone}
                  </span>
                ) : <span />}
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle size={11} /> Available
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
