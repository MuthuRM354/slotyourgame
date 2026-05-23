'use client'

/**
 * Spring Boot API client.
 * Reads the Supabase JWT from the browser session and passes it as Bearer token.
 * Use only inside 'use client' components.
 */

import { createClient } from '@/lib/supabase/client'

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080'

async function getToken() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

async function req(path, options = {}) {
  const token = await getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── Grounds ─────────────────────────────────────────────────────────────────
export const groundsApi = {
  list: (city) => req(`/api/v1/grounds${city ? `?city=${encodeURIComponent(city)}` : ''}`),
  get:  (id)   => req(`/api/v1/grounds/${id}`),

  slots: (groundId, from, to) =>
    req(`/api/v1/grounds/${groundId}/slots?from=${from}&to=${to}`),

  createSlot: (groundId, data) =>
    req(`/api/v1/grounds/${groundId}/slots`, { method: 'POST', body: JSON.stringify(data) }),

  deleteSlot: (slotId) =>
    req(`/api/v1/grounds/slots/${slotId}`, { method: 'DELETE' }),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsApi = {
  /** Captain: create a booking for a slot */
  create: (data) =>
    req('/api/v1/grounds/bookings', { method: 'POST', body: JSON.stringify(data) }),

  /** Captain: see own team's bookings */
  myTeam: () => req('/api/v1/grounds/bookings/my-team'),

  /** Ground admin: see all bookings for their ground */
  forGround: (groundId) => req(`/api/v1/grounds/${groundId}/bookings`),

  /** Ground admin: approve a pending booking */
  approve: (id) =>
    req(`/api/v1/grounds/bookings/${id}/approve`, { method: 'PATCH' }),

  /** Ground admin: reject a pending booking */
  reject: (id, reason) =>
    req(`/api/v1/grounds/bookings/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  /** Captain / ground admin: cancel */
  cancel: (id, reason) =>
    req(`/api/v1/grounds/bookings/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  /** Ground admin: mark payment received */
  markPaid: (id, paymentReference) =>
    req(`/api/v1/grounds/bookings/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentReference }),
    }),
}

// ─── Blacklist ─────────────────────────────────────────────────────────────────
export const blacklistApi = {
  list:   (groundId)           => req(`/api/v1/grounds/${groundId}/blacklist`),
  add:    (groundId, teamId, reason) =>
    req(`/api/v1/grounds/${groundId}/blacklist`, {
      method: 'POST',
      body: JSON.stringify({ teamId, reason }),
    }),
  remove: (groundId, teamId)   =>
    req(`/api/v1/grounds/${groundId}/blacklist/${teamId}`, { method: 'DELETE' }),
}

// ─── Attendance ───────────────────────────────────────────────────────────────
export const attendanceApi = {
  mark:    (fixtureId, status) =>
    req(`/api/v1/fixtures/${fixtureId}/attendance`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),
  list:    (fixtureId) => req(`/api/v1/fixtures/${fixtureId}/attendance`),
  summary: (fixtureId) => req(`/api/v1/fixtures/${fixtureId}/attendance/summary`),
  me:      (fixtureId) => req(`/api/v1/fixtures/${fixtureId}/attendance/me`),
}

// ─── Player availability marketplace ─────────────────────────────────────────
export const marketplaceApi = {
  browse:  (date, city) => {
    const params = new URLSearchParams()
    if (date) params.set('date', date)
    if (city) params.set('city', city)
    return req(`/api/v1/players/availability?${params}`)
  },
  post:   (data) =>
    req('/api/v1/players/availability', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) =>
    req(`/api/v1/players/availability/${id}`, { method: 'DELETE' }),
  mine:   () => req('/api/v1/players/availability/me'),
}

// ─── Leagues ──────────────────────────────────────────────────────────────────
export const leaguesApi = {
  list:       ()   => req('/api/v1/leagues'),
  get:        (id) => req(`/api/v1/leagues/${id}`),
  standings:  (id) => req(`/api/v1/leagues/${id}/standings`),
  matches:    (id) => req(`/api/v1/leagues/${id}/matches`),
}
