/**
 * Axios instance with automatic JWT injection and refresh-token rotation.
 *
 * Flow:
 *  1. Every request gets Authorization: Bearer <accessToken> from localStorage
 *  2. On 401 → try POST /api/v1/auth/refresh with stored refreshToken
 *  3. If refresh succeeds → store new tokens, retry original request once
 *  4. If refresh fails → clear tokens, redirect to /login
 */
import axios from 'axios'
import { storage } from '@/utils/storage'
import { ROUTES } from '@/utils/constants'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor — inject Bearer token ──────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor — handle 401 + token refresh ─────────────────────
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests that arrive while a refresh is in flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = storage.getRefreshToken()
      if (!refreshToken) {
        storage.clearAuth()
        window.location.href = ROUTES.LOGIN
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${BASE_URL}/api/v1/auth/refresh`,
          { refreshToken },
        )
        const { accessToken, refreshToken: newRefresh } = data.data

        storage.setTokens(accessToken, newRefresh)
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        processQueue(null, accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        storage.clearAuth()
        window.location.href = ROUTES.LOGIN
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
