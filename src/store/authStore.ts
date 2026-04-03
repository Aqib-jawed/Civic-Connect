import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile } from '@/types'
import type { User } from '@supabase/supabase-js'

interface AuthStore {
  user:       User | null
  profile:    Profile | null
  isLoading:  boolean
  setUser:    (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  clear:      () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user:      null,
      profile:   null,
      isLoading: true,

      setUser:    (user)    => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      clear: () => set({ user: null, profile: null, isLoading: false }),
    }),
    {
      name:    'civic-connect-auth',
      partialize: (state) => ({
        profile: state.profile,
      }),
    }
  )
)