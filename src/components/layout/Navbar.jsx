import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    toast.success('Logged out')
    navigate(ROUTES.HOME)
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="text-xl font-bold gradient-text">
          SlotYourGame
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to={ROUTES.TURFS} className="text-gray-300 hover:text-white transition-colors text-sm">
            Find Turfs
          </Link>
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.BOOKINGS} className="text-gray-300 hover:text-white transition-colors text-sm">
                Bookings
              </Link>
              <Link to={ROUTES.WALLET} className="text-gray-300 hover:text-white transition-colors text-sm">
                Wallet
              </Link>
              <div className="flex items-center gap-3 ml-2">
                <Link to={ROUTES.PROFILE} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                  <User size={16} />
                  {user?.fullName?.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to={ROUTES.LOGIN} className="text-sm text-gray-300 hover:text-white">
                Sign In
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <Link to={ROUTES.TURFS} className="text-gray-300" onClick={() => setMenuOpen(false)}>Find Turfs</Link>
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.BOOKINGS} className="text-gray-300" onClick={() => setMenuOpen(false)}>Bookings</Link>
              <Link to={ROUTES.WALLET} className="text-gray-300" onClick={() => setMenuOpen(false)}>Wallet</Link>
              <Link to={ROUTES.PROFILE} className="text-gray-300" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="text-left text-red-400">Sign Out</button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="text-gray-300" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to={ROUTES.REGISTER} className="text-blue-400" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
