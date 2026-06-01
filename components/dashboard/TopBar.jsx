'use client'

import { logout } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, Bell, ChevronRight } from 'lucide-react'

/* Breadcrumb labels for known paths */
const PATH_LABELS = {
  '/dashboard':                    'Home',
  '/dashboard/fixtures':           'Fixtures',
  '/dashboard/availability':       'Attendance',
  '/dashboard/stats':              'My Stats',
  '/dashboard/grounds':            'Grounds',
  '/dashboard/leagues':            'Leagues',
  '/dashboard/marketplace':        'Free Agents',
  '/dashboard/roster':             'Roster',
  '/dashboard/bookings':           'My Bookings',
  '/dashboard/manage':             'My Ground',
  '/dashboard/manage/bookings':    'Booking Requests',
  '/dashboard/manage/blacklist':   'Blacklist',
}

function getBreadcrumb(pathname) {
  const label = PATH_LABELS[pathname]
  if (label) return label
  // Try prefix match for dynamic segments
  const found = Object.entries(PATH_LABELS).find(([p]) => pathname.startsWith(p) && p !== '/dashboard')
  return found ? found[1] : 'Dashboard'
}

export default function TopBar({ user, profile }) {
  const router   = useRouter()
  const pathname = usePathname()

  async function handleSignOut() {
    await logout()
    router.push('/auth/login')
  }

  const displayName = profile?.full_name ?? user?.email ?? 'User'
  const firstName   = displayName.split(' ')[0]
  const initials    = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const breadcrumb = getBreadcrumb(pathname)

  return (
    <header className="h-14 bg-[#0c1117]/90 backdrop-blur-sm border-b border-[#1c2432] flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-40">

      {/* ── Left: breadcrumb ─────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-slate-600 hidden sm:block font-medium">SlotYourGame</span>
        <ChevronRight size={13} className="text-slate-700 hidden sm:block" />
        <span className="text-slate-300 font-semibold">{breadcrumb}</span>
      </div>

      {/* ── Right ────────────────────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Notification bell (decorative for now) */}
        <button className="relative w-8 h-8 rounded-xl border border-[#1c2432] bg-[#0f1520] flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-[#252f42] transition-all hidden sm:flex">
          <Bell size={14} />
          {/* Unread dot (remove when no notifications) */}
          {/* <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-500" /> */}
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-[#1c2432] mx-1 hidden sm:block" />

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center shrink-0">
            <span className="text-green-400 text-[11px] font-bold">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-[12px] font-semibold text-slate-300 leading-none">{firstName}</p>
            <p className="text-[10px] text-slate-600 leading-none mt-0.5 truncate max-w-[120px]">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-[#1c2432] mx-1" />

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-500/8 border border-transparent hover:border-red-500/15"
        >
          <LogOut size={13} />
          <span className="hidden sm:block font-medium">Sign out</span>
        </button>
      </div>
    </header>
  )
}
