import { clsx, type ClassValue } from "clsx"
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
