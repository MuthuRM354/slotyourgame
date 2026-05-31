import apiClient from './client'

const BASE = '/api/v1/payments'

export const paymentsApi = {
  /**
   * Step 1 — Create Razorpay order on backend.
   * Returns { razorpayOrderId, amountPaise, currency }
   */
  createOrder: (data) => apiClient.post(`${BASE}/order`, data),

  /**
   * Step 2 — Send payment response from Razorpay to backend for HMAC verification.
   * Backend verifies signature before confirming booking.
   */
  verify: (data) => apiClient.post(`${BASE}/verify`, data),
}
