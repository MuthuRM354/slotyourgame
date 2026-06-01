'use client'

import { useRole } from '@/lib/useRole'
import RoleGuard from '@/components/shared/RoleGuard'
import { Users } from 'lucide-react'

export default function RosterPage() {
  const { role } = useRole()

  return (
    <RoleGuard role={role} requiredRole="captain" redirect>
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-white">Team Roster</h2>
        <div className="text-center py-16 text-slate-500">
          <Users size={32} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Roster management coming soon</p>
          <p className="text-sm mt-1">Invite players, manage your squad</p>
        </div>
      </div>
    </RoleGuard>
  )
}
