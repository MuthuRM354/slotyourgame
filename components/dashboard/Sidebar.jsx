'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Users, CheckSquare, BarChart2 } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard, roles: ['league_admin', 'captain', 'player'] },
  { href: '/dashboard/fixtures', label: 'Fixtures', icon: Calendar, roles: ['league_admin', 'captain', 'player'] },
  { href: '/dashboard/availability', label: 'Availability', icon: CheckSquare, roles: ['league_admin', 'captain', 'player'] },
  { href: '/dashboard/roster', label: 'Roster', icon: Users, roles: ['league_admin', 'captain', 'player'] },
  { href: '/dashboard/stats', label: 'Stats', icon: BarChart2, roles: ['league_admin', 'captain', 'player'] },
]

export default function Sidebar({ role }) {
  const pathname = usePathname()
  const links = NAV.filter((n) => n.roles.includes(role ?? 'player'))

  return (
    <aside className="w-16 sm:w-56 bg-gray-900 border-r border-gray-800 flex flex-col py-4 shrink-0">
      <div className="px-2 sm:px-4 mb-6">
        <span className="hidden sm:block text-green-400 font-extrabold text-lg tracking-tight">SlotYourGame</span>
        <span className="sm:hidden text-green-400 font-bold text-lg text-center block">SYG</span>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-2 sm:px-3 py-2.5 rounded-lg text-sm font-medium transition',
                active
                  ? 'bg-green-500/10 text-green-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden sm:block">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-2 sm:px-4 text-xs text-gray-600 hidden sm:block">
        <p className="capitalize">{role?.replace('_', ' ')}</p>
      </div>
    </aside>
  )
}
