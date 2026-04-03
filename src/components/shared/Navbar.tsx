'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import { notify } from '@/components/ui/Toast'

export default function Navbar() {
  const { profile } = useAuth()
  const router      = useRouter()
  const supabase    = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    notify.success('Signed out successfully')
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6">
        <Link
          href="/citizen/dashboard"
          className="font-heading text-lg font-bold text-sky-400"
        >
          CivicConnect
        </Link>

        <div className="flex items-center gap-3">
          <button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">
              {profile ? getInitials(profile.full_name) : <User size={12} />}
            </div>
            <span className="text-sm text-slate-300">
              {profile?.full_name ?? 'Loading...'}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}