'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useIssues } from '@/hooks/useIssues'
import { StatCard } from '@/components/ui/Card'
import IssueCard from '@/components/issues/IssueCard'
import { IssueCardSkeleton, StatCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

export default function CitizenDashboard() {
  const { profile }          = useAuth()
  const { issues, loading }  = useIssues(profile?.id)

  const stats = {
    total:       issues.length,
    submitted:   issues.filter(i => i.status === 'submitted').length,
    in_progress: issues.filter(i => ['acknowledged','assigned','in_progress'].includes(i.status)).length,
    resolved:    issues.filter(i => i.status === 'resolved').length,
  }

  const recent = issues.slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-100">
            Welcome back{profile ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Here&apos;s the status of your civic reports
          </p>
        </div>
        <Link href="/citizen/report">
          <Button>
            <PlusCircle size={15} />
            Report Issue
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Reported" value={stats.total}       icon="📋" color="#00d4ff" />
            <StatCard label="Submitted"       value={stats.submitted}   icon="⏳" color="#64748b" />
            <StatCard label="In Progress"     value={stats.in_progress} icon="⚙️" color="#f59e0b" />
            <StatCard label="Resolved"        value={stats.resolved}    icon="✅" color="#10b981" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
          <h2 className="font-heading text-base font-semibold text-slate-100 mb-4">
            📍 Your Reports Map
          </h2>
          <MapView
            issues={issues}
            height="260px"
          />
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-base font-semibold text-slate-100">
              🕐 Recent Activity
            </h2>
            <Link
              href="/citizen/issues"
              className="text-xs text-sky-400 hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <IssueCardSkeleton key={i} />)
              : recent.length > 0
                ? recent.map(issue => <IssueCard key={issue.id} issue={issue} />)
                : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-3xl mb-3">📭</p>
                    <p className="text-sm font-medium text-slate-300">No issues reported yet</p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      See something broken? Report it!
                    </p>
                    <Link href="/citizen/report">
                      <Button size="sm">+ Report First Issue</Button>
                    </Link>
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </div>
  )
}