'use client'

import Link from 'next/link'
import { X, LogOut, Plus, ChevronRight, Heart, Search, Home, MessageSquare, Settings, UserCircle, Moon, Sun, ShieldAlert, Package } from 'lucide-react'
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
  const { locale, t } = useTranslation(['common', 'nav', 'profile', 'categories', 'home'])
  const { theme, setTheme } = useTheme()
  const unreadCount = useUnreadMessages()

  const isActive = (href: string) => {
    const fullHref = `/${locale}${href === '/' ? '' : href}`
    return pathname === fullHref || (href !== '/' && pathname?.startsWith(fullHref))
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <AnimatePresence>
          {open && (
            <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[92vh] flex-col rounded-t-[2.5rem] border-t border-border bg-background shadow-2xl outline-hidden overflow-hidden">
              {/* Drawer Handle */}
              <div className="mx-auto mt-4 h-1 w-10 rounded-full bg-muted-foreground/20" />

              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6">
                <div className="flex flex-col">
                  <span className="font-heading text-2xl font-black italic tracking-tighter text-foreground">Slovor.</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{t('nav:menu') || 'Navigation Menu'}</p>
                </div>
                <Drawer.Close asChild>
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground active:scale-95 transition-all">
                    <X className="h-5 w-5" />
                  </button>
                </Drawer.Close>
              </div>

              <ScrollArea className="flex-1 px-4">
                <div className="pb-32 space-y-8">

                  {/* ГЛАВНОЕ / MAIN */}
                  <div className="space-y-4">
                    <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                      {t('home:megaMenu.title') || 'MAIN MENU'}
                    </h3>
                    <div className="grid grid-cols-1 gap-1">
                      {[
                        { icon: Home, label: t('nav:home'), href: '/' },
                        { icon: Search, label: t('nav:search'), href: '/search' },
                        { icon: Heart, label: t('nav:favorites'), href: '/favorites' },
                        { icon: MessageSquare, label: t('nav:messages'), href: '/messages', badge: unreadCount },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={`/${locale}${item.href === '/' ? '' : item.href}`}
                          onClick={() => onOpenChange(false)}
                          className={cn(
                            "group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98]",
                            isActive(item.href) ? "bg-primary/5 text-primary border border-primary/10" : "hover:bg-muted/50 text-foreground/80"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <item.icon className={cn("h-5 w-5", isActive(item.href) ? "text-primary" : "text-muted-foreground/60")} />
                            <span className={cn("text-sm font-bold tracking-tight", isActive(item.href) && "text-primary")}>
                              {item.label}
                            </span>
                          </div>
                          {item.badge ? (
                            <Badge className="bg-primary text-white border-0 font-black text-[9px] h-5 min-w-5 flex items-center justify-center rounded-md">
                              {item.badge}
                            </Badge>
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* КАТЕГОРИИ / CATEGORIES */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                        {t('nav:categories')}
                      </h3>
                      <Link href={`/${locale}/categories`} onClick={() => onOpenChange(false)} className="text-[9px] font-black text-primary uppercase tracking-widest">
                        {t('common:viewAll')} →
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {NAV_LINKS.categories.slice(0, 5).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/${locale}/categories/${cat.id}`}
                          onClick={() => onOpenChange(false)}
                          className="group flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-muted/50 transition-all active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm ring-1 ring-white/10", cat.color)}>
                              <cat.icon className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold tracking-tight text-foreground/80">{t(cat.label)}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* АККАУНТ / ACCOUNT */}
                  <div className="space-y-4">
                    <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                      {t('common:account') || 'MY ACCOUNT'}
                    </h3>
                    <div className="grid grid-cols-1 gap-1">
                      {user ? (
                        <>
                          {[
                            { icon: UserCircle, label: t('nav:dashboard'), href: '/dashboard' },
                            { icon: Package, label: t('profile:myListings') || 'My Listings', href: '/dashboard/listings' },
                            { icon: Settings, label: t('profile:settings') || 'Settings', href: '/dashboard/settings' },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={`/${locale}${item.href}`}
                              onClick={() => onOpenChange(false)}
                              className={cn(
                                "group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98]",
                                isActive(item.href) ? "bg-primary/5 text-primary border border-primary/10" : "hover:bg-muted/50 text-foreground/80"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <item.icon className={cn("h-5 w-5", isActive(item.href) ? "text-primary" : "text-muted-foreground/60")} />
                                <span className={cn("text-sm font-bold tracking-tight", isActive(item.href) && "text-primary")}>
                                  {item.label}
                                </span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                            </Link>
                          ))}

                          {config.app.adminEmails.includes(user.email || '') && (
                            <Link
                              href={`/${locale}/admin`}
                              onClick={() => onOpenChange(false)}
                              className="group flex items-center justify-between px-4 py-3.5 rounded-2xl bg-amber-500/5 text-amber-600 border border-amber-500/10 active:scale-[0.98] transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <ShieldAlert className="h-5 w-5" />
                                <span className="text-sm font-bold tracking-tight">{t('common:adminPanel')}</span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-amber-500/30" />
                            </Link>
                          )}

                          <button
                            onClick={() => { signOut(); onOpenChange(false); }}
                            className="group flex w-full items-center gap-4 px-4 py-3.5 rounded-2xl text-destructive hover:bg-destructive/5 active:scale-[0.98] transition-all"
                          >
                            <LogOut className="h-5 w-5" />
                            <span className="text-sm font-bold tracking-tight">{t('profile:signOut')}</span>
                          </button>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 px-2 pt-2">
                          <Link
                            href={`/${locale}/auth/login`}
                            onClick={() => onOpenChange(false)}
                            className="flex items-center justify-center rounded-xl bg-primary py-3 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 active:scale-95 transition-all"
                          >
                            {t('common:signIn')}
                          </Link>
                          <Link
                            href={`/${locale}/auth/register`}
                            onClick={() => onOpenChange(false)}
                            className="flex items-center justify-center rounded-xl bg-muted py-3 text-[10px] font-black uppercase tracking-widest text-foreground active:scale-95 transition-all border border-border/40"
                          >
                            {t('common:register')}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SETTINGS HOOK */}
                  <div className="pt-4 border-t border-border/40 space-y-6">
                    <div className="flex items-center justify-between px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                          {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </div>
                        <span className="text-sm font-bold tracking-tight text-foreground/80">{t('common:theme') || 'Theme'}</span>
                      </div>
                      <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="h-8 w-14 rounded-full bg-muted p-1 transition-all relative"
                      >
                        <motion.div
                          animate={{ x: theme === 'dark' ? 24 : 0 }}
                          className="h-6 w-6 rounded-full bg-background shadow-sm flex items-center justify-center"
                        >
                          {theme === 'dark' ? <Moon className="h-3 w-3 text-primary" /> : <Sun className="h-3 w-3 text-amber-500" />}
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
              <div className="absolute inset-x-0 bottom-0 border-t border-border/40 bg-background/80 p-6 backdrop-blur-lg">
                <Button asChild className="w-full h-14 rounded-2xl gap-3 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-0 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Link href={`/${locale}/post`} onClick={() => onOpenChange(false)}>
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
