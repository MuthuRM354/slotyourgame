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

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="text-sm text-gray-400">
        <span className="hidden sm:inline">Renaissance CC</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
            <User size={14} className="text-green-400" />
          </div>
          <span className="hidden sm:block">{profile?.full_name ?? user?.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition px-2 py-1 rounded"
        >
          <LogOut size={14} />
          <span className="hidden sm:block">Sign out</span>
        </button>
      </div>
    </header>
  )
}
