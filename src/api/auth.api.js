import apiClient from './client'

const BASE = '/api/v1/auth'

export const authApi = {
  register: (data) => apiClient.post(`${BASE}/register`, data),
  login: (data) => apiClient.post(`${BASE}/login`, data),
  refresh: (refreshToken) => apiClient.post(`${BASE}/refresh`, { refreshToken }),
  logout: (refreshToken) => apiClient.post(`${BASE}/logout`, { refreshToken }),
  me: () => apiClient.get(`${BASE}/me`),
}
