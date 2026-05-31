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
  player:      'bg-blue-500/10   border-blue-500/20   text-blue-400',
  captain:     'bg-green-500/10  border-green-500/20  text-green-400',
  ground_admin:'bg-orange-500/10 border-orange-500/20 text-orange-400',
  league_admin:'bg-purple-500/10 border-purple-500/20 text-purple-400',
  super_admin: 'bg-red-500/10    border-red-500/20    text-red-400',
}

const ROLE_AVATAR_COLOR = {
  player:      'bg-blue-500/15 border-blue-500/25 text-blue-400',
  captain:     'bg-green-500/15 border-green-500/25 text-green-400',
  ground_admin:'bg-orange-500/15 border-orange-500/25 text-orange-400',
  league_admin:'bg-purple-500/15 border-purple-500/25 text-purple-400',
  super_admin: 'bg-red-500/15 border-red-500/25 text-red-400',
}

/* ── Nav sections per role ─────────────────────────────────────── */
const NAV = {
  player: [
    {
      section: 'Main',
      links: [
        { href: '/dashboard',              label: 'Home',        icon: LayoutDashboard },
        { href: '/dashboard/fixtures',     label: 'Fixtures',    icon: Calendar },
        { href: '/dashboard/availability', label: 'Attendance',  icon: ClipboardCheck },
      ],
    },
    {
      section: 'Discover',
      links: [
        { href: '/dashboard/stats',        label: 'My Stats',    icon: BarChart2 },
        { href: '/dashboard/grounds',      label: 'Grounds',     icon: MapPin },
        { href: '/dashboard/leagues',      label: 'Leagues',     icon: Trophy },
        { href: '/dashboard/marketplace',  label: 'Free Agents', icon: UserSearch },
      ],
    },
  ],
  captain: [
    {
      section: 'Team',
      links: [
        { href: '/dashboard',              label: 'Home',        icon: LayoutDashboard },
        { href: '/dashboard/fixtures',     label: 'Fixtures',    icon: Calendar },
        { href: '/dashboard/availability', label: 'Attendance',  icon: ClipboardCheck },
        { href: '/dashboard/roster',       label: 'Roster',      icon: Users },
      ],
    },
    {
      section: 'Grounds & Leagues',
      links: [
        { href: '/dashboard/grounds',      label: 'Book Ground', icon: MapPin },
        { href: '/dashboard/bookings',     label: 'My Bookings', icon: BookOpen },
        { href: '/dashboard/leagues',      label: 'Leagues',     icon: Trophy },
      ],
    },
    {
      section: 'Recruit',
      links: [
        { href: '/dashboard/stats',        label: 'Stats',       icon: BarChart2 },
        { href: '/dashboard/marketplace',  label: 'Free Agents', icon: UserSearch },
      ],
    },
  ],
  ground_admin: [
    {
      section: 'Ground',
      links: [
        { href: '/dashboard',                  label: 'Home',     icon: LayoutDashboard },
        { href: '/dashboard/manage',           label: 'My Ground',icon: Building2 },
        { href: '/dashboard/manage/bookings',  label: 'Bookings', icon: ListChecks },
        { href: '/dashboard/manage/blacklist', label: 'Blacklist',icon: ShieldAlert },
      ],
    },
  ],
  league_admin: [
    {
      section: 'Main',
      links: [
        { href: '/dashboard',              label: 'Home',        icon: LayoutDashboard },
        { href: '/dashboard/leagues',      label: 'Leagues',     icon: Trophy },
        { href: '/dashboard/fixtures',     label: 'Fixtures',    icon: Calendar },
      ],
    },
    {
      section: 'Operations',
      links: [
        { href: '/dashboard/availability', label: 'Attendance',  icon: ClipboardCheck },
        { href: '/dashboard/grounds',      label: 'Grounds',     icon: MapPin },
        { href: '/dashboard/bookings',     label: 'Bookings',    icon: BookOpen },
        { href: '/dashboard/roster',       label: 'Players',     icon: Users },
        { href: '/dashboard/stats',        label: 'Stats',       icon: BarChart2 },
        { href: '/dashboard/marketplace',  label: 'Free Agents', icon: UserSearch },
      ],
    },
  ],
  super_admin: [
    {
      section: 'Admin',
      links: [
        { href: '/dashboard',                  label: 'Home',         icon: LayoutDashboard },
        { href: '/dashboard/leagues',          label: 'Leagues',      icon: Trophy },
        { href: '/dashboard/fixtures',         label: 'Fixtures',     icon: Calendar },
        { href: '/dashboard/availability',     label: 'Attendance',   icon: ClipboardCheck },
      ],
    },
    {
      section: 'Ground Management',
      links: [
        { href: '/dashboard/grounds',           label: 'Grounds',      icon: MapPin },
        { href: '/dashboard/manage',            label: 'Ground Mgmt',  icon: Building2 },
        { href: '/dashboard/manage/bookings',   label: 'Bookings Mgmt',icon: ListChecks },
        { href: '/dashboard/manage/blacklist',  label: 'Blacklist',    icon: ShieldAlert },
        { href: '/dashboard/bookings',          label: 'All Bookings', icon: BookOpen },
      ],
    },
    {
      section: 'People',
      links: [
        { href: '/dashboard/roster',            label: 'Players',      icon: Users },
        { href: '/dashboard/stats',             label: 'Stats',        icon: BarChart2 },
        { href: '/dashboard/marketplace',       label: 'Free Agents',  icon: UserSearch },
      ],
    },
  ],
}

/* Flatten nav sections to get all links (for active check) */
function getLinks(role) {
  return (NAV[role] ?? NAV.player).flatMap((s) => s.links)
}

export default function Sidebar({ role, profile }) {
  const pathname   = usePathname()
  const sections   = NAV[role] ?? NAV.player
  const roleLabel  = ROLE_LABELS[role] ?? role
  const roleBadge  = ROLE_BADGE[role] ?? ROLE_BADGE.player
  const avatarColor= ROLE_AVATAR_COLOR[role] ?? ROLE_AVATAR_COLOR.player

  const displayName = profile?.full_name ?? 'User'
  const initials    = displayName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  function isActive(href) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-16 sm:w-[220px] bg-[#0c1117] border-r border-[#1c2432] flex flex-col shrink-0 h-screen sticky top-0">

      {/* ── Logo ─────────────────────────────────────────── */}
      <div className="h-14 px-3 sm:px-4 flex items-center border-b border-[#1c2432] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center group-hover:border-green-500/40 group-hover:bg-green-500/20 transition-all shrink-0">
            <Zap size={14} className="text-green-400" />
          </div>
          <span className="hidden sm:block text-[13px] font-bold tracking-tight">
            Slot<span className="text-green-400">YourGame</span>
          </span>
        </Link>
      </div>

      {/* ── Role badge ───────────────────────────────────── */}
      <div className="hidden sm:block px-4 pt-4 pb-2">
        <span className={clsx('inline-flex text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider', roleBadge)}>
          {roleLabel}
        </span>
        {profile?.teams?.name && (
          <p className="text-[11px] text-slate-600 mt-1 truncate">{profile.teams.name}</p>
        )}
      </div>

      {/* ── Nav sections ─────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 sm:px-3 space-y-5">
        {sections.map(({ section, links }) => (
          <div key={section}>
            {/* Section label */}
            <p className="hidden sm:block text-[10px] font-bold text-slate-700 uppercase tracking-widest px-2 mb-1.5">
              {section}
            </p>
            <div className="space-y-0.5">
              {links.map(({ href, label, icon: Icon }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      'flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-[13px] font-medium transition-all group',
                      active
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_12px_rgba(34,197,94,0.08)]'
                        : 'text-slate-500 hover:bg-[#141c2e] hover:text-slate-200 border border-transparent'
                    )}
                  >
                    <Icon
                      size={15}
                      className={clsx('shrink-0', active ? 'text-green-400' : 'text-slate-600 group-hover:text-slate-300')}
                    />
                    <span className="hidden sm:block truncate">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User profile at bottom ───────────────────────── */}
      <div className="px-3 pb-4 pt-3 border-t border-[#1c2432] shrink-0">
        <div className="hidden sm:flex items-center gap-2.5">
          <div className={clsx('w-8 h-8 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold', avatarColor)}>
            {initials || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate-300 truncate">{displayName.split(' ')[0]}</p>
            <p className="text-[10px] text-slate-600 truncate">{roleLabel}</p>
          </div>
        </div>
        {/* Mobile: just a small dot */}
        <div className="sm:hidden flex justify-center">
          <div className={clsx('w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-bold', avatarColor)}>
            {initials || '?'}
          </div>
        </div>
      </div>

    </aside>
  )
}
