'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  MapPin, Loader2, CheckCircle, AlertCircle,
  ChevronRight, Search,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { GPSLocation } from '@/types'

const InteractiveMap = dynamic(() => import('./InteractiveMap'), { ssr: false })

/* ─── Indian States ──────────────────────────────────────────────── */
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

interface LocationCaptureProps {
  onCapture: (location: GPSLocation) => void
}

type Phase = 'address' | 'map'
type MapStatus = 'geocoding' | 'ready' | 'error'

async function geocodeAddress(city: string, state: string, pincode: string) {
  const query = encodeURIComponent(`${city}, ${state} ${pincode}, India`)
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=in`
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  const data = await res.json()
  if (!data || data.length === 0) throw new Error('Address not found. Please check state, city, and pincode.')
  return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) }
}

export default function LocationCapture({ onCapture }: LocationCaptureProps) {
  /* ── Phase 1: Address ── */
  const [phase, setPhase] = useState<Phase>('address')
  const [stateVal, setStateVal] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [addrError, setAddrError] = useState('')

  /* ── Phase 2: Map ── */
  const [mapStatus, setMapStatus] = useState<MapStatus>('geocoding')
  const [mapError, setMapError] = useState('')
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
  const [pinLat, setPinLat] = useState<number | null>(null)
  const [pinLng, setPinLng] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  /* ── Auto-geocode whenever we enter map phase ── */
  useEffect(() => {
    if (phase !== 'map') return
    setMapStatus('geocoding')
    setMapError('')
    setConfirmed(false)

    geocodeAddress(city, stateVal, pincode)
      .then(({ latitude, longitude }) => {
        setMapCenter([latitude, longitude])
        setPinLat(latitude)
        setPinLng(longitude)
        setMapStatus('ready')
      })
      .catch((err: any) => {
        setMapError(err.message ?? 'Could not find address. Please go back and check.')
        setMapStatus('error')
      })
  }, [phase])

  /* ── Address validation ── */
  const handleAddressNext = () => {
    if (!stateVal) { setAddrError('Please select a state'); return }
    if (!city.trim()) { setAddrError('Please enter your city'); return }
    if (!/^\d{6}$/.test(pincode.trim())) { setAddrError('Pincode must be exactly 6 digits'); return }
    setAddrError('')
    setPhase('map')
  }

  /* ── Confirm the dragged pin ── */
  const handleConfirm = () => {
    if (pinLat == null || pinLng == null) return
    const loc: GPSLocation = {
      latitude: pinLat,
      longitude: pinLng,
      accuracy: 10,
      timestamp: Date.now(),
      state: stateVal,
      city,
      pincode,
    }
    setConfirmed(true)
    onCapture(loc)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ─── Sub-step indicator ─── */}
      <div className="flex items-center gap-2 mb-1">
        {(['address', 'map'] as Phase[]).map((p, i) => {
          const done = phase === 'map' && p === 'address'
          const current = phase === p
          return (
            <div key={p} className="flex items-center gap-2">
              <div className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold border transition-all',
                done && 'bg-emerald-500 border-emerald-500 text-white',
                current && !done && 'bg-sky-500 border-sky-500 text-white',
                !done && !current && 'bg-transparent border-slate-600 text-slate-500',
              )}>
                {done ? '✓' : i + 1}
              </div>
              <span className={cn('text-xs', current ? 'text-sky-400 font-medium' : 'text-slate-500')}>
                {p === 'address' ? 'Address' : 'Pin Location'}
              </span>
              {i === 0 && <ChevronRight size={14} className="text-slate-600" />}
            </div>
          )
        })}
      </div>

      {/* ─────────── Phase 1 – Address ─────────── */}
      {phase === 'address' && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">📍 Enter Issue Location</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tell us where the issue is located</p>
          </div>

          {/* State */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">State *</label>
            <select
              value={stateVal}
              onChange={e => { setStateVal(e.target.value); setAddrError('') }}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
            >
              <option value="">— Select State / UT —</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* City */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">City / Town *</label>
            <input
              type="text"
              value={city}
              placeholder="e.g. Visakhapatnam"
              onChange={e => { setCity(e.target.value); setAddrError('') }}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
            />
          </div>

          {/* Pincode */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Pincode *</label>
            <input
              type="text"
              value={pincode}
              placeholder="e.g. 530001"
              maxLength={6}
              onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setAddrError('') }}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
            />
          </div>

          {addrError && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} /> {addrError}
            </p>
          )}

          <Button onClick={handleAddressNext} className="w-full gap-2">
            <Search size={14} /> Find on Map →
          </Button>
        </div>
      )}

      {/* ─────────── Phase 2 – Interactive Map ─────────── */}
      {phase === 'map' && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5 flex flex-col gap-4">

          {/* Address chip */}
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
            <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-emerald-400 font-medium">{city}, {stateVal} – {pincode}</p>
            <button
              onClick={() => { setPhase('address'); setConfirmed(false) }}
              className="ml-auto text-xs text-slate-400 hover:text-slate-200 underline underline-offset-2 transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Geocoding spinner */}
          {mapStatus === 'geocoding' && (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <Loader2 size={28} className="animate-spin text-sky-400" />
              <p className="text-sm text-slate-400">Finding your location on the map…</p>
            </div>
          )}

          {/* Error */}
          {mapStatus === 'error' && (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 flex items-center gap-2">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-400">{mapError}</p>
              </div>
              <Button onClick={() => setPhase('address')} variant="outline" size="sm" className="w-full">
                ← Go Back &amp; Edit Address
              </Button>
            </div>
          )}

          {/* Map ready */}
          {mapStatus === 'ready' && mapCenter && (
            <>
              {/* Instructions */}
              <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 px-3 py-2 flex items-start gap-2">
                <MapPin size={14} className="text-sky-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-sky-300">
                  <span className="font-semibold">Drag the pin</span> or <span className="font-semibold">tap the map</span> to mark the exact issue location
                </p>
              </div>

              {/* Large interactive map */}
              <InteractiveMap
                center={mapCenter}
                zoom={15}
                height="400px"
                onLocationChange={(lat, lng) => {
                  setPinLat(lat)
                  setPinLng(lng)
                  setConfirmed(false)
                }}
              />

              {/* Coordinates display */}
              {pinLat != null && pinLng != null && (
                <div className="flex items-center justify-between rounded-lg bg-slate-800 border border-slate-700 px-3 py-2">
                  <span className="text-xs text-slate-400">Pin coordinates</span>
                  <span className="text-xs font-mono text-slate-200">
                    {pinLat.toFixed(5)}, {pinLng.toFixed(5)}
                  </span>
                </div>
              )}

              {/* Confirm button */}
              {!confirmed ? (
                <Button
                  onClick={handleConfirm}
                  className="w-full gap-2"
                  disabled={pinLat == null}
                >
                  <CheckCircle size={15} /> Confirm This Location ✓
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-4 py-3">
                  <CheckCircle size={16} className="text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">Location Confirmed!</span>
                  <button
                    onClick={() => setConfirmed(false)}
                    className="ml-auto text-xs text-slate-400 hover:text-slate-200 underline underline-offset-2"
                  >
                    Change
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}