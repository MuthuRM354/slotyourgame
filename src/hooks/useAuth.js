/**
 * Thin wrapper around useAuthStore — use this in components so they don't
 * import the store directly (easier to mock in tests).
 */
import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const error = useAuthStore((s) => s.error)
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const logout = useAuthStore((s) => s.logout)
  const hasRole = useAuthStore((s) => s.hasRole)
  const hasAnyRole = useAuthStore((s) => s.hasAnyRole)

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
  }
}
