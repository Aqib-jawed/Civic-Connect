"use client"
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
