import type { Database, IssueCategory, IssueStatus, IssueSeverity } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Issue = Database['public']['Tables']['issues']['Row']
export type Region = Database['public']['Tables']['regions']['Row']
export type StatusLog = Database['public']['Tables']['issue_status_logs']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

export type { IssueCategory, IssueStatus, IssueSeverity }

export interface GPSLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
  state?: string
  city?: string
  pincode?: string
}

export interface IssueFormData {
  category: IssueCategory
  title: string
  description?: string
  severity: IssueSeverity
  latitude: number
  longitude: number
  address?: string
  images: File[]
  is_anonymous: boolean
}

export interface IssueWithProfile extends Issue {
  profiles: Pick<Profile, 'full_name' | 'phone' | 'avatar_url'>
  regions: Pick<Region, 'name' | 'city'> | null
}

export interface DashboardStats {
  total: number
  submitted: number
  in_progress: number
  resolved: number
}

export interface AdminStats extends DashboardStats {
  acknowledged: number
  assigned: number
  rejected: number
  avg_resolution_hours: number
}