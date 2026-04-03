'use client'

import { useRouter } from 'next/navigation'
import { MapPin, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatusBadge, CategoryBadge, SeverityBadge } from '@/components/ui/Badge'
import { getCategoryConfig } from '@/constants/categories'
import { formatRelative } from '@/lib/utils'
import type { Issue } from '@/types'

interface IssueCardProps {
  issue:   Issue
  role?:   'citizen' | 'admin'
}

export default function IssueCard({ issue, role = 'citizen' }: IssueCardProps) {
  const router = useRouter()
  const config = getCategoryConfig(issue.category)
  const href   = role === 'admin'
    ? `/admin/issues/${issue.id}`
    : `/citizen/issues/${issue.id}`

  return (
    <Card hover onClick={() => router.push(href)}>
      <div className="flex items-start gap-4">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ background: `${config.color}15` }}
        >
          {config.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-slate-100 truncate">
              {issue.title}
            </h3>
            <StatusBadge status={issue.status} />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <CategoryBadge category={issue.category} />
            <SeverityBadge severity={issue.severity} />
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            {issue.address && (
              <span className="flex items-center gap-1 truncate">
                <MapPin size={11} />
                {issue.address}
              </span>
            )}
            <span className="flex items-center gap-1 shrink-0">
              <Clock size={11} />
              {formatRelative(issue.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}