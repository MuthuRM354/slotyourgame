'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, AlertCircle, User, Mail, Shield, LogOut } from 'lucide-react'
import { profileApi } from '@/lib/api'
import { logout, getUser } from '@/lib/auth'

const ROLE_LABEL = {
  PLAYER:       'Player',
  CAPTAIN:      'Captain',
  SCORER:       'Scorer',
  VENUE_OWNER:  'Ground Admin',
  ADMIN:        'Super Admin',
}
const ROLE_COLOR = {
  PLAYER:      'bg-blue-500/10 text-blue-400 border-blue-500/20',
  CAPTAIN:     'bg-green-500/10 text-green-400 border-green-500/20',
  SCORER:      'bg-purple-500/10 text-purple-400 border-purple-500/20',
  VENUE_OWNER: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  ADMIN:       'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function ProfilePage() {
  const router = useRouter()
  const [user,    setUser]    = useState(getUser())
  const [loading, setLoading] = useState(!user)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (!user) {
      profileApi.me()
        .then(res => setUser(res.data))
        .catch(e  => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [])

  async function handleLogout() {
    await logout()
    router.push('/auth/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#060b14] flex items-center justify-center gap-3 text-slate-400">
      <Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading profile…</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <div className="border-b border-white/5 px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={15} /> Dashboard
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-4 rounded-xl mb-6">
            <AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{error}</span>
          </div>
        )}

        {user && (
          <div className="space-y-4">
            {/* Avatar + name */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/20 flex items-center justify-center text-2xl font-bold text-green-400">
                {(user.fullName ?? user.name ?? '?')[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.fullName ?? user.name}</h2>
                {user.role && (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border mt-1.5 ${ROLE_COLOR[user.role] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                    <Shield size={11} />{ROLE_LABEL[user.role] ?? user.role}
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white/3 border border-white/8 rounded-2xl divide-y divide-white/5">
              <div className="flex items-center gap-4 px-5 py-4">
                <User size={15} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Full Name</p>
                  <p className="text-sm mt-0.5">{user.fullName ?? user.name ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-5 py-4">
                <Mail size={15} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Email</p>
                  <p className="text-sm mt-0.5">{user.email ?? '—'}</p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/bookings" className="bg-white/3 border border-white/8 hover:border-green-500/30 rounded-xl p-4 text-sm font-semibold text-slate-300 hover:text-white transition-all text-center">
                My Bookings
              </Link>
              <Link href="/wallet" className="bg-white/3 border border-white/8 hover:border-green-500/30 rounded-xl p-4 text-sm font-semibold text-slate-300 hover:text-white transition-all text-center">
                Wallet
              </Link>
            </div>

            {/* Logout */}
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 py-3.5 rounded-xl text-sm font-semibold transition-all">
              <LogOut size={15} /> Sign out of account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
