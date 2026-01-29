'use client'

import Link from 'next/link'
import { X, LogOut, ChevronRight } from 'lucide-react'
import { config } from '@/lib/config'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Drawer } from 'vaul'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { MobileLanguageSelector } from './language-selector'
import { NAV_LINKS } from '@/lib/constants/nav-links'

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
  const { locale, t } = useTranslation('common')

  const renderLink = (link: typeof NAV_LINKS['main'][0]) => {
    const Icon = link.icon
    const href = `/${locale}${link.href === '/' ? '' : link.href}`
    const isActive = pathname === href || (link.href !== '/' && pathname?.startsWith(href))

    return (
      <Link
        key={link.href}
        href={href}
        onClick={() => onOpenChange(false)}
        className={cn(
          "group flex items-center justify-between rounded-xl p-3 transition-all active:scale-95",
          isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
            isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-background"
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm tracking-wide">
            {t(link.label) || link.label}
          </span>
        </div>
        {isActive && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
      </Link>
    )
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[92vh] flex-col rounded-t-[32px] border-t border-white/10 bg-background outline-hidden">
          {/* Drawer Handle */}
          <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-white/20" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-black">Menu</span>
            </div>
            <Drawer.Close asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </Drawer.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-10">
            {/* Main Links */}
            <div className="space-y-1 py-2">
              {NAV_LINKS.main.map(renderLink)}
            </div>

            <div className="my-4 h-px bg-border/40" />

            {/* Categories Preview */}
            <div className="px-2 pb-2">
              <h3 className="mb-3 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                {t('nav.categories')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {NAV_LINKS.categories.slice(0, 4).map((cat) => {
                  const Icon = cat.icon
                  return (
                    <Link
                      key={cat.id}
                      href={`/${locale}${cat.href}`}
                      onClick={() => onOpenChange(false)}
                      className="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-muted/20 p-5 transition-all hover:bg-muted/40 active:scale-95"
                    >
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-110",
                        cat.color
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs font-black tracking-tight text-center">{t(cat.label)}</span>
                    </Link>
                  )
                })}
              </div>
              <Link
                href={`/${locale}/categories`}
                onClick={() => onOpenChange(false)}
                className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-primary"
              >
                {t('viewAll')} <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="my-4 h-px bg-border/40" />

            {/* User / Auth Links */}
            <div className="space-y-1">
              <h3 className="mb-3 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                {user ? t('account') : t('guest')}
              </h3>

              {user ? (
                <>
                  {NAV_LINKS.user.map(renderLink)}
                  {config.app.adminEmails.includes(user.email || '') && (
                    <Link
                      href={`/${locale}/admin`}
                      onClick={() => onOpenChange(false)}
                      className="group flex items-center gap-3 rounded-xl bg-amber-500/10 p-3 text-amber-500 transition-all active:scale-95"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20">
                        <LogOut className="h-4 w-4 rotate-180" />
                      </div>
                      <span className="font-bold text-sm">{t('adminPanel')}</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      signOut()
                      onOpenChange(false)
                    }}
                    className="group mt-2 flex w-full items-center gap-3 rounded-xl p-3 text-destructive transition-all hover:bg-destructive/5 active:scale-95"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm">{t('signOut')}</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 px-1">
                  <Link
                    href={`/${locale}/auth/login`}
                    onClick={() => onOpenChange(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-primary py-3.5 text-sm font-black uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {t('common.signIn')}
                  </Link>
                  <Link
                    href={`/${locale}/auth/register`}
                    onClick={() => onOpenChange(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-muted/50 py-3.5 text-sm font-black uppercase tracking-wide text-foreground hover:bg-muted active:scale-95 transition-all"
                  >
                    {t('common.register')}
                  </Link>
                </div>
              )}
            </div>

            <div className="my-6 mb-20">
              <MobileLanguageSelector locale={locale} />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
