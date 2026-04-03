"use client"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ className, children, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-700/50 bg-slate-800/30 p-5",
        hover && "cursor-pointer transition-all duration-200 hover:border-slate-600 hover:bg-slate-800/50 hover:shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props}>{children}</div>
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold text-slate-100", className)} {...props}>{children}</h3>
}

interface StatCardProps { label: string; value: string | number; icon?: string; color?: string }
export function StatCard({ label, value, icon, color = "#00d4ff" }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 p-5">
      <div className="absolute left-0 top-0 h-0.5 w-full" style={{ background: color }} />
      {icon && <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: color + "22" }}>{icon}</div>}
      <div className="text-3xl font-bold" style={{ color }}>{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  )
}
