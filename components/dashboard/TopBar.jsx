'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

export default function TopBar({ user, profile }) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const displayName = profile?.full_name ?? user?.email ?? 'User'
  const initials    = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="h-14 bg-[#0c1117] border-b border-[#1c2432] flex items-center justify-between px-4 sm:px-6 shrink-0">

      {/* Left: team name or breadcrumb */}
      <div className="text-sm text-slate-600 font-medium hidden sm:block">
        {profile?.teams?.name ?? 'SlotYourGame'}
      </div>

      {/* Right: user + sign out */}
      <div className="flex items-center gap-3 ml-auto">

        {/* Avatar + name */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
            <span className="text-green-400 text-[10px] font-bold">{initials || <User size={12} />}</span>
          </div>
          <span className="hidden sm:block text-sm text-slate-300 font-medium">
            {displayName.split(' ')[0]}
          </span>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-[#1c2432] hidden sm:block" />

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-400 transition px-2 py-1.5 rounded-lg hover:bg-red-500/5"
        >
          <LogOut size={13} />
          <span className="hidden sm:block">Sign out</span>
        </button>
      </div>
    </header>
  )
}
