'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Users, BarChart2,
  MapPin, BookOpen, ShieldAlert, Trophy, UserSearch,
  Building2, ListChecks, ClipboardCheck, LogOut,
} from 'lucide-react'
import clsx from 'clsx'
import { ROLE_LABELS } from '@/lib/rbac'
import { logout } from '@/lib/auth'
import { useRouter } from 'next/navigation'

const ROLE_BADGE = {
  player:      'bg-blue-500/10   border-blue-500/20   text-blue-400',
  captain:     'bg-green-500/10  border-green-500/20  text-green-400',
  ground_admin:'bg-orange-500/10 border-orange-500/20 text-orange-400',
  league_admin:'bg-purple-500/10 border-purple-500/20 text-purple-400',
  super_admin: 'bg-red-500/10    border-red-500/20    text-red-400',
}
const ROLE_AVATAR = {
  player:      'bg-blue-500/15   border-blue-500/25   text-blue-300',
  captain:     'bg-green-500/15  border-green-500/25  text-green-300',
  ground_admin:'bg-orange-500/15 border-orange-500/25 text-orange-300',
  league_admin:'bg-purple-500/15 border-purple-500/25 text-purple-300',
  super_admin: 'bg-red-500/15    border-red-500/25    text-red-300',
}

/* ── Nav structure (TurfTown-style sections) ─────────────────────── */
const NAV = {
  player: [
    { section: null, links: [
      { href: '/dashboard',              label: 'Home',        icon: LayoutDashboard },
    ]},
    { section: 'My Cricket', links: [
      { href: '/dashboard/fixtures',     label: 'Fixtures',    icon: Calendar },
      { href: '/dashboard/availability', label: 'Attendance',  icon: ClipboardCheck },
      { href: '/dashboard/stats',        label: 'My Stats',    icon: BarChart2 },
    ]},
    { section: 'Discover', links: [
      { href: '/dashboard/grounds',      label: 'Grounds',     icon: MapPin },
      { href: '/dashboard/leagues',      label: 'Leagues',     icon: Trophy },
      { href: '/dashboard/marketplace',  label: 'Free Agents', icon: UserSearch },
    ]},
  ],
  captain: [
    { section: null, links: [
      { href: '/dashboard',              label: 'Home',        icon: LayoutDashboard },
    ]},
    { section: 'Team', links: [
      { href: '/dashboard/fixtures',     label: 'Fixtures',    icon: Calendar },
      { href: '/dashboard/availability', label: 'Attendance',  icon: ClipboardCheck },
      { href: '/dashboard/roster',       label: 'Roster',      icon: Users },
      { href: '/dashboard/stats',        label: 'Stats',       icon: BarChart2 },
    ]},
    { section: 'Grounds', links: [
      { href: '/dashboard/grounds',      label: 'Book Ground', icon: MapPin },
      { href: '/dashboard/bookings',     label: 'My Bookings', icon: BookOpen },
    ]},
    { section: 'Leagues', links: [
      { href: '/dashboard/leagues',      label: 'Leagues',     icon: Trophy },
      { href: '/dashboard/marketplace',  label: 'Free Agents', icon: UserSearch },
    ]},
  ],
  ground_admin: [
    { section: null, links: [
      { href: '/dashboard',                  label: 'Home',     icon: LayoutDashboard },
    ]},
    { section: 'My Ground', links: [
      { href: '/dashboard/manage',           label: 'Ground',   icon: Building2 },
      { href: '/dashboard/manage/bookings',  label: 'Bookings', icon: ListChecks },
      { href: '/dashboard/manage/blacklist', label: 'Blacklist',icon: ShieldAlert },
    ]},
  ],
  league_admin: [
    { section: null, links: [
      { href: '/dashboard',              label: 'Home',        icon: LayoutDashboard },
    ]},
    { section: 'Leagues', links: [
      { href: '/dashboard/leagues',      label: 'Leagues',     icon: Trophy },
      { href: '/dashboard/fixtures',     label: 'Fixtures',    icon: Calendar },
      { href: '/dashboard/availability', label: 'Attendance',  icon: ClipboardCheck },
    ]},
    { section: 'Operations', links: [
      { href: '/dashboard/grounds',      label: 'Grounds',     icon: MapPin },
      { href: '/dashboard/bookings',     label: 'Bookings',    icon: BookOpen },
      { href: '/dashboard/roster',       label: 'Players',     icon: Users },
      { href: '/dashboard/stats',        label: 'Stats',       icon: BarChart2 },
      { href: '/dashboard/marketplace',  label: 'Free Agents', icon: UserSearch },
    ]},
  ],
  super_admin: [
    { section: null, links: [
      { href: '/dashboard',                  label: 'Home',         icon: LayoutDashboard },
    ]},
    { section: 'Platform', links: [
      { href: '/dashboard/leagues',          label: 'Leagues',      icon: Trophy },
      { href: '/dashboard/fixtures',         label: 'Fixtures',     icon: Calendar },
      { href: '/dashboard/availability',     label: 'Attendance',   icon: ClipboardCheck },
    ]},
    { section: 'Ground Mgmt', links: [
      { href: '/dashboard/grounds',           label: 'Grounds',      icon: MapPin },
      { href: '/dashboard/manage',            label: 'Manage',       icon: Building2 },
      { href: '/dashboard/manage/bookings',   label: 'Bookings',     icon: ListChecks },
      { href: '/dashboard/manage/blacklist',  label: 'Blacklist',    icon: ShieldAlert },
      { href: '/dashboard/bookings',          label: 'All Bookings', icon: BookOpen },
    ]},
    { section: 'People', links: [
      { href: '/dashboard/roster',            label: 'Players',      icon: Users },
      { href: '/dashboard/stats',             label: 'Stats',        icon: BarChart2 },
      { href: '/dashboard/marketplace',       label: 'Free Agents',  icon: UserSearch },
    ]},
  ],
}

export default function Sidebar({ role, profile }) {
  const pathname    = usePathname()
  const router      = useRouter()
  const sections    = NAV[role] ?? NAV.player
  const roleLabel   = ROLE_LABELS[role] ?? role
  const roleBadge   = ROLE_BADGE[role] ?? ROLE_BADGE.player
  const avatarColor = ROLE_AVATAR[role] ?? ROLE_AVATAR.player

  const displayName = profile?.full_name ?? 'User'
  const initials    = displayName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  async function handleSignOut() {
    await logout()
    router.push('/auth/login')
  }

  function isActive(href) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-16 sm:w-[220px] bg-[#0c1117] border-r border-[#1c2432] flex flex-col shrink-0 h-screen sticky top-0 overflow-hidden">

      {/* ── Logo ─────────────────────────────────────────── */}
      <div className="h-14 px-3 sm:px-4 flex items-center border-b border-[#1c2432] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <Image
            src="/logo/SlotYourGame Logo v4 Booking-selection_mobile logo.png"
            alt="SlotYourGame"
            width={28}
            height={28}
            className="rounded-lg shrink-0"
          />
          <span className="hidden sm:block text-[13px] font-extrabold tracking-tight leading-none">
            Slot<span className="text-green-400">YourGame</span>
          </span>
        </Link>
      </div>

      {/* ── Role badge + team ─────────────────────────────── */}
      <div className="hidden sm:block px-4 py-3 border-b border-[#1c2432]">
        <span className={clsx('inline-flex text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider', roleBadge)}>
          {roleLabel}
        </span>
        {profile?.teams?.name && (
          <p className="text-[11px] text-slate-600 mt-1 truncate font-medium">{profile.teams.name}</p>
        )}
      </div>

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 sm:px-2.5 space-y-4">
        {sections.map(({ section, links }, si) => (
          <div key={si}>
            {/* Section label */}
            {section && (
              <p className="hidden sm:block text-[9px] font-extrabold text-slate-700 uppercase tracking-[0.16em] px-2.5 mb-1.5">
                {section}
              </p>
            )}
            <div className="space-y-0.5">
              {links.map(({ href, label, icon: Icon }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      'flex items-center gap-3 px-2.5 py-2 rounded-xl text-[13px] font-semibold transition-all group',
                      active
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'text-slate-500 hover:bg-[#141c2e] hover:text-slate-200 border border-transparent'
                    )}
                  >
                    <Icon
                      size={14}
                      className={clsx(
                        'shrink-0 transition-colors',
                        active ? 'text-green-400' : 'text-slate-600 group-hover:text-slate-300'
                      )}
                    />
                    <span className="hidden sm:block truncate">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User + sign out ───────────────────────────────── */}
      <div className="border-t border-[#1c2432] p-2 sm:p-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2.5">
          <div className={clsx('w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-extrabold shrink-0', avatarColor)}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-slate-300 truncate">{displayName.split(' ')[0]}</p>
            <p className="text-[10px] text-slate-600 truncate">{roleLabel}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/8 transition-colors"
            title="Sign out"
          >
            <LogOut size={13} />
          </button>
        </div>
        {/* Mobile */}
        <div className="sm:hidden flex justify-center">
          <div className={clsx('w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-extrabold', avatarColor)}>
            {initials}
          </div>
        </div>
      </div>

    </aside>
  )
}
