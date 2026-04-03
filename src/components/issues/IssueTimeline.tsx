import { CheckCircle, Circle, Clock } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { STATUS_CONFIG } from '@/constants/categories'
import type { StatusLog, IssueStatus } from '@/types'

const ORDERED_STATUSES: IssueStatus[] = [
  'submitted',
  'acknowledged',
  'assigned',
  'in_progress',
  'resolved',
]

interface IssueTimelineProps {
  currentStatus: IssueStatus
  logs:          StatusLog[]
}

export default function IssueTimeline({ currentStatus, logs }: IssueTimelineProps) {
  const getStatusDate = (status: IssueStatus) => {
    if (status === 'submitted') {
      return logs.find(l => l.from_status === null)?.created_at
    }
    return logs.find(l => l.to_status === status)?.created_at
  }

  const getStatusNote = (status: IssueStatus) => {
    return logs.find(l => l.to_status === status)?.note
  }

  const currentIndex = ORDERED_STATUSES.indexOf(currentStatus)

  return (
    <div className="flex flex-col">
      {ORDERED_STATUSES.map((status, index) => {
        const isDone    = index < currentIndex || status === currentStatus
        const isCurrent = status === currentStatus
        const isPending = index > currentIndex
        const config    = STATUS_CONFIG[status]
        const date      = getStatusDate(status)
        const note      = getStatusNote(status)

        return (
          <div key={status} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all"
                style={{
                  borderColor: isPending ? '#334155' : config.color,
                  background:  isPending ? 'transparent' : `${config.color}15`,
                }}
              >
                {isDone && !isCurrent && (
                  <CheckCircle size={14} style={{ color: config.color }} />
                )}
                {isCurrent && (
                  <Clock size={14} style={{ color: config.color }} />
                )}
                {isPending && (
                  <Circle size={14} className="text-slate-600" />
                )}
              </div>
              {index < ORDERED_STATUSES.length - 1 && (
                <div
                  className="mt-1 w-px flex-1"
                  style={{
                    background: index < currentIndex ? config.color : '#1e3058',
                    minHeight: '24px',
                  }}
                />
              )}
            </div>

            <div className="pb-2 pt-0.5">
              <p
                className="text-sm font-semibold"
                style={{ color: isPending ? '#475569' : config.color }}
              >
                {config.label}
              </p>
              {date && (
                <p className="mt-0.5 text-xs text-slate-500">{formatDateTime(date)}</p>
              )}
              {note && (
                <p className="mt-1 text-xs text-slate-400 bg-slate-800 rounded-lg px-3 py-2 border border-slate-700">
                  {note}
                </p>
              )}
              {isPending && (
                <p className="mt-0.5 text-xs text-slate-600">Pending</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}