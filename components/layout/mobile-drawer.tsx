'use client'

import Link from 'next/link'
import {
  X,
  LogOut,
  Plus,
  ChevronRight,
  Heart,
  Search,
  Home,
  MessageSquare,
  Settings,
  Moon,
  Sun,
  ShieldAlert,
  Package,
  Zap,
  Star,
  Clock,
  LayoutDashboard,
  Wallet,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react'
import { config } from '@/lib/config'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Drawer } from 'vaul'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { MobileLanguageSelector } from './language-selector'
import { NAV_LINKS } from '@/lib/constants/nav-links'
import { useTheme } from 'next-themes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUnreadMessages } from '@/lib/hooks/use-unread-messages'

interface MobileDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pathname: string | null
  user: SupabaseUser | null
  signOut: () => void
}

export function MobileDrawer({
  open,
  onOpenChange,
  pathname,
  user,
  signOut,
}: MobileDrawerProps) {
  const { locale, t } = useTranslation([
    'common',
    'nav',
    'profile',
    'categories',
    'home',
  ])
  const { theme, setTheme } = useTheme()
  const unreadCount = useUnreadMessages()

  const isActive = (href: string) => {
    const fullHref = `/${locale}${href === '/' ? '' : href}`
    return (
      pathname === fullHref || (href !== '/' && pathname?.startsWith(fullHref))
    )
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <AnimatePresence>
          {open && (
            <Drawer.Content className="border-border bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[92vh] flex-col overflow-hidden rounded-t-2xl border-t shadow-xl outline-hidden">
              {/* Drawer Handle */}
              <div className="bg-muted-foreground/20 mx-auto mt-4 h-1 w-10 rounded-full" />

              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6">
                <div className="flex flex-col">
                  <span className="font-heading text-foreground text-2xl font-bold tracking-tighter">
                    Slovor.
                  </span>
                  <p className="text-muted-foreground/40 text-[10px] font-bold tracking-[0.2em] uppercase">
                    {t('nav:menu') || 'Navigation Menu'}
                  </p>
                </div>
                <Drawer.Close asChild>
                  <button className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-95">
                    <X className="h-5 w-5" />
                  </button>
                </Drawer.Close>
              </div>

              <ScrollArea className="flex-1 px-4">
                <div className="space-y-8 pb-32">
                  {/* ГЛАВНОЕ / MAIN */}
                  <div className="space-y-4">
                    <h3 className="text-muted-foreground/40 px-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                      {t('home:megaMenu.title') || 'MAIN MENU'}
                    </h3>
                    <div className="grid grid-cols-1 gap-1">
                      {[
                        { icon: Home, label: t('nav:home'), href: '/' },
                        {
                          icon: Search,
                          label: t('nav:search'),
                          href: '/search',
                        },
                        {
                          icon: Heart,
                          label: t('nav:favorites'),
                          href: '/dashboard/favorites',
                        },
                        {
                          icon: MessageSquare,
                          label: t('nav:messages'),
                          href: '/dashboard/messages',
                          badge: unreadCount,
                        },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={`/${locale}${item.href === '/' ? '' : item.href}`}
                          onClick={() => onOpenChange(false)}
                          className={cn(
                            'group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all active:scale-[0.98]',
                            isActive(item.href)
                              ? 'bg-primary/5 text-primary border-primary/10 border'
                              : 'hover:bg-muted/50 text-foreground/80'
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <item.icon
                              className={cn(
                                'h-5 w-5',
                                isActive(item.href)
                                  ? 'text-primary'
                                  : 'text-muted-foreground/60'
                              )}
                            />
                            <span
                              className={cn(
                                'text-sm font-bold tracking-tight',
                                isActive(item.href) && 'text-primary'
                              )}
                            >
                              {item.label}
                            </span>
                          </div>
                          {item.badge ? (
                            <Badge className="bg-primary flex h-5 min-w-5 items-center justify-center rounded-sm border-0 text-[9px] font-bold text-white">
                              {item.badge}
                            </Badge>
                          ) : (
                            <ChevronRight className="text-muted-foreground/30 h-4 w-4" />
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* КАТЕГОРИИ / CATEGORIES */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                      <h3 className="text-muted-foreground/40 text-[10px] font-bold tracking-[0.2em] uppercase">
                        {t('nav:categories')}
                      </h3>
                      <Link
                        href={`/${locale}/categories`}
                        onClick={() => onOpenChange(false)}
                        className="text-primary text-[9px] font-bold tracking-widest uppercase"
                      >
                        {t('common:viewAll')} →
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {NAV_LINKS.categories.slice(0, 5).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/${locale}/categories/${cat.id}`}
                          onClick={() => onOpenChange(false)}
                          className="group hover:bg-muted/50 flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-white/10',
                                cat.color
                              )}
                            >
                              <cat.icon className="h-4 w-4" />
                            </div>
                            <span className="text-foreground/80 text-sm font-bold tracking-tight">
                              {t(cat.label)}
                            </span>
                          </div>
                          <ChevronRight className="text-muted-foreground/30 h-4 w-4" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* АККАУНТ / ACCOUNT */}
                  <div className="space-y-4">
                    <h3 className="text-muted-foreground/40 px-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                      {t('common:account') || 'MY ACCOUNT'}
                    </h3>
                    <div className="grid grid-cols-1 gap-1">
                      {user ? (
                        <>
                          {[
                            {
                              icon: LayoutDashboard,
                              label: t('nav:dashboard'),
                              href: '/dashboard',
                            },
                            {
                              icon: Package,
                              label: t('profile:myListings') || 'My Listings',
                              href: '/dashboard/listings',
                            },
                            {
                              icon: Wallet,
                              label: t('profile:wallet') || 'Wallet',
                              href: '/dashboard/wallet',
                            },
                            {
                              icon: ShoppingBag,
                              label: t('dashboard:ordersAndSales') || 'Orders',
                              href: '/dashboard/orders',
                            },
                            {
                              icon: Star,
                              label: t('profile:reviews') || 'Reviews',
                              href: '/dashboard/reviews',
                            },
                            {
                              icon: Zap,
                              label:
                                t('dashboard:marketInsights') || 'Analytics',
                              href: '/dashboard/analytics',
                            },
                            {
                              icon: Clock,
                              label:
                                t('dashboard:activityLog.title') || 'Activity',
                              href: '/dashboard/activity',
                            },
                            {
                              icon: ShieldCheck,
                              label:
                                t('profile:verification') || 'Verification',
                              href: '/dashboard/verification',
                            },
                            {
                              icon: Settings,
                              label: t('profile:settings') || 'Settings',
                              href: '/dashboard/settings',
                            },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={`/${locale}${item.href}`}
                              onClick={() => onOpenChange(false)}
                              className={cn(
                                'group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]',
                                isActive(item.href)
                                  ? 'bg-primary/5 text-primary border-primary/10 border'
                                  : 'hover:bg-muted/50 text-foreground/80'
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <item.icon
                                  className={cn(
                                    'h-5 w-5',
                                    isActive(item.href)
                                      ? 'text-primary'
                                      : 'text-muted-foreground/60'
                                  )}
                                />
                                <span
                                  className={cn(
                                    'text-sm font-bold tracking-tight',
                                    isActive(item.href) && 'text-primary'
                                  )}
                                >
                                  {item.label}
                                </span>
                              </div>
                              <ChevronRight className="text-muted-foreground/30 h-4 w-4" />
                            </Link>
                          ))}

                          {config.app.adminEmails.includes(
                            user.email || ''
                          ) && (
                              <Link
                                href={`/${locale}/admin`}
                                onClick={() => onOpenChange(false)}
                                className="group flex items-center justify-between rounded-2xl border border-amber-500/10 bg-amber-500/5 px-4 py-3.5 text-amber-600 transition-all active:scale-[0.98]"
                              >
                                <div className="flex items-center gap-4">
                                  <ShieldAlert className="h-5 w-5" />
                                  <span className="text-sm font-bold tracking-tight">
                                    {t('common:adminPanel')}
                                  </span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-amber-500/30" />
                              </Link>
                            )}

                          <button
                            onClick={() => {
                              signOut()
                              onOpenChange(false)
                            }}
                            className="group text-destructive hover:bg-destructive/5 flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
                          >
                            <LogOut className="h-5 w-5" />
                            <span className="text-sm font-bold tracking-tight">
                              {t('profile:signOut')}
                            </span>
                          </button>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 px-2 pt-2">
                          <Link
                            href={`/${locale}/auth/login`}
                            onClick={() => onOpenChange(false)}
                            className="bg-primary text-primary-foreground shadow-primary/20 flex items-center justify-center rounded-xl py-3 text-[10px] font-bold tracking-widest uppercase shadow-lg transition-all active:scale-95"
                          >
                            {t('common:signIn')}
                          </Link>
                          <Link
                            href={`/${locale}/auth/register`}
                            onClick={() => onOpenChange(false)}
                            className="bg-muted text-foreground border-border/40 flex items-center justify-center rounded-xl border py-3 text-[10px] font-bold tracking-widest uppercase transition-all active:scale-95"
                          >
                            {t('common:register')}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SETTINGS HOOK */}
                  <div className="border-border/40 space-y-6 border-t pt-4">
                    <div className="flex items-center justify-between px-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-xl">
                          {theme === 'dark' ? (
                            <Moon className="h-4 w-4" />
                          ) : (
                            <Sun className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-foreground/80 text-sm font-bold tracking-tight">
                          {t('common:theme') || 'Theme'}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setTheme(theme === 'dark' ? 'light' : 'dark')
                        }
                        className="bg-muted relative h-8 w-14 rounded-full p-1 transition-all"
                      >
                        <motion.div
                          animate={{ x: theme === 'dark' ? 24 : 0 }}
                          className="bg-background flex h-6 w-6 items-center justify-center rounded-full shadow-sm"
                        >
                          {theme === 'dark' ? (
                            <Moon className="text-primary h-3 w-3" />
                          ) : (
                            <Sun className="h-3 w-3 text-amber-500" />
                          )}
                        </motion.div>
                      </button>
                    </div>

                    <div className="px-2">
                      <MobileLanguageSelector locale={locale} />
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Persistent Bottom CTA */}
              <div className="border-border/40 bg-background absolute inset-x-0 bottom-0 border-t p-6">
                <Button
                  asChild
                  className="shadow-primary/20 bg-primary hover:bg-primary/90 h-14 w-full gap-3 rounded-xl border-0 text-sm font-bold tracking-widest text-white uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link
                    href={`/${locale}/post`}
                    onClick={() => onOpenChange(false)}
                  >
                    <Plus className="h-5 w-5" strokeWidth={3} />
                    {t('nav:postAd')}
                  </Link>
                </Button>
              </div>
            </Drawer.Content>
          )}
        </AnimatePresence>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
