'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useIssues } from '@/hooks/useIssues'
import IssueCard from '@/components/issues/IssueCard'
import { IssueCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import type { IssueStatus } from '@/types'

const TABS: { label: string; value: string }[] = [
  { label: 'All',         value: ''            },
  { label: 'Submitted',   value: 'submitted'   },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved',    value: 'resolved'    },
]

export default function CitizenIssuesPage() {
  const { profile }         = useAuth()
  const { issues, loading } = useIssues(profile?.id)
  const [activeTab, setActiveTab] = useState('')

  const filtered = activeTab === ''
    ? issues
    : issues.filter(i => {
        if (activeTab === 'in_progress') {
          return ['acknowledged', 'assigned', 'in_progress'].includes(i.status)
        }
        return i.status === activeTab
      })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-100">My Issues</h1>
          <p className="mt-1 text-sm text-slate-400">
            All civic issues you have reported
          </p>
        </div>
        <Link href="/citizen/report">
          <Button>+ New Report</Button>
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeTab === tab.value
                ? 'bg-sky-500 text-white'
                : 'border border-slate-700 text-slate-400 hover:border-sky-500/50 hover:text-slate-200'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">
              ({tab.value === ''
                ? issues.length
                : tab.value === 'in_progress'
                  ? issues.filter(i => ['acknowledged','assigned','in_progress'].includes(i.status)).length
                  : issues.filter(i => i.status === tab.value).length
              })
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <IssueCardSkeleton key={i} />)
          : filtered.length > 0
            ? filtered.map(issue => <IssueCard key={issue.id} issue={issue} />)
            : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-16 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm font-medium text-slate-300">No issues found</p>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  {activeTab ? 'No issues in this category' : 'You have not reported any issues yet'}
                </p>
                <Link href="/citizen/report">
                  <Button size="sm">+ Report an Issue</Button>
                </Link>
              </div>
            )
        }
      </div>
    </div>
  )
}