export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          role: 'citizen' | 'admin' | 'field_agent'
          region_id: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          role?: 'citizen' | 'admin' | 'field_agent'
          region_id?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string
          phone?: string | null
          role?: 'citizen' | 'admin' | 'field_agent'
          region_id?: string | null
          avatar_url?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          reported_by: string
          category: IssueCategory
          title: string
          description: string | null
          latitude: number
          longitude: number
          address: string | null
          region_id: string | null
          images: string[]
          status: IssueStatus
          assigned_to: string | null
          assigned_at: string | null
          resolution_note: string | null
          resolution_images: string[]
          resolved_at: string | null
          severity: IssueSeverity
          upvotes: number
          is_anonymous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reported_by: string
          category: IssueCategory
          title: string
          description?: string | null
          latitude: number
          longitude: number
          address?: string | null
          region_id?: string | null
          images?: string[]
          status?: IssueStatus
          assigned_to?: string | null
          severity?: IssueSeverity
          is_anonymous?: boolean
        }
        Update: {
          status?: IssueStatus
          assigned_to?: string | null
          assigned_at?: string | null
          resolution_note?: string | null
          resolution_images?: string[]
          resolved_at?: string | null
          severity?: IssueSeverity
          updated_at?: string
        }
      }
      regions: {
        Row: {
          id: string
          name: string
          city: string
          state: string
          assigned_admin: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          city: string
          state: string
          assigned_admin?: string | null
        }
        Update: {
          name?: string
          city?: string
          state?: string
          assigned_admin?: string | null
        }
      }
      issue_status_logs: {
        Row: {
          id: string
          issue_id: string
          changed_by: string
          from_status: string | null
          to_status: string
          note: string | null
          images: string[]
          created_at: string
        }
        Insert: {
          issue_id: string
          changed_by: string
          from_status?: string | null
          to_status: string
          note?: string | null
          images?: string[]
        }
        Update: never
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          issue_id: string | null
          type: string
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          issue_id?: string | null
          type: string
          title: string
          message: string
          is_read?: boolean
        }
        Update: {
          is_read?: boolean
        }
      }
    }
  }
}

export type IssueCategory =
  | 'pothole'
  | 'drainage_overflow'
  | 'water_leakage'
  | 'garbage'
  | 'streetlight_failure'
  | 'road_damage'
  | 'tree_fallen'
  | 'other'

export type IssueStatus =
  | 'submitted'
  | 'acknowledged'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected'

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical'
export type UserRole = 'citizen' | 'admin' | 'field_agent'