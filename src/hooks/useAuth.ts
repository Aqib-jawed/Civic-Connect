'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'
import type { User } from '@supabase/supabase-js'

// Get singleton client once — not inside the hook
const supabase = createClient()

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

async function fetchOrCreateProfile(user: User): Promise<Profile | null> {
  // Try to fetch existing profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) return profile as Profile

  // Profile doesn't exist (trigger may not have fired) — create it via API
  if (error?.code === 'PGRST116' || !profile) {
    try {
      const fullName =
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'User'

      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _upsert_profile_only: true,
          userId:    user.id,
          email:     user.email,
          full_name: fullName,
          phone:     user.user_metadata?.phone ?? null,
        }),
      })

      // Re-fetch after upsert
      const { data: retry } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return (retry as Profile) ?? null
    } catch {
      return null
    }
  }

  return null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const profile = await fetchOrCreateProfile(user)
        setState({ user, profile, loading: false })
      } else {
        setState({ user: null, profile: null, loading: false })
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          const profile = await fetchOrCreateProfile(session.user)
          setState({ user: session.user, profile, loading: false })
        } else {
          setState({ user: null, profile: null, loading: false })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { ...state, signOut }
}
