/**
 * Hook to get the user's current GPS position.
 * Used by DiscoverTurfs to find nearby turfs.
 */
import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [position, setPosition] = useState(null)   // { lat, lng }
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { timeout: 10_000, enableHighAccuracy: true },
    )
  }, [])

  return { position, error, loading }
}
