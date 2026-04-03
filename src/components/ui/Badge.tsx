"use client"
import { cn } from "@/lib/utils"
import { getCategoryConfig, getSeverityConfig, STATUS_CONFIG } from "@/constants/categories"
import type { IssueStatus, IssueCategory, IssueSeverity } from "@/types"

interface BadgeProps { className?: string; children: React.ReactNode; style?: React.CSSProperties }

export function Badge({ className, children, style }: BadgeProps) {
  return <span style={style} className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}>{children}</span>
}

export function StatusBadge({ status }: { status: IssueStatus }) {
  const cfg = STATUS_CONFIG[status]
  return <Badge style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</Badge>
}

export function CategoryBadge({ category }: { category: IssueCategory }) {
  const cfg = getCategoryConfig(category)
  return <Badge style={{ background: cfg.color + "22", color: cfg.color }}>{cfg.icon} {cfg.label}</Badge>
}

export function SeverityBadge({ severity }: { severity: IssueSeverity }) {
  const cfg = getSeverityConfig(severity)
  return <Badge style={{ background: cfg.color + "22", color: cfg.color }}>{cfg.label}</Badge>
}
