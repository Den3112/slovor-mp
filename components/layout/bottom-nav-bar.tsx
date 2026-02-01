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

export function BottomNavBar({ pathname, user, onSearchClick }: BottomNavBarProps) {
  const { t, locale } = useTranslation(['common', 'nav'])
  const unreadCount = useUnreadMessages()

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`
    return pathname === fullPath || (href !== '/' && pathname?.startsWith(fullPath))
  }

  // Hide on dashboard pages
  if (pathname?.includes('/admin') || pathname?.includes('/profile') || pathname?.includes('/messages')) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden print:hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card border-t border-border" />

      <nav
        className="relative flex h-16 items-center justify-around px-2 pb-safe"
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
                  'flex flex-col items-center justify-center gap-1 h-12 w-16 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">{t(item.labelKey)}</span>
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                'flex flex-col items-center justify-center gap-1 h-12 w-16 transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{t(item.labelKey)}</span>
            </Link>
          )
        })}

        {/* Center: Post Ad Button */}
        <Link
          href={`/${locale}/post`}
          className="relative -top-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95">
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
                'flex flex-col items-center justify-center gap-1 h-12 w-16 transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{t(item.labelKey)}</span>
            </Link>
          )
        })}

        {/* Profile / Login */}
        {user ? (
          <Link
            href={`/${locale}/profile`}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 h-12 w-16 transition-colors',
              pathname?.includes('/profile') ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <div className="relative">
              <User className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">{t('nav:profile')}</span>
          </Link>
        ) : (
          <Link
            href={`/${locale}/auth/login`}
            className="flex flex-col items-center justify-center gap-1 h-12 w-16 text-muted-foreground transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{t('common:signIn')}</span>
          </Link>
        )}
      </nav>
    </div>
  )
}
