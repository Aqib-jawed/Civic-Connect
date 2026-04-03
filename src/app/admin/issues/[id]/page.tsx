'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useIssue } from '@/hooks/useIssues'
import { useAuth } from '@/hooks/useAuth'
import { StatusBadge, CategoryBadge, SeverityBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import IssueTimeline from '@/components/issues/IssueTimeline'
import { Skeleton } from '@/components/ui/Skeleton'
import { notify } from '@/components/ui/Toast'
import { STATUS_CONFIG } from '@/constants/categories'
import { getCategoryConfig } from '@/constants/categories'
import { formatDateTime, formatCoords } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import type { IssueStatus } from '@/types'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

const STATUSES: IssueStatus[] = [
  'submitted', 'acknowledged', 'assigned', 'in_progress', 'resolved', 'rejected'
]

export default function AdminIssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { issue, loading, updateStatus } = useIssue(id)
  const { profile } = useAuth()


  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | ''>('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      notify.error('Please select a status')
      return
    }

    setSaving(true)
    const { error } = await updateStatus(selectedStatus, note)

    if (error) {
      notify.error('Failed to update status')
    } else {
      notify.success('Status updated successfully')
      setNote('')
      setSelectedStatus('')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-4xl mb-3">❌</p>
        <p className="text-slate-300 font-medium">Issue not found</p>
        <Link href="/admin/issues" className="mt-4 text-sm text-sky-400 hover:underline">
          ← Back to Issues
        </Link>
      </div>
    )
  }

  const config = getCategoryConfig(issue.category)

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/issues"
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Issues
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-100">{issue.title}</h1>
          <p className="mt-1 text-xs text-slate-500 font-mono">
            #{issue.id.slice(0, 8).toUpperCase()} · {formatDateTime(issue.created_at)}
          </p>
        </div>
        <StatusBadge status={issue.status} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {issue.images.length > 0 && (
            <div className="rounded-xl border border-slate-700/50 overflow-hidden">
              <img
                src={issue.images[0]}
                alt="Issue"
                className="w-full h-64 object-cover"
              />
              {issue.images.length > 1 && (
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800">
                  {issue.images.slice(1).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Photo ${i + 2}`}
                      className="h-16 w-full object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
            <h2 className="font-heading text-base font-semibold mb-4">Issue Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 mb-1">Category</p>
                <CategoryBadge category={issue.category} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Severity</p>
                <SeverityBadge severity={issue.severity} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">GPS Coordinates</p>
                <p className="text-xs font-mono text-emerald-400">
                  {formatCoords(issue.latitude, issue.longitude)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Address</p>
                <p className="text-slate-300 text-xs">{issue.address ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Upvotes</p>
                <p className="text-slate-300">{issue.upvotes} citizens</p>
              </div>
              {issue.description && (
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Description</p>
                  <p className="text-slate-300 leading-relaxed text-xs">{issue.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
            <h2 className="font-heading text-base font-semibold mb-4">📍 Location</h2>
            <MapView
              center={[issue.latitude, issue.longitude]}
              zoom={16}
              issues={[issue]}
              height="220px"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
            <h2 className="font-heading text-base font-semibold mb-4">⚡ Update Status</h2>
            <div className="flex flex-col gap-2 mb-4">
              {STATUSES.map(status => {
                const cfg = STATUS_CONFIG[status]
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`w-full rounded-lg border-2 px-3 py-2.5 text-left text-sm font-medium transition-all ${selectedStatus === status
                      ? 'border-current'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    style={selectedStatus === status
                      ? { borderColor: cfg.color, color: cfg.color, background: cfg.bg }
                      : {}
                    }
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
            <Textarea
              label="Admin Note"
              placeholder="Add an update note for the citizen..."
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            <Button
              fullWidth
              className="mt-3"
              loading={saving}
              onClick={handleStatusUpdate}
              disabled={!selectedStatus}
            >
              Save Status Update
            </Button>
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
            <h2 className="font-heading text-base font-semibold mb-5">Timeline</h2>
            <IssueTimeline
              currentStatus={issue.status}
              logs={(issue as any).issue_status_logs ?? []}
            />
          </div>
        </div>
      </div>
    </div>
  )
}