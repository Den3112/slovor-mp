'use client'

import Link from 'next/link'
import { X, LogOut, Plus } from 'lucide-react'
import { config } from '@/lib/config'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Drawer } from 'vaul'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { MobileLanguageSelector } from './language-selector'
import { NAV_LINKS } from '@/lib/constants/nav-links'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: any = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    },
  },
}

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
  const { locale, t } = useTranslation(['common', 'nav', 'profile', 'categories'])

  const renderLink = (link: any) => {
    const Icon = link.icon
    const href = `/${locale}${link.href === '/' ? '' : link.href}`
    const isActive = pathname === href || (link.href !== '/' && pathname?.startsWith(href))

    return (
      <motion.div key={link.href} variants={itemVariants}>
        <Link
          href={href}
          onClick={() => onOpenChange(false)}
          className={cn(
            "group flex items-center justify-between rounded-2xl p-4 transition-all active:scale-95",
            isActive ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" : "hover:bg-muted text-foreground"
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300",
              isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 rotate-3" : "bg-muted text-muted-foreground group-hover:bg-background group-hover:scale-110"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="font-heading text-base font-bold tracking-tight">
              {t(link.label) || link.label}
            </span>
          </div>
          {isActive && (
            <motion.div
              layoutId="active-indicator"
              className="h-2 w-2 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </Link>
      </motion.div>
    )
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md" />
        <AnimatePresence>
          {open && (
            <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[94vh] flex-col rounded-t-[32px] border-t border-border bg-background shadow-2xl outline-hidden overflow-hidden">
              {/* Drawer Handle */}
              <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted-foreground/20" />

              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6">
                <div className="flex flex-col">
                  <span className="font-heading text-2xl font-black italic tracking-tighter text-foreground">Slovor.</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{t('nav:menu') || 'Navigation'}</span>
                </div>
                <Drawer.Close asChild>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-90">
                    <X className="h-5 w-5" />
                  </button>
                </Drawer.Close>
              </div>

              <ScrollArea className="flex-1 px-4">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="pb-32"
                >
                  {/* Marketplace Section */}
                  <div className="space-y-1.5 px-2 py-4">
                    <h3 className="mb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                      {t('common:exploreMarketplace') || 'Marketplace'}
                    </h3>
                    <div className="space-y-1">
                      {NAV_LINKS.main.map(renderLink)}
                    </div>
                  </div>

                  <div className="my-2 h-px bg-linear-to-r from-transparent via-border/40 to-transparent" />

                  {/* Categories Preview */}
                  <div className="px-2 py-4">
                    <div className="mb-4 flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                        {t('nav:categories')}
                      </h3>
                      <Link
                        href={`/${locale}/categories`}
                        onClick={() => onOpenChange(false)}
                        className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                      >
                        {t('common:viewAll')}
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {NAV_LINKS.categories.slice(0, 4).map((cat) => {
                        const Icon = cat.icon
                        return (
                          <motion.div key={cat.id} variants={itemVariants}>
                            <Link
                              href={`/${locale}${cat.href}`}
                              onClick={() => onOpenChange(false)}
                              className="group relative flex h-32 flex-col items-center justify-center gap-3 overflow-hidden rounded-[24px] bg-muted/20 p-4 transition-all hover:bg-muted/40 active:scale-95"
                            >
                              <div className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                                cat.color
                              )}>
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <span className="text-[11px] font-black tracking-tight text-center uppercase">{t(cat.label)}</span>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="my-2 h-px bg-linear-to-r from-transparent via-border/40 to-transparent" />

                  {/* User / Account Section */}
                  <div className="space-y-1.5 px-2 py-4">
                    <h3 className="mb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                      {user ? t('common:account') || 'Account' : t('common:guest') || 'Guest'}
                    </h3>

                    {user ? (
                      <div className="space-y-1.5">
                        {NAV_LINKS.user.map(renderLink)}

                        {config.app.adminEmails.includes(user.email || '') && (
                          <motion.div variants={itemVariants}>
                            <Link
                              href={`/${locale}/admin`}
                              onClick={() => onOpenChange(false)}
                              className="group flex items-center gap-4 rounded-2xl bg-amber-500/10 p-4 text-amber-500 transition-all active:scale-95"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 shadow-lg shadow-amber-500/10 transition-transform group-hover:rotate-3">
                                <Plus className="h-5 w-5 rotate-45" />
                              </div>
                              <span className="font-heading text-base font-bold tracking-tight">{t('common:adminPanel')}</span>
                            </Link>
                          </motion.div>
                        )}

                        <motion.div variants={itemVariants}>
                          <button
                            onClick={() => {
                              signOut()
                              onOpenChange(false)
                            }}
                            className="group mt-2 flex w-full items-center gap-4 rounded-2xl p-4 text-destructive transition-all hover:bg-destructive/5 active:scale-95"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-destructive/10 transition-transform group-hover:rotate-3">
                              <LogOut className="h-5 w-5" />
                            </div>
                            <span className="font-heading text-base font-bold tracking-tight">{t('profile:signOut')}</span>
                          </button>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <motion.div variants={itemVariants}>
                          <Link
                            href={`/${locale}/auth/login`}
                            onClick={() => onOpenChange(false)}
                            className="flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 transition-all active:scale-95"
                          >
                            {t('common:signIn')}
                          </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <Link
                            href={`/${locale}/auth/register`}
                            onClick={() => onOpenChange(false)}
                            className="flex w-full items-center justify-center rounded-2xl bg-muted py-4 text-xs font-black uppercase tracking-widest text-foreground transition-all active:scale-95 border border-border/40"
                          >
                            {t('common:register')}
                          </Link>
                        </motion.div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 border-t border-border/40 px-2 pt-6">
                    <MobileLanguageSelector locale={locale} />
                  </div>
                </motion.div>
              </ScrollArea>

              {/* Persistent Bottom CTA */}
              <div className="absolute inset-x-0 bottom-0 border-t border-border/40 bg-background/80 p-6 backdrop-blur-lg">
                <Link
                  href={`/${locale}/post`}
                  onClick={() => onOpenChange(false)}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  {t('nav:postAd')}
                </Link>
              </div>
            </Drawer.Content>
          )}
        </AnimatePresence>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
