import os

files = {}

files['src/lib/supabase/client.ts'] = '''import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
'''

files['src/lib/supabase/server.ts'] = '''import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createServerClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
'''

files['src/components/ui/Button.tsx'] = '''"use client"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "outline"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  fullWidth?: boolean
}

export function Button({ variant = "primary", size = "md", loading, fullWidth, className, children, disabled, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
  const variants = {
    primary:   "bg-sky-500 text-white hover:bg-sky-400 shadow-sm",
    secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600",
    ghost:     "text-slate-400 hover:text-slate-200 hover:bg-slate-800",
    danger:    "bg-red-500 text-white hover:bg-red-400",
    success:   "bg-emerald-500 text-white hover:bg-emerald-400",
    outline:   "border border-slate-600 text-slate-300 hover:border-sky-500 hover:text-sky-400",
  }
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  }
  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}
'''

files['src/components/ui/Input.tsx'] = '''"use client"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-slate-300">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all",
          error ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
)
Input.displayName = "Input"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-slate-300">{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all resize-none",
          error ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
)
Textarea.displayName = "Textarea"
'''

files['src/components/ui/Toast.tsx'] = '''"use client"
import { Toaster, toast } from "react-hot-toast"

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1e293b",
          color: "#e2e8f0",
          border: "1px solid #334155",
          borderRadius: "12px",
          fontSize: "13px",
        },
      }}
    />
  )
}

export const notify = {
  success: (msg: string) => toast.success(msg),
  error:   (msg: string) => toast.error(msg),
  info:    (msg: string) => toast(msg),
  warning: (msg: string) => toast(msg),
}
'''

files['src/components/ui/Badge.tsx'] = '''"use client"
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
'''

files['src/components/ui/Card.tsx'] = '''"use client"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-slate-700/50 bg-slate-800/30 p-5", className)} {...props}>{children}</div>
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
'''

files['src/components/ui/Skeleton.tsx'] = '''"use client"
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
'''

files['src/components/ui/Modal.tsx'] = '''"use client"
import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    if (open) document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl", sizes[size])}>
        {title && (
          <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-100">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200"><X size={16} /></button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
'''

files['src/components/ui/Select.tsx'] = '''"use client"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { forwardRef } from "react"
import type { SelectHTMLAttributes } from "react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-slate-300">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-lg border bg-slate-800 px-3 py-2 pr-8 text-sm text-slate-200 outline-none transition-all cursor-pointer",
            error ? "border-red-500" : "border-slate-700 focus:border-sky-500",
            className
          )}
          {...props}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
)
Select.displayName = "Select"
'''

files['src/lib/utils.ts'] = '''import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return format(new Date(date), "MMM d, yyyy")
}

export function formatDateTime(date: string) {
  return format(new Date(date), "MMM d, yyyy h:mm a")
}

export function formatRelative(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatCoords(lat: number, lng: number) {
  return lat.toFixed(6) + ", " + lng.toFixed(6)
}

export function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

export function bytesToMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(2) + " MB"
}

export function generateIssueId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}
'''

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    size = os.path.getsize(path)
    print(f'Written: {path} ({size} bytes)')

print('\nAll files written successfully!')