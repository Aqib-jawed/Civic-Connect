'use client'

import { useEffect, useRef } from 'react'

interface InteractiveMapProps {
    center: [number, number]
    zoom?: number
    onLocationChange: (lat: number, lng: number) => void
    height?: string
}

export default function InteractiveMap({
    center,
    zoom = 15,
    onLocationChange,
    height = '400px',
}: InteractiveMapProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<any>(null)
    const markerRef = useRef<any>(null)

    useEffect(() => {
        let mounted = true

        const init = async () => {
            if (!containerRef.current || !mounted) return

            const L = (await import('leaflet')).default

            // Clean up any previous instance
            try {
                const el = containerRef.current as any
                if (el._leaflet_id != null) {
                    if (mapRef.current) {
                        mapRef.current.off()
                        mapRef.current.remove()
                        mapRef.current = null
                    }
                    delete el._leaflet_id
                }
            } catch (_) { }

            if (!mounted || !containerRef.current) return

            const map = L.map(containerRef.current, {
                center,
                zoom,
                zoomControl: true,
            })

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map)

            // Custom draggable pin icon
            const pinIcon = L.divIcon({
                className: '',
                html: `
          <div style="
            display:flex;flex-direction:column;align-items:center;
            filter:drop-shadow(0 4px 8px rgba(14,165,233,0.6));
          ">
            <div style="
              width:32px;height:32px;border-radius:50% 50% 50% 0;
              background:linear-gradient(135deg,#0ea5e9,#06b6d4);
              border:3px solid white;
              transform:rotate(-45deg);
              box-shadow:0 0 0 4px rgba(14,165,233,0.3);
            "></div>
            <div style="
              width:8px;height:8px;border-radius:50%;
              background:rgba(14,165,233,0.4);
              margin-top:2px;
            "></div>
          </div>
        `,
                iconSize: [32, 42],
                iconAnchor: [16, 42],
            })

            const marker = L.marker(center, { icon: pinIcon, draggable: true })
                .addTo(map)
                .bindPopup('<b>📍 Drag me to exact location</b>', { offset: [0, -36] })
                .openPopup()

            marker.on('dragend', () => {
                const pos = marker.getLatLng()
                onLocationChange(pos.lat, pos.lng)
            })

            // Also allow clicking map to move marker
            map.on('click', (e: any) => {
                marker.setLatLng(e.latlng)
                onLocationChange(e.latlng.lat, e.latlng.lng)
            })

            mapRef.current = map
            markerRef.current = marker
        }

        init()

        return () => {
            mounted = false
            try {
                if (markerRef.current) { markerRef.current.remove(); markerRef.current = null }
                if (mapRef.current) { mapRef.current.off(); mapRef.current.remove(); mapRef.current = null }
                const el = containerRef.current as any
                if (el && el._leaflet_id != null) delete el._leaflet_id
            } catch (_) { }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // only on mount — center is set once

    return (
        <div
            ref={containerRef}
            style={{ height }}
            className="w-full rounded-xl border border-sky-500/30 z-0 overflow-hidden shadow-lg shadow-sky-500/10"
        />
    )
}
