'use client'

import { useIssues } from '@/hooks/useIssues'
import StatsCard from '@/components/admin/StatsCard'
import { CategoryBarChart, StatusPieChart, TrendLineChart } from '@/components/admin/AnalyticsChart'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCardSkeleton } from '@/components/ui/Skeleton'
import { CATEGORIES } from '@/constants/categories'
import { formatDate } from '@/lib/utils'
import { differenceInHours } from 'date-fns'

export default function AdminAnalyticsPage() {
  const { issues, loading } = useIssues()

  const resolved   = issues.filter(i => i.status === 'resolved')
  const pending    = issues.filter(i => i.status === 'submitted')
  const inProgress = issues.filter(i => i.status === 'in_progress')

  const avgResolutionHours = resolved.length > 0
    ? resolved.reduce((acc, i) => {
        if (!i.resolved_at) return acc
        return acc + differenceInHours(new Date(i.resolved_at), new Date(i.created_at))
      }, 0) / resolved.length
    : 0

  const resolutionRate = issues.length > 0
    ? Math.round((resolved.length / issues.length) * 100)
    : 0

  const categoryData = CATEGORIES.map(cat => ({
    label: cat.label,
    value: issues.filter(i => i.category === cat.value).length,
    color: cat.color,
  }))

  const statusData = [
    { name: 'Submitted',   value: pending.length                                           },
    { name: 'Assigned',    value: issues.filter(i => i.status === 'assigned').length       },
    { name: 'In Progress', value: inProgress.length                                        },
    { name: 'Resolved',    value: resolved.length                                          },
  ]

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    return {
      date:     formatDate(dateStr),
      issues:   issues.filter(issue => issue.created_at.startsWith(dateStr)).length,
      resolved: issues.filter(issue => issue.resolved_at?.startsWith(dateStr)).length,
    }
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">
          Region-wide performance metrics and trends
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard label="Total Issues"       value={issues.length}                          icon="📋" color="#00d4ff" />
            <StatsCard label="Resolution Rate"    value={`${resolutionRate}%`}                   icon="📈" color="#10b981" />
            <StatsCard label="Avg Resolution"     value={`${Math.round(avgResolutionHours)}h`}   icon="⏱️" color="#f59e0b" />
            <StatsCard label="Pending"            value={pending.length}                         icon="⏳" color="#ef4444" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Issues by Category</CardTitle></CardHeader>
          <CategoryBarChart data={categoryData} />
        </Card>

        <Card>
          <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
          <StatusPieChart data={statusData} />
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>7-Day Trend</CardTitle></CardHeader>
        <TrendLineChart data={last7Days} />
      </Card>

      <Card>
        <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
        <div className="flex flex-col gap-3">
          {categoryData.map((cat, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm text-slate-400 w-36 shrink-0">{cat.label}</span>
              <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width:      `${issues.length > 0 ? (cat.value / issues.length) * 100 : 0}%`,
                    background: CATEGORIES[i]?.color ?? '#64748b',
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-300 w-8 text-right">
                {cat.value}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
