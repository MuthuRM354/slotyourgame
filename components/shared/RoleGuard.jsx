import { hasPermission } from '@/lib/rbac'

export default function RoleGuard({ userRole, requiredRole, children, fallback = null }) {
  if (!hasPermission(userRole, requiredRole)) return fallback
  return children
}
