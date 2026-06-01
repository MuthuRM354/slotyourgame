'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Calendar, MapPin, BookOpen, Trophy, UserSearch,
  Building2, ListChecks, ArrowRight, TrendingUp,
  Activity, Clock, Zap, Award, Loader2,
} from 'lucide-react'
import { useRole } from '@/lib/useRole'
import { fixturesApi, bookingsApi, walletApi } from '@/lib/api'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/rbac'

const QUICK_LINKS = {
  player: [
    { href: '/dashboard/fixtures',    label: 'Fixtures',    icon: Calendar,   color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
    { href: '/dashboard/availability',label: 'Attendance',  icon: Activity,   color: 'text-green-400',  bg: 'bg-green-500/10'  },
    { href: '/dashboard/stats',       label: 'My Stats',    icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { href: '/dashboard/marketplace', label: 'Free Agents', icon: UserSearch, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ],
  captain: [
    { href: '/dashboard/fixtures',    label: 'Fixtures',    icon: Calendar,   color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
    { href: '/dashboard/grounds',     label: 'Book Ground', icon: MapPin,     color: 'text-green-400',  bg: 'bg-green-500/10'  },
    { href: '/dashboard/bookings',    label: 'Bookings',    icon: BookOpen,   color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { href: '/dashboard/roster',      label: 'Roster',      icon: Award,      color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { href: '/dashboard/marketplace', label: 'Free Agents', icon: UserSearch, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { href: '/dashboard/leagues',     label: 'Leagues',     icon: Trophy,     color: 'text-red-400',    bg: 'bg-red-500/10'    },
  ],
  ground_admin: [
    { href: '/dashboard/manage',           label: 'My Ground',  icon: Building2,  color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { href: '/dashboard/manage/bookings',  label: 'Requests',   icon: ListChecks, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ],
  super_admin: [
    { href: '/dashboard/manage',           label: 'Grounds',    icon: Building2,  color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { href: '/dashboard/manage/bookings',  label: 'Bookings',   icon: ListChecks, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { href: '/dashboard/leagues',          label: 'Leagues',    icon: Trophy,     color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { href: '/dashboard/fixtures',         label: 'Fixtures',   icon: Calendar,   color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
  ],
}

export default function DashboardPage() {
  const { role, user }               = useRole()
  const [fixtures, setFixtures]      = useState([])
  const [balance,  setBalance]       = useState(null)
  const [loading,  setLoading]       = useState(true)

  useEffect(() => {
    if (!role) return
    Promise.allSettled([
      fixturesApi.upcoming(),
      walletApi.balance(),
    ]).then(([fRes, bRes]) => {
      if (fRes.status === 'fulfilled') setFixtures((fRes.value.data ?? []).slice(0, 3))
      if (bRes.status === 'fulfilled') setBalance(bRes.value.data)
    }).finally(() => setLoading(false))
  }, [role])

  const links     = QUICK_LINKS[role] ?? QUICK_LINKS.player
  const firstName = (user?.fullName ?? user?.name ?? 'Player').split(' ')[0]
  const roleLabel = ROLE_LABELS[role] ?? role
  const roleBadge = ROLE_COLORS[role] ?? ROLE_COLORS.player

  if (!role) return (
    <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
      <Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading…</span>
    </div>
  )

  return (
    <div className="space-y-8 max-w-4xl">

      {/* Greeting */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white">Hey, {firstName} 👋</h1>
          <span className={`inline-flex text-[11px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider ${roleBadge}`}>{roleLabel}</span>
        </div>
        <p className="text-slate-400 text-sm">Here's your overview for today.</p>
      </div>

      {/* Quick links grid */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Quick Access</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {links.map(({ href, label, icon: Icon, color, bg }) => (
            <Link key={href} href={href}
              className="group bg-[#0c1117] border border-[#1c2432] hover:border-green-500/25 rounded-xl p-4 transition-all hover:bg-[#111825]">
              <div className={`w-9 h-9 rounded-lg ${bg} border border-white/5 flex items-center justify-center mb-3`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming fixtures */}
      {(role === 'player' || role === 'captain') && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upcoming Fixtures</p>
            <Link href="/dashboard/fixtures" className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {loading && <div className="flex items-center gap-2 text-slate-500 text-sm py-4"><Loader2 size={14} className="animate-spin" />Loading…</div>}
          {!loading && fixtures.length === 0 && (
            <div className="bg-[#0c1117] border border-dashed border-[#1c2432] rounded-xl p-6 text-center text-slate-500">
              <Calendar size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No upcoming fixtures</p>
            </div>
          )}
          <div className="space-y-2">
            {fixtures.map(f => (
              <Link key={f.id} href={`/dashboard/attendance/${f.id}`}
                className="flex items-center justify-between bg-[#0c1117] border border-[#1c2432] hover:border-green-500/20 rounded-xl px-4 py-3 transition-all group">
                <div>
                  <p className="text-sm font-bold text-white">{f.team1Name ?? f.homeTeam} vs {f.team2Name ?? f.awayTeam}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar size={10} />{f.date}</span>
                    {f.time && <span className="flex items-center gap-1"><Clock size={10} />{f.time}</span>}
                    {f.venue && <span className="flex items-center gap-1 truncate"><MapPin size={10} />{f.venue}</span>}
                  </div>
                </div>
                <ArrowRight size={13} className="text-slate-600 group-hover:text-green-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Wallet balance strip */}
      {balance != null && (
        <div className="flex items-center justify-between bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/15 rounded-xl px-5 py-4">
          <div className="flex items-center gap-3">
            <Zap size={16} className="text-green-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Wallet Balance</p>
              <p className="text-lg font-extrabold text-white">₹{((balance.balancePaise ?? balance) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <Link href="/wallet" className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 font-semibold">
            View <ArrowRight size={11} />
          </Link>
        </div>
      )}
    </div>
  )
}
