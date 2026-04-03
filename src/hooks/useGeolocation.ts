import { useState, useCallback } from 'react'
import type { GPSLocation } from '@/types'

interface GeolocationState {
  location: GPSLocation | null
  loading: boolean
  error: string | null
  captured: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading:  false,
    error:    null,
    captured: false,
  })

  const captureLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Geolocation is not supported by your browser.' }))
      return
    }

    setState(s => ({ ...s, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude:  position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy:  position.coords.accuracy,
            timestamp: position.timestamp,
          },
          loading:  false,
          error:    null,
          captured: true,
        })
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Location permission denied. Please allow location access.',
          2: 'Location unavailable. Please try again.',
          3: 'Location request timed out. Please try again.',
        }
        setState(s => ({
          ...s,
          loading: false,
          error: messages[err.code] ?? 'Failed to get location.',
        }))
      },
      {
        enableHighAccuracy: true,
        timeout:            15000,
        maximumAge:         0,
      }
    )
  }, [])

  const reset = useCallback(() => {
    setState({ location: null, loading: false, error: null, captured: false })
  }, [])

  return { ...state, captureLocation, reset }
}