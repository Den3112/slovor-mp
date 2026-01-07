'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

import {
  LayoutDashboard,
  Heart,
  Settings,
  Package,
  LogOut,
  Eye,
  MessageCircle,
  ShoppingBag,
  Store,
  Star
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  external?: boolean
}

interface NavSection {
  title?: string
  items: NavItem[]
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  // const { user } = useAuth() -> Removed unused, but maybe needed for future? Keeping clean for lint.

  /* Premium Marketplace Sidebar Structure */
  const sections: NavSection[] = [
    {
      title: 'Overview', // Optional title for first section
      items: [
        {
          href: '/profile/overview',
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
      ]
    },
    {
      title: 'Commerce',
      items: [
        {
          href: '/profile/my-listings',
          label: 'My Listings',
          icon: Store, // Changed to Store for "My Shop" feel
        },
        {
          href: '/profile/orders',
          label: 'Orders',
          icon: Package,
        },
        {
          href: '/profile/wallet',
          label: 'Wallet',
          icon: ShoppingBag, // Temporary, maybe use Wallet icon if available or DollarSign
        },
      ]
    },
    {
      title: 'Shopping',
      items: [
        {
          href: '/profile/purchases',
          label: 'Purchases',
          icon: ShoppingBag,
        },
        {
          href: '/profile/favorites',
          label: 'Favorites',
          icon: Heart,
        },
      ]
    },
    {
      title: 'Communication',
      items: [
        {
          href: '/profile/messages',
          label: 'Inbox',
          icon: MessageCircle,
        },
        {
          href: '/profile/reviews',
          label: 'Reviews',
          icon: Star, // Need to import Star
        },
      ]
    },
    {
      title: 'Account',
      items: [
        {
          href: '/profile/profile',
          label: 'Public Profile',
          icon: Eye,
        },
        {
          href: '/profile/settings',
          label: 'Settings',
          icon: Settings,
        }
      ]
    }
  ]

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActiveLink = (href: string) => {
    if (href === '/profile/overview') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Nav is now handled by MobileBottomNav component */}

      {/* Desktop: Full sidebar */}
      <aside className="hidden md:block w-72 flex-shrink-0">
        <div className="rounded-[2rem] border border-border/40 bg-card p-6 shadow-xl sticky top-28">

          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx}>
                {section.title && (
                  <h3 className="px-4 mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground/70">
                    {section.title}
                  </h3>
                )}
                <nav className="space-y-1">
                  {section.items.map((link) => {
                    const Icon = link.icon
                    const active = isActiveLink(link.href)

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all group',
                          active
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        )}
                      >
                        <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-border/40" />

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 transition-all group"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
