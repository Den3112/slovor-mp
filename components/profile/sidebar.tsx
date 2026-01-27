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
  Star,
  ShieldCheck,
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

import type { DashboardStats } from '@/lib/api/dashboard-stats'

interface DashboardSidebarProps {
  stats?: DashboardStats
}

import { useTranslation } from '@/lib/i18n'

export function DashboardSidebar({ stats }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useTranslation()

  // Map stats to routes
  const getBadgeCount = (href: string) => {
    if (!stats) return 0
    switch (href) {
      case '/profile/listings':
        return stats.activeListings
      case '/profile/favorites':
        return stats.favorites
      case '/profile/orders':
        return stats.orders
      case '/profile/messages':
        return stats.messages
      case '/profile/saved-searches':
        return stats.savedSearches
      case '/profile/reviews':
        return stats.reviews
      default:
        return 0
    }
  }

  /* Premium Marketplace Sidebar Structure */
  const sections: NavSection[] = [
    {
      title: t('profile.overview'),
      items: [
        {
          href: '/profile/overview',
          label: t('common.dashboard'),
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: t('profile.commerce'),
      items: [
        {
          href: '/profile/listings',
          label: t('profile.myListings'),
          icon: Store,
        },
        {
          href: '/profile/orders',
          label: t('profile.orders'),
          icon: Package,
        },
        {
          href: '/profile/wallet',
          label: t('profile.wallet'),
          icon: ShoppingBag,
        },
      ],
    },
    {
      title: t('profile.shopping'),
      items: [
        {
          href: '/profile/purchases',
          label: t('profile.purchases'),
          icon: ShoppingBag,
        },
        {
          href: '/profile/favorites',
          label: t('profile.favorites'),
          icon: Heart,
        },
        {
          href: '/profile/saved-searches',
          label: t('profile.savedSearches'),
          icon: Star,
        },
      ],
    },
    {
      title: t('profile.communication'),
      items: [
        {
          href: '/profile/messages',
          label: t('profile.inbox'),
          icon: MessageCircle,
        },
        {
          href: '/profile/reviews',
          label: t('profile.reviews'),
          icon: Star,
        },
      ],
    },
    {
      title: t('profile.account'),
      items: [
        {
          href: '/profile/profile',
          label: t('profile.publicProfile'),
          icon: Eye,
        },
        {
          href: '/profile/verification',
          label: t('profile.verification'),
          icon: ShieldCheck,
        },
        {
          href: '/profile/settings',
          label: t('profile.settings'),
          icon: Settings,
        },
      ],
    },
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
      <aside className="hidden w-72 shrink-0 md:block">
        <div className="bg-background/60 group/sidebar sticky top-28 overflow-hidden rounded-5xl border border-white/20 p-6 shadow-2xl backdrop-blur-xl dark:border-white/5">
          <div className="from-primary/5 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover/sidebar:opacity-100" />

          <div className="relative z-10 space-y-8">
            {sections.map((section, idx) => (
              <div key={idx}>
                {section.title && (
                  <h3 className="text-muted-foreground/60 mb-3 px-4 text-[10px] font-black tracking-widest uppercase">
                    {section.title}
                  </h3>
                )}
                <nav className="space-y-1.5">
                  {section.items.map((link) => {
                    const Icon = link.icon
                    const active = isActiveLink(link.href)
                    const count = getBadgeCount(link.href)

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300',
                          active
                            ? 'text-primary-foreground shadow-primary/20 shadow-lg'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        )}
                      >
                        {active && (
                          <div className="from-primary to-primary/90 absolute inset-0 bg-linear-to-r" />
                        )}
                        <Icon
                          className={cn(
                            'relative z-10 h-4 w-4 transition-transform duration-300 group-hover:scale-110',
                            active
                              ? 'text-primary-foreground'
                              : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        />
                        <span className="relative z-10 flex-1">
                          {link.label}
                        </span>

                        {/* Counter Badge */}
                        {count > 0 && (
                          <span
                            className={cn(
                              'relative z-10 min-w-[20px] rounded-full px-2 py-0.5 text-center text-[10px] font-black',
                              active
                                ? 'bg-white/20 text-white'
                                : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                            )}
                          >
                            {count}
                          </span>
                        )}

                        {/* Active Indicator Dot (Only if no badge or specific design choice) */}
                        {active && !count && (
                          <div className="absolute top-1/2 right-4 h-1.5 w-1.5 -translate-y-1/2 animate-pulse rounded-full bg-white" />
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="border-border/20 my-6 border-t" />

          <button
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 group relative z-10 flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t('auth.signOut')}
          </button>
        </div>
      </aside>
    </>
  )
}
