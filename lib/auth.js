'use client'

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080'
const TOKEN_KEY   = 'syg_access_token'
const REFRESH_KEY = 'syg_refresh_token'
const USER_KEY    = 'syg_user'

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getAccessToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
}

function saveSession({ accessToken, refreshToken, user }) {
  localStorage.setItem(TOKEN_KEY,   accessToken)
  localStorage.setItem(REFRESH_KEY, refreshToken)
  localStorage.setItem(USER_KEY,    JSON.stringify(user))
  // Also write to cookie so Next.js middleware can read it
  document.cookie = `syg_token=${accessToken}; path=/; SameSite=Lax`
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
  document.cookie = 'syg_token=; path=/; max-age=0'
}

// ── Auth actions ──────────────────────────────────────────────────────────────

export async function login(email, password) {
  const res = await fetch(`${BASE}/api/v1/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.message ?? `Login failed (${res.status})`)
  saveSession(body.data)
  return body.data.user
}

export async function register(fullName, email, password, role) {
  const res = await fetch(`${BASE}/api/v1/auth/register`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ fullName, email, password, role }),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.message ?? `Registration failed (${res.status})`)
  saveSession(body.data)
  return body.data.user
}

export async function logout() {
  const token = getAccessToken()
  if (token) {
    await fetch(`${BASE}/api/v1/auth/logout`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {})
  }
  clearSession()
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_KEY)
  if (!refreshToken) { clearSession(); return null }
  const res = await fetch(`${BASE}/api/v1/auth/refresh`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ refreshToken }),
  })
  if (!res.ok) { clearSession(); return null }
  const body = await res.json()
  saveSession(body.data)
  return body.data.accessToken
}

export function isLoggedIn() {
  return !!getAccessToken()
}
