'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Canonical ground detail lives at /grounds/[id] — redirect there
export default function DashboardGroundRedirect() {
  const { id }  = useParams()
  const router  = useRouter()
  useEffect(() => { router.replace(`/grounds/${id}`) }, [id])
  return null
}
