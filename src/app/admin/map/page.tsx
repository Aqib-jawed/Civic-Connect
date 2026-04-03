'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useIssues } from '@/hooks/useIssues'
import { StatusBadge, CategoryBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatRelative } from '@/lib/utils'
import { X } from 'lucide-react'
import type { Issue, IssueStatus } from '@/types'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All',         value: ''            },
  { label: 'Submitted',   value: 'submitted'   },
  { label: 'Assigned',    value: 'assigned'    },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved',    value: 'resolved'    },
]

export default function AdminMapPage() {
  const router              = useRouter()
  const { issues, loading } = useIssues()
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected]         = useState<Issue | null>(null)

  const filtered = statusFilter === ''
    ? issues
    : issues.filter(i => i.status === statusFilter)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">Map Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Real-time civic issue visualization across all regions
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-slate-500 uppercase tracking-wide">Filter:</span>
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              statusFilter === f.value
                ? 'bg-sky-500 text-white'
                : 'border border-slate-700 text-slate-400 hover:border-sky-500/50'
            }`}
          >
            {f.label}
            <span className="ml-1 opacity-60">
              ({f.value === ''
                ? issues.length
                : issues.filter(i => i.status === f.value).length
              })
            </span>
          </button>
        ))}
      </div>

      <div className="relative">
        <MapView
          issues={filtered}
          height="calc(100vh - 260px)"
          onMarkerClick={setSelected}
        />

        {selected && (
          <div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-semibold text-slate-100 text-sm">{selected.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selected.address ?? '—'}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-slate-300 shrink-0"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <StatusBadge status={selected.status} />
              <CategoryBadge category={selected.category} />
              <span className="text-xs text-slate-500 ml-auto">
                {formatRelative(selected.created_at)}
              </span>
            </div>
            <Button
              size="sm"
              fullWidth
              onClick={() => router.push(`/admin/issues/${selected.id}`)}
            >
              View & Manage →
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        {loading ? 'Loading...' : `Showing ${filtered.length} issues on map`}
      </p>
    </div>
  )
}