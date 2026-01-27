'use client'

import Link from 'next/link'
import { User, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useUnreadMessages } from '@/lib/hooks/use-unread-messages'

interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface BottomNavBarProps {
  navLinks: NavLink[]
  pathname: string | null
  user: SupabaseUser | null
}

export function BottomNavBar({ navLinks, pathname, user }: BottomNavBarProps) {
  const { t } = useTranslation('common')
  const unreadCount = useUnreadMessages()

  // Split links: First 2 go left, rest go right (before the profile)
  // NOTE: We assume navLinks has enough items. If not, the layout might look sparse but won't break.
  const leftLinks = navLinks.slice(0, 2)
  const rightLinks = navLinks.slice(2)

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href))

  // Don't render the public bottom nav on dashboard pages (Dashboard has its own nav)
  if (pathname?.startsWith('/profile')) {
    return null
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      {/* Glassmorphism Background with Gradient Border Top */}
      <div className="bg-background/80 absolute inset-0 border-t border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] backdrop-blur-xl" />

      <nav className="relative flex h-[88px] items-center justify-around px-2 pb-[28px]">
        {/* Left Links (Home, Listings) */}
        {leftLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex h-full w-16 flex-col items-center justify-center gap-1 transition-colors active:scale-95',
              isActive(link.href)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <link.icon
              className={cn(
                'h-6 w-6',
                isActive(link.href) && 'fill-primary/20'
              )}
            />
            <span className="text-[10px] font-bold whitespace-nowrap">
              {link.label}
            </span>
          </Link>
        ))}

        {/* CORE ACTION: POST AD (+) */}
        <div className="relative -top-6 flex min-w-18 justify-center">
          <Link href="/post">
            <div className="bg-primary shadow-primary/40 border-background flex h-14 w-14 items-center justify-center rounded-full border-[3px] text-white shadow-lg transition-transform active:scale-95">
              <Plus className="h-7 w-7 stroke-3" />
            </div>
          </Link>
        </div>

        {/* Right Links (Categories) */}
        {rightLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex h-full w-16 flex-col items-center justify-center gap-1 transition-colors active:scale-95',
              isActive(link.href)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <link.icon
              className={cn(
                'h-6 w-6',
                isActive(link.href) && 'fill-primary/20'
              )}
            />
            <span className="text-[10px] font-bold whitespace-nowrap">
              {link.label}
            </span>
          </Link>
        ))}

        {/* Profile / Login */}
        {user ? (
          <Link
            href="/profile"
            className={cn(
              'flex h-full w-16 flex-col items-center justify-center gap-1 transition-colors active:scale-95',
              pathname?.startsWith('/profile')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className="relative">
              <User
                className={cn(
                  'h-6 w-6',
                  pathname?.startsWith('/profile') && 'fill-primary/20'
                )}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-2 ring-background">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold whitespace-nowrap">
              {t('profile')}
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground flex h-full w-16 flex-col items-center justify-center gap-1 transition-colors active:scale-95"
          >
            <User className="h-6 w-6" />
            <span className="text-[10px] font-bold whitespace-nowrap">
              {t('signIn')}
            </span>
          </Link>
        )}
      </nav>
    </div>
  )
}
