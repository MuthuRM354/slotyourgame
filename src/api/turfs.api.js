import apiClient from './client'

const BASE = '/api/v1/turfs'

export const turfsApi = {
  /** GET /turfs?city=Chennai&sport=CRICKET&page=0&size=12 */
  list: (params) => apiClient.get(BASE, { params }),

  /** GET /turfs/nearby?lat=13.08&lng=80.27&radiusKm=10 */
  nearby: (lat, lng, radiusKm = 10) =>
    apiClient.get(`${BASE}/nearby`, { params: { lat, lng, radiusKm } }),

  /** GET /turfs/:slug */
  get: (slug) => apiClient.get(`${BASE}/${slug}`),

  /** GET /turfs/:id/availability?date=2025-06-15 */
  availability: (turfId, date) =>
    apiClient.get(`${BASE}/${turfId}/availability`, { params: { date } }),

  /** POST /turfs — VENUE_OWNER / ADMIN only */
  create: (data) => apiClient.post(BASE, data),

  /** PUT /turfs/:id */
  update: (id, data) => apiClient.put(`${BASE}/${id}`, data),

  /** POST /turfs/:id/reviews */
  addReview: (turfId, data) => apiClient.post(`${BASE}/${turfId}/reviews`, data),
}
