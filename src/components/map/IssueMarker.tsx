import { PIN_COLORS } from '@/constants/maps'
import { getCategoryConfig } from '@/constants/categories'
import type { IssueStatus, IssueCategory } from '@/types'

interface IssueMarkerHTMLProps {
  status:   IssueStatus
  category: IssueCategory
  size?:    'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { outer: 12, inner: 8  },
  md: { outer: 16, inner: 10 },
  lg: { outer: 22, inner: 14 },
}

export function getMarkerHTML({ status, category, size = 'md' }: IssueMarkerHTMLProps): string {
  const color  = PIN_COLORS[status] ?? '#64748b'
  const config = getCategoryConfig(category)
  const s      = sizes[size]

  return `
    <div style="position:relative; display:flex; align-items:center; justify-content:center;">
      <div style="
        width:${s.outer}px; height:${s.outer}px;
        border-radius:50%;
        background:${color};
        border:2px solid white;
        box-shadow:0 0 8px ${color}80;
        display:flex; align-items:center; justify-content:center;
        font-size:${s.inner}px;
      ">
      </div>
    </div>
  `
}

export function IssueMarkerIcon({ status, category }: IssueMarkerHTMLProps) {
  const color  = PIN_COLORS[status] ?? '#64748b'
  const config = getCategoryConfig(category)

  return (
    <div
      className="flex items-center justify-center rounded-full border-2 border-white"
      style={{
        width:      20,
        height:     20,
        background: color,
        boxShadow:  `0 0 8px ${color}80`,
      }}
    >
      <span style={{ fontSize: 10 }}>{config.icon}</span>
    </div>
  )
}