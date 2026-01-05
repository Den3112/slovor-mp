'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Heart, Settings, Package, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    {
      href: '/dashboard/listings',
      label: 'My Listings', // TODO: Add translation
      icon: Package,
    },
    {
      href: '/dashboard/favorites',
      label: 'Favorites', // TODO: Add translation
      icon: Heart,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings', // TODO: Add translation
      icon: Settings,
    },
  ]

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
      <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="font-heading text-lg font-bold">Dashboard</span>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="my-6 border-t border-border/40" />

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
