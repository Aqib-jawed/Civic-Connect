"use client"
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
