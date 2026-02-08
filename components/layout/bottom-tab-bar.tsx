'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/components/providers/auth-provider'
import { useUnreadMessages } from '@/lib/hooks/use-unread-messages'

export function BottomTabBar() {
  const { t, locale } = useTranslation(['common', 'nav'])
  const { user } = useAuth()
  const pathname = usePathname()
  const unreadCount = useUnreadMessages()
  const isDashboard =
    pathname?.includes('/admin') || pathname?.includes('/dashboard')

  if (isDashboard) {
    return null
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === `/${locale}`
    }
    return pathname?.startsWith(`/${locale}${href}`)
  }

  const tabs = [
    { icon: Home, label: t('nav:home'), href: '/' },
    { icon: Search, label: t('nav:search'), href: '/search' },
    { icon: Plus, label: t('nav:postAd'), href: '/post', primary: true },
    { icon: Heart, label: t('nav:favorites'), href: '/dashboard/favorites' },
    {
      icon: User,
      label: user ? t('nav:dashboard') : t('common:signIn'),
      href: user ? '/dashboard' : '/auth/login',
    },
  ]

  return (
    <nav className="border-border bg-background pb-safe fixed inset-x-0 bottom-0 z-50 h-16 border-t md:hidden print:hidden">
      <div className="flex h-full items-center justify-around px-2">
        {tabs.map((tab) => {
          const active = isActive(tab.href)
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={`/${locale}${tab.href}`}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-1 py-2',
                'text-muted-foreground hover:text-foreground transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {tab.primary ? (
                <div className="relative -mt-8 flex items-center justify-center">
                  <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-xl" />
                  <div className="bg-primary text-primary-foreground shadow-primary/40 ring-background relative flex h-14 w-14 items-center justify-center rounded-full border-0 shadow-2xl ring-4 transition-all group-hover:scale-110 active:scale-90">
                    <Icon className="h-7 w-7" strokeWidth={3} />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-all',
                      active && 'scale-110'
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {tab.href === (user ? '/dashboard' : '/auth/login') &&
                    unreadCount > 0 && (
                      <span className="bg-primary ring-background absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-lg text-[9px] font-bold text-white shadow-sm ring-2">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                </div>
              )}
              <span
                className={cn(
                  'w-full truncate px-1 text-center text-[10px] font-medium',
                  active && 'font-bold'
                )}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
