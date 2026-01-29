'use client'

import Link from 'next/link'
import { User, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useUnreadMessages } from '@/lib/hooks/use-unread-messages'
import { NAV_LINKS } from '@/lib/constants/nav-links'

interface BottomNavBarProps {
  pathname: string | null
  user: SupabaseUser | null
  onSearchClick?: () => void
}

export function BottomNavBar({ pathname, user, onSearchClick }: BottomNavBarProps) {
  const { t, locale } = useTranslation('common')
  const unreadCount = useUnreadMessages()

  // Prepare links: Home, Search | Categories, Messages/Profile
  const mainLinks = NAV_LINKS.main.slice(0, 2) // Home, Listings
  const secondaryLinks = NAV_LINKS.main.slice(2) // Categories and beyond

  const isActive = (href: string) =>
    pathname === href || (href !== `/${locale}` && pathname?.startsWith(href))

  // Don't render the public bottom nav on dashboard pages (Dashboard has its own nav)
  if (pathname?.startsWith(`/${locale}/profile`)) {
    return null
  }

  const renderNavLink = (link: typeof NAV_LINKS['main'][0]) => {
    const href = `/${locale}${link.href}`
    const active = isActive(href)
    const Icon = link.icon
    const isSearch = link.href === '/listings'

    const content = (
      <div className={cn(
        'flex h-full w-14 flex-col items-center justify-center gap-1.5 transition-all duration-300 active:scale-90 cursor-pointer',
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      )}>
        <div className={cn(
          "rounded-xl p-1.5 transition-all duration-500",
          active ? "bg-primary/10 shadow-lg shadow-primary/5" : "bg-transparent"
        )}>
          <Icon className={cn(
            'h-5 w-5 transition-transform duration-300',
            active && 'scale-110'
          )} />
        </div>
        <span className="text-[9px] font-black tracking-tighter uppercase whitespace-nowrap">
          {t(link.label)}
        </span>
      </div>
    )

    if (isSearch && onSearchClick) {
      return (
        <button key={link.href} onClick={onSearchClick} className="appearance-none focus:outline-hidden">
          {content}
        </button>
      )
    }

    return (
      <Link key={link.href} href={href}>
        {content}
      </Link>
    )
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 md:hidden print:hidden">
      {/* Premium Glassmorphism Background */}
      <div className="absolute inset-x-0 bottom-0 h-[calc(84px+env(safe-area-inset-bottom))] border-t border-border/40 bg-background/60 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.1)] backdrop-blur-2xl transition-colors duration-500" />

      <nav className="relative flex h-[84px] items-center justify-around px-4 pb-[env(safe-area-inset-bottom)]">
        {/* Left Links */}
        {mainLinks.map(renderNavLink)}

        {/* CORE ACTION: POST AD (+) */}
        <div className="relative -top-6 flex justify-center">
          <Link href={`/${locale}/post`}>
            <div className="bg-primary shadow-primary/30 border-background flex h-14 w-14 items-center justify-center rounded-2xl border-4 text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 active:rotate-45">
              <Plus className="h-7 w-7 stroke-[3px]" />
            </div>
          </Link>
        </div>

        {/* Right Links */}
        {secondaryLinks.map(renderNavLink)}

        {/* Profile / Login */}
        {user ? (
          <Link
            href={`/${locale}/profile`}
            className={cn(
              'flex h-full w-14 flex-col items-center justify-center gap-1.5 transition-all duration-300 active:scale-90',
              pathname?.startsWith(`/${locale}/profile`)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className={cn(
              "rounded-xl p-1.5 transition-all duration-500",
              pathname?.startsWith(`/${locale}/profile`) ? "bg-primary/10 shadow-lg shadow-primary/5" : "bg-transparent"
            )}>
              <div className="relative">
                <User
                  className={cn(
                    'h-5 w-5 transition-transform duration-300',
                    pathname?.startsWith(`/${locale}/profile`) && 'scale-110'
                  )}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-black text-white ring-2 ring-background">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[9px] font-black tracking-tighter uppercase whitespace-nowrap">
              {t('nav.profile')}
            </span>
          </Link>
        ) : (
          !pathname?.includes('/auth/login') && (
            <Link
              href={`/${locale}/auth/login`}
              className="text-muted-foreground hover:text-foreground flex h-full w-14 flex-col items-center justify-center gap-1.5 transition-all duration-300 active:scale-90"
            >
              <div className="rounded-xl bg-transparent p-1.5">
                <User className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black tracking-tighter uppercase whitespace-nowrap">
                {t('common.signIn')}
              </span>
            </Link>
          )
        )}
      </nav>
    </div>
  )
}
