'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import {
  LayoutDashboard,
  PlusCircle,
  List,
  Map,
  User,
  LogOut,
  BarChart2,
  Users,
  Globe,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavItem {
  label: string
  href:  string
  icon:  React.ReactNode
}

const citizenNav: NavItem[] = [
  { label: 'Dashboard',    href: '/citizen/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Report Issue', href: '/citizen/report',    icon: <PlusCircle size={16} />      },
  { label: 'My Issues',    href: '/citizen/issues',    icon: <List size={16} />             },
  { label: 'Map View',     href: '/citizen/map',       icon: <Map size={16} />              },
  { label: 'Profile',      href: '/citizen/profile',   icon: <User size={16} />             },
]

const adminNav: NavItem[] = [
  { label: 'Dashboard',  href: '/admin/dashboard',  icon: <LayoutDashboard size={16} /> },
  { label: 'Map View',   href: '/admin/map',         icon: <Globe size={16} />           },
  { label: 'All Issues', href: '/admin/issues',      icon: <List size={16} />            },
  { label: 'Analytics',  href: '/admin/analytics',   icon: <BarChart2 size={16} />       },
  { label: 'Teams',      href: '/admin/teams',        icon: <Users size={16} />           },
]

interface SidebarProps {
  role?: 'citizen' | 'admin'
}

export default function Sidebar({ role = 'citizen' }: SidebarProps) {
  const pathname  = usePathname()
  const { profile } = useAuth()
  const router    = useRouter()
  const supabase  = createClient()
  const navItems  = role === 'admin' ? adminNav : citizenNav

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push(role === 'admin' ? '/admin/login' : '/login')
  }

  return (
    <aside className="flex h-screen w-60 flex-shrink-0 flex-col border-r border-slate-700/50 bg-slate-900">
      <div className="border-b border-slate-700/50 px-5 py-4">
        <span className="font-heading text-lg font-bold text-sky-400">
          CivicConnect
        </span>
        {role === 'admin' && (
          <p className="mt-0.5 text-[10px] uppercase tracking-widest text-slate-500">
            Admin Panel
          </p>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150',
                pathname === item.href
                  ? 'bg-sky-500/10 text-sky-400 font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-700/50 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">
            {profile ? getInitials(profile.full_name) : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-slate-200">
              {profile?.full_name ?? 'Loading...'}
            </p>
            <p className="text-xs text-slate-500 capitalize">{role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-md p-1.5 text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}