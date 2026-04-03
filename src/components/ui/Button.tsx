"use client"
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
