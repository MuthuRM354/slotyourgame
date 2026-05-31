import apiClient from './client'

const BASE = '/api/v1/bookings'

export const bookingsApi = {
  /** POST /bookings */
  create: (data) => apiClient.post(BASE, data),

  /** GET /bookings?page=0&size=10 */
  myBookings: (params) => apiClient.get(BASE, { params }),

  /** GET /bookings/:id */
  get: (id) => apiClient.get(`${BASE}/${id}`),

  /** DELETE /bookings/:id (cancel) */
  cancel: (id) => apiClient.delete(`${BASE}/${id}`),
}
