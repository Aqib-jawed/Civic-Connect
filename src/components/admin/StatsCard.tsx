import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsCardProps {
  label:  string
  value:  string | number
  icon?:  string
  color?: string
  trend?: number
  sub?:   string
}

export default function StatsCard({ label, value, icon, color = '#00d4ff', trend, sub }: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 p-5">
      <div className="absolute left-0 top-0 h-0.5 w-full" style={{ background: color }} />
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: `${color}15` }}>
            {icon}
          </div>
        )}
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
            trend > 0  && 'bg-emerald-500/15 text-emerald-400',
            trend < 0  && 'bg-red-500/15 text-red-400',
            trend === 0 && 'bg-slate-700 text-slate-400',
          )}>
            {trend > 0  && <TrendingUp size={10} />}
            {trend < 0  && <TrendingDown size={10} />}
            {trend === 0 && <Minus size={10} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="font-heading text-3xl font-bold" style={{ color }}>{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">{label}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
    </div>
  )
}