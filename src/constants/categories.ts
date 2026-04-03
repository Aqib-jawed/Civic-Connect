import type { IssueCategory, IssueSeverity } from '@/types'

export const CATEGORIES: {
  value: IssueCategory
  label: string
  icon: string
  color: string
}[] = [
  { value: 'pothole',            label: 'Pothole',            icon: '🕳️', color: '#ef4444' },
  { value: 'drainage_overflow',  label: 'Drainage Overflow',  icon: '💧', color: '#3b82f6' },
  { value: 'water_leakage',      label: 'Water Leakage',      icon: '🚰', color: '#0ea5e9' },
  { value: 'garbage',            label: 'Garbage',            icon: '🗑️', color: '#f59e0b' },
  { value: 'streetlight_failure',label: 'Streetlight Failure',icon: '💡', color: '#a78bfa' },
  { value: 'road_damage',        label: 'Road Damage',        icon: '🚧', color: '#f97316' },
  { value: 'tree_fallen',        label: 'Tree Fallen',        icon: '🌳', color: '#22c55e' },
  { value: 'other',              label: 'Other',              icon: '🔧', color: '#64748b' },
]

export const SEVERITIES: {
  value: IssueSeverity
  label: string
  color: string
  bg: string
}[] = [
  { value: 'low',      label: 'Low',      color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  { value: 'medium',   label: 'Medium',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  { value: 'high',     label: 'High',     color: '#f97316', bg: 'rgba(249,115,22,0.1)'  },
  { value: 'critical', label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
]

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted:    { label: 'Submitted',    color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
  acknowledged: { label: 'Acknowledged', color: '#0ea5e9', bg: 'rgba(14,165,233,0.15)'  },
  assigned:     { label: 'Assigned',     color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  in_progress:  { label: 'In Progress',  color: '#f59e0b', bg: 'rgba(245,158,11,0.15)'  },
  resolved:     { label: 'Resolved',     color: '#10b981', bg: 'rgba(16,185,129,0.15)'  },
  rejected:     { label: 'Rejected',     color: '#ef4444', bg: 'rgba(239,68,68,0.15)'   },
}

export const getCategoryConfig = (value: IssueCategory) =>
  CATEGORIES.find(c => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1]

export const getSeverityConfig = (value: IssueSeverity) =>
  SEVERITIES.find(s => s.value === value) ?? SEVERITIES[1]