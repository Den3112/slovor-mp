'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Store, Plus, MessageCircle, Menu } from 'lucide-react'
import { MobileMenuDrawer } from './mobile-menu-drawer'

import type { DashboardStats } from '@/lib/api/dashboard-stats'
import { useTranslation } from '@/lib/i18n'

interface MobileBottomNavProps {
  stats?: DashboardStats
}

export function MobileBottomNav({ stats }: MobileBottomNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const { t } = useTranslation(['common', 'profile', 'dashboard'])

  const isActive = (href: string) => {
    const cleanPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
    return cleanPathname === href || cleanPathname.startsWith(href + '/')
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 md:hidden" data-testid="profile-mobile-nav">
      {/* Solid Background with Border Top */}
      <div className="bg-card absolute inset-0 border-t border-border shadow-[0_-5px_20px_rgba(0,0,0,0.05)]" />

      <nav
        className="relative flex h-[88px] items-center justify-around px-2 pb-[28px]"
        data-testid="profile-mobile-nav-inner"
      >
        {/* 1. Dashboard */}
        <Link
          href="/profile/overview"
          data-testid="profile-mobile-nav-home"
          className={cn(
            'flex h-full w-16 flex-col items-center justify-center gap-1 transition-colors active:scale-95',
            isActive('/profile/overview')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <LayoutDashboard
            className={cn(
              'h-6 w-6',
              isActive('/profile/overview') && 'fill-primary/20'
            )}
          />
          <span className="text-[10px] font-bold">{t('common:home')}</span>
        </Link>

        {/* 2. My Listings - Show Badge */}
        <Link
          href="/profile/listings"
          data-testid="profile-mobile-nav-listings"
          className={cn(
            'relative flex h-full w-16 flex-col items-center justify-center gap-1 transition-colors active:scale-95',
            isActive('/profile/listings')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div className="relative">
            <Store
              className={cn(
                'h-6 w-6',
                isActive('/profile/listings') && 'fill-primary/20'
              )}
            />
            {stats && stats.activeListings > 0 && (
              <span className="bg-primary ring-background absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2">
                {stats.activeListings}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">{t('profile:myListings')}</span>
        </Link>

        {/* 3. CORE ACTION: POST AD */}
        <div className="relative -top-6">
          <Link href="/post" data-testid="profile-mobile-nav-post">
            <div className="bg-primary shadow-primary/40 border-background flex h-14 w-14 items-center justify-center rounded-full border-[3px] text-white shadow-lg transition-transform active:scale-95">
              <Plus className="h-7 w-7 stroke-3" />
            </div>
          </Link>
        </div>

        {/* 4. Inbox - Show Badge */}
        <Link
          href="/profile/messages"
          data-testid="profile-mobile-nav-messages"
          className={cn(
            'flex h-full w-16 flex-col items-center justify-center gap-1 transition-colors active:scale-95',
            isActive('/profile/messages')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div className="relative">
            <MessageCircle
              className={cn(
                'h-6 w-6',
                isActive('/profile/messages') && 'fill-primary/20'
              )}
            />
            {stats && stats.messages > 0 && (
              <span className="bg-primary ring-background absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2">
                {stats.messages}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">{t('profile:inbox')}</span>
        </Link>

        {/* 5. Menu Drawer Trigger */}
        <MobileMenuDrawer open={open} setOpenAction={setOpen} stats={stats}>
          <button
            data-testid="profile-mobile-nav-menu"
            className={cn(
              'flex h-full w-16 flex-col items-center justify-center gap-1 transition-colors active:scale-95',
              open
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Menu className="h-6 w-6" />
            <span className="text-[10px] font-bold">{t('common:dashboard')}</span>
          </button>
        </MobileMenuDrawer>
      </nav>
    </div>
  )
}
