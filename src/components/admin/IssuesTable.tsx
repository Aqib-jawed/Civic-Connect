'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StatusBadge, CategoryBadge, SeverityBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { getCategoryConfig } from '@/constants/categories'
import { ChevronUp, ChevronDown, Eye } from 'lucide-react'
import type { Issue } from '@/types'

interface IssueTableProps {
  issues:   Issue[]
  loading?: boolean
}

type SortKey = 'created_at' | 'status' | 'severity' | 'category'
type SortDir = 'asc' | 'desc'

const STATUS_OPTIONS = [
  { value: '',             label: 'All Status'    },
  { value: 'submitted',    label: 'Submitted'     },
  { value: 'acknowledged', label: 'Acknowledged'  },
  { value: 'assigned',     label: 'Assigned'      },
  { value: 'in_progress',  label: 'In Progress'   },
  { value: 'resolved',     label: 'Resolved'      },
  { value: 'rejected',     label: 'Rejected'      },
]

const CATEGORY_OPTIONS = [
  { value: '',                    label: 'All Categories'     },
  { value: 'pothole',             label: 'Pothole'            },
  { value: 'drainage_overflow',   label: 'Drainage Overflow'  },
  { value: 'water_leakage',       label: 'Water Leakage'      },
  { value: 'garbage',             label: 'Garbage'            },
  { value: 'streetlight_failure', label: 'Streetlight'        },
  { value: 'road_damage',         label: 'Road Damage'        },
  { value: 'other',               label: 'Other'              },
]

export default function IssueTable({ issues, loading }: IssueTableProps) {
  const router = useRouter()
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [catFilter,    setCatFilter]    = useState('')
  const [sortKey,      setSortKey]      = useState<SortKey>('created_at')
  const [sortDir,      setSortDir]      = useState<SortDir>('desc')

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = issues
    .filter(i => {
      const matchSearch = search === '' ||
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.address?.toLowerCase().includes(search.toLowerCase()) ||
        i.id.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === '' || i.status === statusFilter
      const matchCat    = catFilter    === '' || i.category === catFilter
      return matchSearch && matchStatus && matchCat
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'created_at') {
        return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      }
      return dir * String(a[sortKey]).localeCompare(String(b[sortKey]))
    })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-slate-600" />
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-sky-400" />
      : <ChevronDown size={12} className="text-sky-400" />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍  Search by title, location, ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 outline-none cursor-pointer"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>
          ))}
        </select>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 outline-none cursor-pointer"
        >
          {CATEGORY_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-800/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Issue
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 cursor-pointer hover:text-slate-200"
                onClick={() => toggleSort('category')}
              >
                <span className="flex items-center gap-1">Category <SortIcon col="category" /></span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Location
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 cursor-pointer hover:text-slate-200"
                onClick={() => toggleSort('status')}
              >
                <span className="flex items-center gap-1">Status <SortIcon col="status" /></span>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 cursor-pointer hover:text-slate-200"
                onClick={() => toggleSort('severity')}
              >
                <span className="flex items-center gap-1">Severity <SortIcon col="severity" /></span>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 cursor-pointer hover:text-slate-200"
                onClick={() => toggleSort('created_at')}
              >
                <span className="flex items-center gap-1">Date <SortIcon col="created_at" /></span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  Loading issues...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  No issues found
                </td>
              </tr>
            )}
            {!loading && filtered.map(issue => {
              const config = getCategoryConfig(issue.category)
              return (
                <tr
                  key={issue.id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-base"
                        style={{ background: `${config.color}15` }}
                      >
                        {config.icon}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200 truncate max-w-[180px]">
                          {issue.title}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">
                          #{issue.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <CategoryBadge category={issue.category} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[140px] truncate">
                    {issue.address ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={issue.severity} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDate(issue.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/admin/issues/${issue.id}`)}
                    >
                      <Eye size={13} /> View
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        Showing {filtered.length} of {issues.length} issues
      </p>
    </div>
  )
}