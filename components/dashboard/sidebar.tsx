'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  List,
  Heart,
  Settings,
  LogOut,
  Plus,
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Listings', href: '/dashboard/listings', icon: List },
  { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="sticky top-0 hidden h-screen w-64 flex-col border-r border-border/40 bg-muted/10 pb-10 pt-24 lg:flex">
      <div className="mb-8 px-6">
        <Link
          href="/post"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
        >
          <Plus className="h-4 w-4" />
          Post New Ad
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto px-4">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
