import { useAuth } from '@/hooks/useAuth'
import { User, Mail, Phone, Shield, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ROUTES } from '@/utils/constants'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    toast.success('Logged out')
    navigate(ROUTES.HOME)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-600/40 flex items-center justify-center text-2xl font-bold text-blue-400">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-lg">{user?.fullName}</p>
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{user?.role}</span>
        </div>
      </div>

      {/* Info */}
      <div className="glass rounded-2xl divide-y divide-white/5 mb-6">
        <div className="flex items-center gap-3 px-5 py-4">
          <Mail size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <Phone size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm">{user?.phone || 'Not set'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <Shield size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Role</p>
            <p className="text-sm">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 font-medium py-3 rounded-xl transition-colors"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  )
}
