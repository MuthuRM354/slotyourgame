import apiClient from './client'

const BASE = '/api/v1/maps'

export const mapsApi = {
  /** Geocode address → { latitude, longitude, formattedAddress } */
  geocode: (address) => apiClient.get(`${BASE}/geocode`, { params: { address } }),

  /** Reverse geocode lat/lng → formattedAddress */
  reverseGeocode: (lat, lng) =>
    apiClient.get(`${BASE}/reverse-geocode`, { params: { lat, lng } }),

  /** Distance in km between two points */
  distance: (lat1, lng1, lat2, lng2) =>
    apiClient.get(`${BASE}/distance`, { params: { lat1, lng1, lat2, lng2 } }),
}
