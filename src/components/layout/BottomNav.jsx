/**
 * Mobile-first bottom navigation bar — fixed at bottom, hidden on md+.
 */
import { NavLink } from 'react-router-dom'
import { Home, Search, CalendarDays, Wallet, User } from 'lucide-react'
import { ROUTES } from '@/utils/constants'

const NAV_ITEMS = [
  { to: ROUTES.HOME,     icon: Home,          label: 'Home' },
  { to: ROUTES.TURFS,    icon: Search,        label: 'Find' },
  { to: ROUTES.BOOKINGS, icon: CalendarDays,  label: 'Bookings' },
  { to: ROUTES.WALLET,   icon: Wallet,        label: 'Wallet' },
  { to: ROUTES.PROFILE,  icon: User,          label: 'Me' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-gray-900/95 backdrop-blur-md border-t border-white/10 pb-safe">
      <div className="flex">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-colors ${
                isActive ? 'text-blue-400' : 'text-gray-500'
              }`
            }
          >
            <Icon size={20} strokeWidth={isActive => isActive ? 2.5 : 1.5} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
