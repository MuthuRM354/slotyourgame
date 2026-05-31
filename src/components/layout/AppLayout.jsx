import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import { useAuth } from '@/hooks/useAuth'

// Routes where BottomNav should be hidden
const HIDE_BOTTOM_NAV = ['/login', '/register']

export default function AppLayout() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const showBottomNav = isAuthenticated && !HIDE_BOTTOM_NAV.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Navbar />

      <main className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
        <Outlet />
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  )
}
