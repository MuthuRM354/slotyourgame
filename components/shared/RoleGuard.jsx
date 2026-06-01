'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { hasPermission, isGroundAdmin, isCaptainOrAbove } from '@/lib/rbac'
import { ShieldAlert } from 'lucide-react'

/**
 * Inline guard — renders children only if role has permission.
 * Pass redirect={true} to push to /dashboard instead of showing fallback.
 */
export default function RoleGuard({ role, requiredRole, children, redirect = false, fallback }) {
  const router = useRouter()
  const allowed = role && hasPermission(role, requiredRole)

  useEffect(() => {
    if (role && !allowed && redirect) {
      router.push('/dashboard')
    }
  }, [role, allowed, redirect])

  if (!role) return null
  if (!allowed) {
    if (redirect) return null
    return fallback ?? (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-500">
        <ShieldAlert size={28} className="opacity-40" />
        <p className="text-sm font-medium">You don&apos;t have access to this page.</p>
      </div>
    )
  }
  return children
}
