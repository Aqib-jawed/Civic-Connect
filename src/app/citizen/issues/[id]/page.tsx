'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useIssue } from '@/hooks/useIssues'
import { StatusBadge, CategoryBadge, SeverityBadge } from '@/components/ui/Badge'
import IssueTimeline from '@/components/issues/IssueTimeline'
import { Skeleton } from '@/components/ui/Skeleton'
import { getCategoryConfig } from '@/constants/categories'
import { formatDateTime, formatCoords } from '@/lib/utils'
import { ArrowLeft, MapPin, Clock, User } from 'lucide-react'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

export default function CitizenIssueDetailPage() {
  const { id }              = useParams<{ id: string }>()
  const { issue, loading }  = useIssue(id)

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
        <Link href="/citizen/issues" className="mt-4 text-sm text-sky-400 hover:underline">
          ← Back to Issues
        </Link>
      </div>
    )
  }

  const config = getCategoryConfig(issue.category)

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/citizen/issues"
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-sm text-slate-400 truncate">{issue.title}</span>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-100">{issue.title}</h1>
          <p className="mt-1 text-xs text-slate-500 font-mono">
            #{issue.id.slice(0, 8).toUpperCase()} · Submitted {formatDateTime(issue.created_at)}
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
                alt="Issue photo"
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
            <h2 className="font-heading text-base font-semibold text-slate-100 mb-4">
              Issue Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 mb-1">Category</p>
                <CategoryBadge category={issue.category} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Severity</p>
                <SeverityBadge severity={issue.severity} />
              </div>
              {issue.description && (
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Description</p>
                  <p className="text-slate-300 leading-relaxed">{issue.description}</p>
                </div>
              )}
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
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
            <h2 className="font-heading text-base font-semibold text-slate-100 mb-4">
              📍 Issue Location
            </h2>
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
            <h2 className="font-heading text-base font-semibold text-slate-100 mb-5">
              Resolution Timeline
            </h2>
            <IssueTimeline
              currentStatus={issue.status}
              logs={(issue as any).issue_status_logs ?? []}
            />
          </div>

          {issue.assigned_to && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
              <h2 className="font-heading text-sm font-semibold text-slate-100 mb-3">
                Assigned Team
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20">
                  <User size={14} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Field Team</p>
                  <p className="text-xs text-slate-500">Working on resolution</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}