'use client'

import { Drawer } from 'vaul'
import { Button } from '@/components/ui/button'
import {
  Heart,
  Settings,
  Package,
  LogOut,
  Eye,
  UserCircle,
  MessageCircle,
  ShoppingBag,
  Store,
  Star,
  ShieldAlert,
} from 'lucide-react'
import { config } from '@/lib/config'
import { SUPPORTED_LOCALES } from '@/components/ui/flags'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n'

import type { DashboardStats } from '@/lib/api/dashboard-stats'

interface NavSection {
  title?: string
  items: {
    href: string
    label: string
    icon: React.ElementType
    isAdmin?: boolean
  }[]
}

// ... imports ...

// Cleaned up implementation
export function MobileMenuDrawer({
  children,
  open,
  setOpenAction,
  stats,
}: {
  children: React.ReactNode
  open?: boolean
  setOpenAction?: (open: boolean) => void
  stats?: DashboardStats
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { locale, setLocale, t } = useTranslation(['common', 'profile'])
  const [user, setUser] = useState<{
    id: string
    email?: string
    user_metadata?: { full_name?: string }
  } | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

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
      case '/profile/reviews':
        return stats.reviews
      case '/profile/saved-searches':
        return stats.savedSearches
      default:
        return 0
    }
  }

  const sections: NavSection[] = [
    {
      title: t('profile:commerce'),
      items: [
        {
          href: '/profile/listings',
          label: t('profile:myListings'),
          icon: Store,
        },
        { href: '/profile/orders', label: t('profile:orders'), icon: Package },
        { href: '/profile/wallet', label: t('profile:wallet'), icon: ShoppingBag },
      ],
    },
    {
      title: t('profile:shopping'),
      items: [
        {
          href: '/profile/purchases',
          label: t('profile:purchases'),
          icon: ShoppingBag,
        },
        { href: '/profile/favorites', label: t('profile:favorites'), icon: Heart },
        {
          href: '/profile/saved-searches',
          label: t('profile:savedSearches'),
          icon: Star,
        },
      ],
    },
    {
      title: t('profile:communication'),
      items: [
        { href: '/profile/messages', label: t('profile:inbox'), icon: MessageCircle },
        { href: '/profile/reviews', label: t('profile:reviews'), icon: Star },
      ],
    },
    {
      title: t('profile:account'),
      items: [
        { href: '/profile/profile', label: t('profile:publicProfile'), icon: Eye },
        { href: '/profile/settings', label: t('profile:settings'), icon: Settings },
        {
          href: '/admin',
          label: t('adminPanel'),
          icon: ShieldAlert,
          isAdmin: true,
        },
      ],
    },
  ]

  return (
    <Drawer.Root open={open} onOpenChange={setOpenAction}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Drawer.Content
          className="bg-background fixed right-0 bottom-0 left-0 z-50 mt-24 flex h-[85vh] flex-col rounded-t-4xl border-t border-border outline-none"
          aria-describedby={undefined}
        >
          {/* Handle Indicator */}
          <div className="bg-background shrink-0 rounded-t-4xl p-4">
            <div className="bg-muted-foreground/30 mx-auto mb-8 h-1.5 w-12 shrink-0 rounded-full" />
            <Drawer.Title className="sr-only">Mobile Menu</Drawer.Title>
            <Drawer.Description className="sr-only">
              Navigation menu for accessing different sections of the dashboard.
            </Drawer.Description>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pt-0">
            {/* User Header */}
            {user && (
              <div className="bg-muted/40 mb-8 flex items-center gap-4 rounded-2xl border border-white/5 p-4">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <UserCircle className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-bold">
                    {user.user_metadata?.full_name || t('profile:user')}
                  </p>
                  <p className="text-muted-foreground truncate font-mono text-xs">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Grid */}
            <div className="space-y-6 pb-20">
              {sections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-muted-foreground/70 mb-3 px-2 text-xs font-black tracking-widest uppercase">
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {section.items.map((item) => {
                      // Filter out admin items if user is not admin
                      if (
                        item.isAdmin &&
                        !config.app.adminEmails.includes(user?.email || '')
                      ) {
                        return null
                      }
                      const Icon = item.icon
                      const cleanPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
                      const isActive = cleanPathname === item.href || cleanPathname.startsWith(item.href + '/')
                      const count = getBadgeCount(item.href)

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenAction?.(false)}
                          className={cn(
                            'relative flex flex-col gap-2 overflow-hidden rounded-2xl border p-4 transition-all active:scale-95',
                            isActive
                              ? 'bg-primary text-primary-foreground border-primary shadow-primary/25 shadow-lg'
                              : 'bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border-transparent'
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <Icon className="h-6 w-6" />
                            {count > 0 && (
                              <span
                                className={cn(
                                  'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black',
                                  isActive
                                    ? 'text-primary bg-white'
                                    : 'bg-primary text-white'
                                )}
                              >
                                {count}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-bold">
                            {item.label}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Language Selector */}
              <div className="mb-6">
                <h3 className="text-muted-foreground/70 mb-3 px-2 text-xs font-black tracking-widest uppercase">
                  {t('profile:language')}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {SUPPORTED_LOCALES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code as any)
                        setOpenAction?.(false)
                      }}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-2xl border py-4 font-bold transition-all active:scale-95',
                        locale === lang.code
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted border-transparent'
                      )}
                    >
                      <div className="flex h-6 w-9 items-center justify-center overflow-hidden rounded-sm shadow-sm">
                        <div className="h-full w-full scale-125 transform saturate-[1.2]">
                          {lang.flag}
                        </div>
                      </div>
                      <span className="text-xs">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-border/50 border-t pt-6">
                <Button
                  variant="destructive"
                  className="shadow-destructive/10 h-12 w-full rounded-2xl font-bold shadow-lg"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('profile:signOut')}
                </Button>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}


