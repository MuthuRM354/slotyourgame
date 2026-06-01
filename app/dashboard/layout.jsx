'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import { getUser, isLoggedIn } from '@/lib/auth'
import { normalizeRole } from '@/lib/rbac'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({ children }) {
  const router  = useRouter()
  const [user,  setUser]  = useState(null)
  const [role,  setRole]  = useState('player')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/auth/login?next=/dashboard')
      return
    }
    const u = getUser()
    setUser(u)
    setRole(normalizeRole(u?.role))
    setReady(true)
  }, [])

  if (!ready) return (
    <div className="flex h-screen bg-[#030711] items-center justify-center gap-3 text-slate-400">
      <Loader2 size={18} className="animate-spin" />
      <span className="text-sm">Loading…</span>
    </div>
  )

  const profile = {
    full_name: user?.fullName ?? user?.name ?? 'User',
    email:     user?.email ?? '',
  }

  return (
    <div className="flex h-screen bg-[#030711] overflow-hidden">
      <Sidebar role={role} profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
