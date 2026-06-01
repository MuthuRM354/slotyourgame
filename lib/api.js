'use client'

import { getAccessToken, refreshAccessToken } from '@/lib/auth'

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080'

async function req(path, options = {}, retry = true) {
  let token = getAccessToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  // Auto-refresh on 401
  if (res.status === 401 && retry) {
    token = await refreshAccessToken()
    if (token) return req(path, options, false)
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `HTTP ${res.status}`)
  }
  return res.json()
}

// ── Grounds ───────────────────────────────────────────────────────────────────
export const groundsApi = {
  list:   (city)   => req(`/api/v1/grounds${city ? `?city=${encodeURIComponent(city)}` : ''}`),
  get:    (id)     => req(`/api/v1/grounds/${id}`),
  slots:  (id, from, to) => req(`/api/v1/grounds/${id}/slots?from=${from}&to=${to}`),
  create: (data)   => req('/api/v1/grounds', { method: 'POST', body: JSON.stringify(data) }),
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingsApi = {
  create:    (data) => req('/api/v1/grounds/bookings',          { method: 'POST', body: JSON.stringify(data) }),
  myTeam:    ()     => req('/api/v1/grounds/bookings/my-team'),
  forGround: (id)   => req(`/api/v1/grounds/${id}/bookings`),
  approve:   (id)   => req(`/api/v1/grounds/bookings/${id}/approve`, { method: 'PATCH' }),
  reject:    (id, reason) => req(`/api/v1/grounds/bookings/${id}/reject`,  { method: 'PATCH', body: JSON.stringify({ reason }) }),
  cancel:    (id, reason) => req(`/api/v1/grounds/bookings/${id}/cancel`,  { method: 'PATCH', body: JSON.stringify({ reason }) }),
  markPaid:  (id, ref)    => req(`/api/v1/grounds/bookings/${id}/payment`, { method: 'PATCH', body: JSON.stringify({ paymentReference: ref }) }),
}

// ── Wallet ────────────────────────────────────────────────────────────────────
export const walletApi = {
  balance:      ()                   => req('/api/v1/wallet/balance'),
  transactions: (page = 0, size = 20) => req(`/api/v1/wallet/transactions?page=${page}&size=${size}`),
}

// ── Auth profile ──────────────────────────────────────────────────────────────
export const profileApi = {
  me: () => req('/api/v1/auth/me'),
}

// ── Attendance ────────────────────────────────────────────────────────────────
export const attendanceApi = {
  mark:    (fixtureId, status) => req(`/api/v1/fixtures/${fixtureId}/attendance`, { method: 'POST', body: JSON.stringify({ status }) }),
  list:    (fixtureId)         => req(`/api/v1/fixtures/${fixtureId}/attendance`),
  summary: (fixtureId)         => req(`/api/v1/fixtures/${fixtureId}/attendance/summary`),
  me:      (fixtureId)         => req(`/api/v1/fixtures/${fixtureId}/attendance/me`),
}

// ── Marketplace ───────────────────────────────────────────────────────────────
export const marketplaceApi = {
  browse: (date, city) => {
    const p = new URLSearchParams()
    if (date) p.set('date', date)
    if (city) p.set('city', city)
    return req(`/api/v1/players/availability?${p}`)
  },
  post:   (data) => req('/api/v1/players/availability', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id)   => req(`/api/v1/players/availability/${id}`, { method: 'DELETE' }),
  mine:   ()     => req('/api/v1/players/availability/me'),
}


// ── Fixtures ──────────────────────────────────────────────────────────────────
export const fixturesApi = {
  list:     ()         => req('/api/v1/fixtures'),
  upcoming: ()         => req('/api/v1/fixtures/upcoming'),
  create:   (data)     => req('/api/v1/fixtures', { method: 'POST', body: JSON.stringify(data) }),
  setStatus:(id, status) => req(`/api/v1/fixtures/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete:   (id)       => req(`/api/v1/fixtures/${id}`, { method: 'DELETE' }),
}

// ── Players ───────────────────────────────────────────────────────────────────
export const playersApi = {
  me:       ()   => req('/api/v1/players/me'),
  get:      (id) => req(`/api/v1/players/${id}`),
  list:     ()   => req('/api/v1/players'),
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export const statsApi = {
  player:  (playerId)  => req(`/api/v1/stats/player/${playerId}`),
  fixture: (fixtureId) => req(`/api/v1/stats/fixture/${fixtureId}`),
}

// ── Leagues ───────────────────────────────────────────────────────────────────
export const leaguesApi = {
  list:      ()   => req('/api/v1/leagues'),
  get:       (id) => req(`/api/v1/leagues/${id}`),
  teams:     (id) => req(`/api/v1/leagues/${id}/teams`),
  matches:   (id) => req(`/api/v1/leagues/${id}/matches`),
  standings: (id) => req(`/api/v1/leagues/${id}/standings`),
}

// ── Blacklist ─────────────────────────────────────────────────────────────────
export const blacklistApi = {
  list:   (groundId)              => req(`/api/v1/grounds/${groundId}/blacklist`),
  add:    (groundId, teamId, reason) => req(`/api/v1/grounds/${groundId}/blacklist`, { method: 'POST', body: JSON.stringify({ teamId, reason }) }),
  remove: (groundId, teamId)      => req(`/api/v1/grounds/${groundId}/blacklist/${teamId}`, { method: 'DELETE' }),
}
