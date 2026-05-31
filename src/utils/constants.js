export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  TURFS: '/turfs',
  BOOKINGS: '/bookings',
  WALLET: '/wallet',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  VENUE: '/venue',
  ADMIN: '/admin',
}

export const ROLES = {
  PLAYER: 'PLAYER',
  CAPTAIN: 'CAPTAIN',
  SCORER: 'SCORER',
  VENUE_OWNER: 'VENUE_OWNER',
  ADMIN: 'ADMIN',
}

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
}

export const PAYMENT_STATUS = {
  CREATED: 'CREATED',
  PENDING: 'PENDING',
  CAPTURED: 'CAPTURED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
}

/** Razorpay public key — safe to expose in frontend */
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

/** Google Maps browser key — safe to expose in frontend */
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

export const APP_NAME = 'SlotYourGame'
