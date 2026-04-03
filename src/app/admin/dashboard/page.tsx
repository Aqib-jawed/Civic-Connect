'use client'

import { useIssues } from '@/hooks/useIssues'
import StatsCard from '@/components/admin/StatsCard'
import IssueTable from '@/components/admin/IssuesTable'
import { CategoryBarChart, StatusPieChart } from '@/components/admin/AnalyticsChart'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCardSkeleton } from '@/components/ui/Skeleton'
import { CATEGORIES } from '@/constants/categories'

export default function AdminDashboardPage() {
  const { issues, loading } = useIssues()

  const stats = {
    total:       issues.length,
    submitted:   issues.filter(i => i.status === 'submitted').length,
    in_progress: issues.filter(i => i.status === 'in_progress').length,
    resolved:    issues.filter(i => i.status === 'resolved').length,
    assigned:    issues.filter(i => i.status === 'assigned').length,
  }

  const categoryData = CATEGORIES.map(cat => ({
    label: cat.label,
    value: issues.filter(i => i.category === cat.value).length,
    color: cat.color,
  }))

  const statusData = [
    { name: 'Submitted',   value: stats.submitted   },
    { name: 'Assigned',    value: stats.assigned     },
    { name: 'In Progress', value: stats.in_progress  },
    { name: 'Resolved',    value: stats.resolved     },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Region-wide civic issue overview
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard label="Total Issues"   value={stats.total}       icon="📋" color="#00d4ff" trend={12}  />
            <StatsCard label="Pending"        value={stats.submitted}   icon="⏳" color="#ef4444" trend={-8}  />
            <StatsCard label="In Progress"    value={stats.in_progress} icon="⚙️" color="#f59e0b" trend={3}   />
            <StatsCard label="Resolved"       value={stats.resolved}    icon="✅" color="#10b981" trend={22}  />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
          </CardHeader>
          <CategoryBarChart data={categoryData} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <StatusPieChart data={statusData} />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
        </CardHeader>
        <IssueTable issues={issues.slice(0, 10)} loading={loading} />
      </Card>
    </div>
  )
}