'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Users, BarChart2,
  MapPin, BookOpen, ShieldAlert, Trophy, UserSearch,
  Building2, ListChecks, ClipboardCheck, Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { ROLE_LABELS } from '@/lib/rbac'

const ROLE_BADGE = {
  player:      'bg-blue-500/10   border-blue-500/25   text-blue-400',
  captain:     'bg-green-500/10  border-green-500/25  text-green-400',
  ground_admin:'bg-orange-500/10 border-orange-500/25 text-orange-400',
  league_admin:'bg-purple-500/10 border-purple-500/25 text-purple-400',
  super_admin: 'bg-red-500/10    border-red-500/25    text-red-400',
}

const NAV = {
  player: [
    { href: '/dashboard',              label: 'Home',        icon: LayoutDashboard },
    { href: '/dashboard/fixtures',     label: 'Fixtures',    icon: Calendar },
    { href: '/dashboard/availability', label: 'Attendance',  icon: ClipboardCheck },
    { href: '/dashboard/stats',        label: 'My Stats',    icon: BarChart2 },
    { href: '/dashboard/grounds',      label: 'Grounds',     icon: MapPin },
    { href: '/dashboard/leagues',      label: 'Leagues',     icon: Trophy },
    { href: '/dashboard/marketplace',  label: 'Free Agents', icon: UserSearch },
  ],
  captain: [
    { href: '/dashboard',              label: 'Home',        icon: LayoutDashboard },
    { href: '/dashboard/fixtures',     label: 'Fixtures',    icon: Calendar },
    { href: '/dashboard/availability', label: 'Attendance',  icon: ClipboardCheck },
    { href: '/dashboard/roster',       label: 'Roster',      icon: Users },
    { href: '/dashboard/stats',        label: 'Stats',       icon: BarChart2 },
    { href: '/dashboard/grounds',      label: 'Book Ground', icon: MapPin },
    { href: '/dashboard/bookings',     label: 'My Bookings', icon: BookOpen },
    { href: '/dashboard/leagues',      label: 'Leagues',     icon: Trophy },
    { href: '/dashboard/marketplace',  label: 'Free Agents', icon: UserSearch },
  ],
  ground_admin: [
    { href: '/dashboard',                  label: 'Home',     icon: LayoutDashboard },
    { href: '/dashboard/manage',           label: 'My Ground',icon: Building2 },
    { href: '/dashboard/manage/bookings',  label: 'Bookings', icon: ListChecks },
    { href: '/dashboard/manage/blacklist', label: 'Blacklist',icon: ShieldAlert },
  ],
  league_admin: [
    { href: '/dashboard',              label: 'Home',        icon: LayoutDashboard },
    { href: '/dashboard/leagues',      label: 'Leagues',     icon: Trophy },
    { href: '/dashboard/fixtures',     label: 'Fixtures',    icon: Calendar },
    { href: '/dashboard/availability', label: 'Attendance',  icon: ClipboardCheck },
    { href: '/dashboard/grounds',      label: 'Grounds',     icon: MapPin },
    { href: '/dashboard/bookings',     label: 'Bookings',    icon: BookOpen },
    { href: '/dashboard/roster',       label: 'Players',     icon: Users },
    { href: '/dashboard/stats',        label: 'Stats',       icon: BarChart2 },
    { href: '/dashboard/marketplace',  label: 'Free Agents', icon: UserSearch },
  ],
  super_admin: [
    { href: '/dashboard',                  label: 'Home',         icon: LayoutDashboard },
    { href: '/dashboard/fixtures',         label: 'Fixtures',     icon: Calendar },
    { href: '/dashboard/availability',     label: 'Attendance',   icon: ClipboardCheck },
    { href: '/dashboard/leagues',          label: 'Leagues',      icon: Trophy },
    { href: '/dashboard/grounds',          label: 'Grounds',      icon: MapPin },
    { href: '/dashboard/manage',           label: 'Ground Mgmt',  icon: Building2 },
    { href: '/dashboard/manage/bookings',  label: 'Bookings Mgmt',icon: ListChecks },
    { href: '/dashboard/manage/blacklist', label: 'Blacklist',    icon: ShieldAlert },
    { href: '/dashboard/bookings',         label: 'All Bookings', icon: BookOpen },
    { href: '/dashboard/roster',           label: 'Players',      icon: Users },
    { href: '/dashboard/stats',            label: 'Stats',        icon: BarChart2 },
    { href: '/dashboard/marketplace',      label: 'Free Agents',  icon: UserSearch },
  ],
}

export default function Sidebar({ role }) {
  const pathname  = usePathname()
  const links     = NAV[role] ?? NAV.player
  const roleLabel = ROLE_LABELS[role] ?? role
  const roleBadge = ROLE_BADGE[role] ?? ROLE_BADGE.player

  function isActive(href) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-16 sm:w-60 bg-[#0c1117] border-r border-[#1c2432] flex flex-col py-5 shrink-0">

      {/* Logo */}
      <div className="px-2 sm:px-5 mb-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Zap size={18} className="text-green-400 shrink-0" />
          <span className="hidden sm:block text-green-400 font-extrabold text-base tracking-tight">
            SlotYourGame
          </span>
        </Link>
      </div>

      {/* Role badge */}
      <div className="hidden sm:block px-5 mb-5">
        <span className={clsx('inline-flex text-xs px-2.5 py-1 rounded-full border font-semibold', roleBadge)}>
          {roleLabel}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 sm:px-3 space-y-0.5 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 px-2 sm:px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive(href)
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'text-slate-500 hover:bg-[#1a2030] hover:text-slate-200 border border-transparent'
            )}
          >
            <Icon size={16} className="shrink-0" />
            <span className="hidden sm:block">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 sm:px-5 pt-4 border-t border-[#1c2432] mt-2">
        <p className="hidden sm:block text-xs text-slate-700">
          v2 · SlotYourGame
        </p>
      </div>
    </aside>
  )
}
