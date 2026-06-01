'use client'

import { useState, useEffect } from 'react'
import { getUser } from '@/lib/auth'
import { normalizeRole } from '@/lib/rbac'

export function useRole() {
  const [role, setRole] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = getUser()
    setUser(u)
    setRole(normalizeRole(u?.role))
  }, [])

  return { role, user }
}
