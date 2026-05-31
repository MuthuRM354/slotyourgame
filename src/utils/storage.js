/**
 * Centralised localStorage helpers for auth tokens + user cache.
 * Single source of truth — import `storage` everywhere, never call
 * localStorage directly.
 */

const KEYS = {
  ACCESS_TOKEN: 'syg_access',
  REFRESH_TOKEN: 'syg_refresh',
  USER: 'syg_user',
}

export const storage = {
  getAccessToken: () => localStorage.getItem(KEYS.ACCESS_TOKEN),
  getRefreshToken: () => localStorage.getItem(KEYS.REFRESH_TOKEN),
  getUser: () => {
    const raw = localStorage.getItem(KEYS.USER)
    return raw ? JSON.parse(raw) : null
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken)
  },

  setUser: (user) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user))
  },

  clearAuth: () => {
    localStorage.removeItem(KEYS.ACCESS_TOKEN)
    localStorage.removeItem(KEYS.REFRESH_TOKEN)
    localStorage.removeItem(KEYS.USER)
  },

  isAuthenticated: () => !!localStorage.getItem(KEYS.ACCESS_TOKEN),
}
