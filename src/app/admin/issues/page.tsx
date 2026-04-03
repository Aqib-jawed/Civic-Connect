'use client'

import { useIssues } from '@/hooks/useIssues'
import IssueTable from '@/components/admin/IssuesTable'

export default function AdminIssuesPage() {
  const { issues, loading } = useIssues()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">All Issues</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage and resolve civic issues across all regions
        </p>
      </div>
      <IssueTable issues={issues} loading={loading} />
    </div>
  )
}