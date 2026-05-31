import apiClient from './client'

const BASE = '/api/v1/wallet'

export const walletApi = {
  /** GET /wallet/balance */
  balance: () => apiClient.get(`${BASE}/balance`),

  /** GET /wallet/transactions?page=0&size=20 */
  transactions: (params) => apiClient.get(`${BASE}/transactions`, { params }),
}
