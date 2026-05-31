/**
 * Auth store — single source of truth for the currently authenticated user.
 *
 * Persisted to localStorage via storage.js so the user stays logged in
 * across page refreshes. The Axios interceptor in client.js reads the token
 * directly from storage, NOT from this store, to avoid circular imports.
 */
import { create } from 'zustand'
import { authApi } from '@/api/auth.api'
import { storage } from '@/utils/storage'

export const useAuthStore = create((set, get) => ({
  user: storage.getUser(),
  isAuthenticated: storage.isAuthenticated(),
  isLoading: false,
  error: null,

  // ── Actions ────────────────────────────────────────────────────────────

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authApi.login(credentials)
      const { accessToken, refreshToken, user } = data.data

      storage.setTokens(accessToken, refreshToken)
      storage.setUser(user)

      set({ user, isAuthenticated: true, isLoading: false })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  register: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authApi.register(formData)
      const { accessToken, refreshToken, user } = data.data

      storage.setTokens(accessToken, refreshToken)
      storage.setUser(user)

      set({ user, isAuthenticated: true, isLoading: false })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  logout: async () => {
    const refreshToken = storage.getRefreshToken()
    try {
      await authApi.logout(refreshToken)
    } catch {
      // Ignore network errors on logout — clear local state regardless
    }
    storage.clearAuth()
    set({ user: null, isAuthenticated: false, error: null })
  },

  updateUser: (updates) => {
    const updatedUser = { ...get().user, ...updates }
    storage.setUser(updatedUser)
    set({ user: updatedUser })
  },

  hasRole: (role) => get().user?.role === role,

  hasAnyRole: (roles) => roles.includes(get().user?.role),
}))
