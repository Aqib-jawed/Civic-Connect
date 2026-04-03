export const MAP_CONFIG = {
  defaultCenter: {
    lat: 12.9716,
    lng: 77.5946,
  },
  defaultZoom: 13,
  minZoom: 5,
  maxZoom: 19,
  tileUrl: process.env.NEXT_PUBLIC_MAP_TILE_URL ||
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ||
    '© OpenStreetMap contributors',
}

export const PIN_COLORS: Record<string, string> = {
  submitted:    '#64748b',
  acknowledged: '#0ea5e9',
  assigned:     '#a78bfa',
  in_progress:  '#f59e0b',
  resolved:     '#10b981',
  rejected:     '#ef4444',
}