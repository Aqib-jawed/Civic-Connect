'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Issue, IssueStatus } from '@/types'

// Use singleton client
const supabase = createClient()

export function useIssues(userId?: string) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIssues = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('issues')
      .select('*, profiles(full_name, phone, avatar_url)')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('reported_by', userId)
    }

    const { data, error } = await query

    if (error) {
      setError(error.message)
    } else {
      setIssues((data as unknown as Issue[]) ?? [])
    }

    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchIssues()

    const channel = supabase
      .channel(`issues-changes-${userId ?? 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'issues',
          ...(userId ? { filter: `reported_by=eq.${userId}` } : {}),
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setIssues(prev => [payload.new as Issue, ...prev])
          }
          if (payload.eventType === 'UPDATE') {
            setIssues(prev =>
              prev.map(i => i.id === payload.new.id ? { ...i, ...payload.new } : i)
            )
          }
          if (payload.eventType === 'DELETE') {
            setIssues(prev => prev.filter(i => i.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, fetchIssues])

  return { issues, loading, error, refetch: fetchIssues }
}

export function useIssue(id: string) {
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIssue = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          profiles(full_name, phone, avatar_url),
          issue_status_logs(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setIssue(data as unknown as Issue)
      }

      setLoading(false)
    }

    fetchIssue()
  }, [id])

  const updateStatus = async (status: IssueStatus, note?: string) => {
    // Step 1 — get current status
    const { data: currentData } = await supabase
      .from('issues')
      .select('status')
      .eq('id', id)
      .single()

    const previousStatus: string = (currentData as any)?.status ?? null

    // Step 2 — update issue status
    const { error: updateError } = await (supabase as any)
      .from('issues')
      .update({ status: status })
      .eq('id', id)


    if (updateError) {
      return { error: updateError }
    }

    // Step 3 — get current user
    const { data: userData } = await supabase.auth.getUser()
    const currentUserId = userData.user?.id ?? ''

    // Step 4 — insert status log
    if (currentUserId) {
      const logPayload = {
        issue_id: id,
        changed_by: currentUserId,
        from_status: previousStatus,
        to_status: status as string,
        note: note ?? null,
      }

      await (supabase as any)
        .from('issue_status_logs')
        .insert(logPayload)
    }

    // Step 5 — refresh issue locally
    const { data: updated } = await supabase
      .from('issues')
      .select(`
        *,
        profiles(full_name, phone, avatar_url),
        issue_status_logs(*)
      `)
      .eq('id', id)
      .single()

    if (updated) {
      setIssue(updated as unknown as Issue)
    }

    return { error: null }
  }

  return { issue, loading, error, updateStatus }
}