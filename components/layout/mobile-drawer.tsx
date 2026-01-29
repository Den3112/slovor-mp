'use client'

import Link from 'next/link'
import { X, LogOut, LayoutDashboard, Heart, Star, ShieldAlert } from 'lucide-react'
import { config } from '@/lib/config'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Drawer } from 'vaul'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { MobileLanguageSelector } from './language-selector'

interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface MobileDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  navLinks: NavLink[]
  pathname: string | null
  user: SupabaseUser | null
  signOut: () => void
}

export function MobileDrawer({
  open,
  onOpenChange,
  navLinks,
  pathname,
  user,
  signOut,
}: MobileDrawerProps) {
  const { locale, t } = useTranslation()

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Drawer.Content className="border-border bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[85vh] flex-col rounded-t-4xl border-t">
          {/* Drawer Handle */}
          <div className="bg-muted-foreground/20 mx-auto mt-4 h-1.5 w-12 rounded-full" />

          {/* Accessibility Title */}
          <Drawer.Title className="sr-only">Navigation Menu</Drawer.Title>

          {/* Drawer Header */}
          <div className="border-border/50 flex items-center justify-between border-b px-6 py-4">
            <Link
              href="/"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2"
            >
              <div className="relative h-8 w-8">
                <div className="from-primary to-primary absolute inset-0 rotate-6 rounded-xl bg-linear-to-tr via-violet-500" />
                <div className="bg-card absolute inset-0 flex items-center justify-center rounded-xl text-lg font-black">
                  S
                </div>
              </div>
              <span className="font-heading text-xl font-black tracking-tighter">
                Slovor<span className="text-primary">.</span>
              </span>
            </Link>
            <Drawer.Close asChild>
              <button className="border-border/40 text-muted-foreground flex h-10 w-10 items-center justify-center rounded-xl border">
                <X className="h-5 w-5" />
              </button>
            </Drawer.Close>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Navigation Links */}
            {/* Navigation Grid */}
            <div className="space-y-6">
              <div>
                <h3 className="text-muted-foreground/70 mb-3 px-2 text-xs font-black tracking-widest uppercase">
                  Menu
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    const isActive =
                      pathname === link.href ||
                      (link.href !== '/' && pathname?.startsWith(link.href))
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => onOpenChange(false)}
                        className={cn(
                          'flex flex-col gap-2 rounded-2xl border p-4 transition-all active:scale-95',
                          isActive
                            ? 'bg-primary text-primary-foreground border-primary shadow-primary/25 shadow-lg'
                            : 'bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border-transparent'
                        )}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm font-bold">{link.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {user && (
                <div>
                  <h3 className="text-muted-foreground/70 mb-3 px-2 text-xs font-black tracking-widest uppercase">
                    Account
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/profile"
                      onClick={() => onOpenChange(false)}
                      className="bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground flex flex-col gap-2 rounded-2xl border border-transparent p-4 transition-all active:scale-95"
                    >
                      <LayoutDashboard className="h-6 w-6" />
                      <span className="text-sm font-bold">
                        {t('common.profile')}
                      </span>
                    </Link>
                    <Link
                      href="/profile/favorites"
                      onClick={() => onOpenChange(false)}
                      className="bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground flex flex-col gap-2 rounded-2xl border border-transparent p-4 transition-all active:scale-95"
                    >
                      <Heart className="h-6 w-6" />
                      <span className="text-sm font-bold">
                        {t('dashboard.favorites')}
                      </span>
                    </Link>

                    <Link
                      href="/profile/saved-searches"
                      onClick={() => onOpenChange(false)}
                      className="bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground col-span-2 flex flex-col gap-2 rounded-2xl border border-transparent p-4 transition-all active:scale-95"
                    >
                      <Star className="h-6 w-6" />
                      <span className="text-sm font-bold">
                        {t('common.savedSearches')}
                      </span>
                    </Link>

                    {user && config.app.adminEmails.includes(user.email || '') && (
                      <Link
                        href="/admin"
                        onClick={() => onOpenChange(false)}
                        className="border-amber-500/10 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 col-span-2 flex flex-col gap-2 rounded-2xl border p-4 transition-all active:scale-95"
                      >
                        <ShieldAlert className="h-6 w-6" />
                        <span className="text-sm font-bold">
                          {t('common.adminPanel')}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <MobileLanguageSelector locale={locale} />
          </div>

          {/* Drawer Footer */}
          <div className="border-border/50 safe-bottom border-t p-6">
            {!user && (
              <Link
                href="/login"
                className="border-border/50 bg-muted/30 text-foreground active:bg-muted mt-3 block w-full rounded-2xl border py-4 text-center text-base font-bold transition-colors"
                onClick={() => onOpenChange(false)}
              >
                {t('auth.hasAccount')}{' '}
                <span className="text-primary">{t('auth.signIn')}</span>
              </Link>
            )}

            {user && (
              <button
                onClick={() => {
                  signOut()
                  onOpenChange(false)
                }}
                className="border-destructive/20 text-destructive active:bg-destructive/5 mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border py-4 text-base font-bold transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {t('auth.signOut')}
              </button>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root >
  )
}
