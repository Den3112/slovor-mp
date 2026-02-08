'use client'

import Link from 'next/link'
import { User, Plus, Home, Search, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useUnreadMessages } from '@/lib/hooks/use-unread-messages'

interface BottomNavBarProps {
  pathname: string | null
  user: SupabaseUser | null
  onSearchClick?: () => void
}

const navItems = [
  { href: '/', icon: Home, labelKey: 'nav:home' },
  { href: '/listings', icon: Search, labelKey: 'nav:search', isSearch: true },
  { href: '/categories', icon: Grid3X3, labelKey: 'nav:categories' },
]

export function BottomNavBar({
  pathname,
  user,
  onSearchClick,
}: BottomNavBarProps) {
  const { t, locale } = useTranslation(['common', 'nav'])
  const unreadCount = useUnreadMessages()

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`
    return (
      pathname === fullPath || (href !== '/' && pathname?.startsWith(fullPath))
    )
  }

  // Hide on admin and post pages
  if (pathname?.includes('/admin') || pathname?.includes('/post')) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden print:hidden">
      {/* Background */}
      <div className="bg-card border-border absolute inset-0 border-t" />

      <nav
        className="pb-safe relative flex h-16 items-center justify-around px-2"
        data-testid="public-mobile-nav"
      >
        {/* Left nav items */}
        {navItems.slice(0, 2).map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon

          if (item.isSearch && onSearchClick) {
            return (
              <button
                key={item.href}
                onClick={onSearchClick}
                className={cn(
                  'flex h-12 w-14 shrink-0 flex-col items-center justify-center gap-1 transition-colors sm:w-16',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[9px] font-semibold sm:text-[10px]">
                  {t(item.labelKey)}
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                'flex h-12 w-14 shrink-0 flex-col items-center justify-center gap-1 transition-colors sm:w-16',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-semibold sm:text-[10px]">
                {t(item.labelKey)}
              </span>
            </Link>
          )
        })}

        {/* Center: Post Ad Button */}
        <Link href={`/${locale}/post`} className="relative -top-4 shrink-0">
          <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95">
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </div>
        </Link>

        {/* Right nav items */}
        {navItems.slice(2).map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                'flex h-12 w-14 shrink-0 flex-col items-center justify-center gap-1 transition-colors sm:w-16',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-semibold sm:text-[10px]">
                {t(item.labelKey)}
              </span>
            </Link>
          )
        })}

        {/* Profile / Login */}
        {user ? (
          <Link
            href={`/${locale}/dashboard`}
            className={cn(
              'relative flex h-12 w-14 shrink-0 flex-col items-center justify-center gap-1 transition-colors sm:w-16',
              pathname?.includes('/dashboard')
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <div className="relative">
              <User className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="bg-destructive absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-semibold sm:text-[10px]">
              {t('nav:profile')}
            </span>
          </Link>
        ) : (
          <Link
            href={`/${locale}/auth/login`}
            className="text-muted-foreground flex h-12 w-14 shrink-0 flex-col items-center justify-center gap-1 transition-colors sm:w-16"
          >
            <User className="h-5 w-5" />
            <span className="text-[9px] font-semibold sm:text-[10px]">
              {t('common:signIn')}
            </span>
          </Link>
        )}
      </nav>
    </div>
  )
}
