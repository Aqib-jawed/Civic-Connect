'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { MAP_CONFIG, PIN_COLORS } from '@/constants/maps'
import type { Issue } from '@/types'

interface MapViewProps {
  center?:        [number, number]
  zoom?:          number
  issues?:        Issue[]
  height?:        string
  className?:     string
  onMarkerClick?: (issue: Issue) => void
  showUserPin?:   boolean
  userLocation?:  [number, number]
}

export default function MapView({
  center,
  zoom,
  issues     = [],
  height     = '400px',
  className,
  onMarkerClick,
  showUserPin,
  userLocation,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const markersRef   = useRef<any[]>([])

  useEffect(() => {
    let mounted = true

    const initMap = async () => {
      if (!containerRef.current || !mounted) return

      const L = (await import('leaflet')).default

      // Fully destroy any existing map on this container
      try {
        const el = containerRef.current as any
        if (el._leaflet_id != null) {
          // Find and remove existing map instance
          if (mapRef.current) {
            mapRef.current.off()
            mapRef.current.remove()
            mapRef.current = null
          }
          delete el._leaflet_id
        }
      } catch (_) {}

      if (!mounted || !containerRef.current) return

      const defaultCenter: [number, number] = center ?? [
        MAP_CONFIG.defaultCenter.lat,
        MAP_CONFIG.defaultCenter.lng,
      ]

      try {
        const map = L.map(containerRef.current, {
          center:      defaultCenter,
          zoom:        zoom ?? MAP_CONFIG.defaultZoom,
          zoomControl: true,
        })

        L.tileLayer(MAP_CONFIG.tileUrl, {
          attribution: MAP_CONFIG.attribution,
          maxZoom:     MAP_CONFIG.maxZoom,
        }).addTo(map)

        mapRef.current = map
      } catch (e) {
        console.warn('Map init error:', e)
      }
    }

    initMap()

    return () => {
      mounted = false
      try {
        markersRef.current.forEach(m => { try { m.remove() } catch (_) {} })
        markersRef.current = []
        if (mapRef.current) {
          mapRef.current.off()
          mapRef.current.remove()
          mapRef.current = null
        }
        const el = containerRef.current as any
        if (el && el._leaflet_id != null) {
          delete el._leaflet_id
        }
      } catch (_) {}
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    const addMarkers = async () => {
      const L = (await import('leaflet')).default

      markersRef.current.forEach(m => { try { m.remove() } catch (_) {} })
      markersRef.current = []

      issues.forEach(issue => {
        if (!mapRef.current) return
        const color = PIN_COLORS[issue.status] ?? '#64748b'

        const icon = L.divIcon({
          className: '',
          html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 6px ${color}99;"></div>`,
          iconSize:   [16, 16],
          iconAnchor: [8, 8],
        })

        try {
          const marker = L.marker([issue.latitude, issue.longitude], { icon })
          marker.bindPopup(`
            <div style="font-family:sans-serif;min-width:160px;">
              <div style="font-weight:600;font-size:13px;margin-bottom:4px;">${issue.title}</div>
              <div style="font-size:11px;color:#64748b;">${issue.address ?? ''}</div>
              <div style="margin-top:6px;">
                <span style="background:${color}22;color:${color};padding:2px 8px;border-radius:100px;font-size:11px;font-weight:600;">
                  ${issue.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          `)
          if (onMarkerClick) marker.on('click', () => onMarkerClick(issue))
          marker.addTo(mapRef.current)
          markersRef.current.push(marker)
        } catch (_) {}
      })

      if (showUserPin && userLocation && mapRef.current) {
        try {
          const userIcon = L.divIcon({
            className: '',
            html: `<div style="width:20px;height:20px;border-radius:50%;background:#00d4ff;border:3px solid white;box-shadow:0 0 12px #00d4ff99;"></div>`,
            iconSize:   [20, 20],
            iconAnchor: [10, 10],
          })
          const userMarker = L.marker(userLocation, { icon: userIcon })
            .bindPopup('<b>📍 You are here</b>')
            .addTo(mapRef.current)
          markersRef.current.push(userMarker)
          mapRef.current.setView(userLocation, 16)
        } catch (_) {}
      }
    }

    addMarkers()
  }, [issues, userLocation, showUserPin])

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={cn('w-full rounded-xl border border-slate-700 z-0', className)}
    />
  )
}