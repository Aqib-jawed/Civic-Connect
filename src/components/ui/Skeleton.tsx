"use client"
import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-slate-700/50", className)} />
}

export function IssueCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 flex gap-3">
      <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5">
      <Skeleton className="h-10 w-10 rounded-xl mb-3" />
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  )
}
