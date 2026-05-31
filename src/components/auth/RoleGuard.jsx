/**
 * Wraps role-restricted routes.
 * Props:
 *   roles: string[] — e.g. ['ADMIN'] or ['VENUE_OWNER', 'ADMIN']
 *
 * Behaviour:
 *   - Not authenticated → redirect to /login
 *   - Wrong role → redirect to / with a toast (handled by caller)
 */
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'

export default function RoleGuard({ roles = [] }) {
  const { isAuthenticated, hasAnyRole } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!hasAnyRole(roles)) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}
