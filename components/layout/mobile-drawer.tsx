'use client'

import Link from 'next/link'
import { X, LogOut, LayoutDashboard, Heart, Star } from 'lucide-react'
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
    const { locale, setLocale, t } = useTranslation()

    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
                <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[85vh] flex-col rounded-t-[2rem] border-t border-border bg-background">
                    {/* Drawer Handle */}
                    <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted-foreground/20" />

                    {/* Accessibility Title */}
                    <Drawer.Title className="sr-only">Navigation Menu</Drawer.Title>

                    {/* Drawer Header */}
                    <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
                        <Link
                            href="/"
                            onClick={() => onOpenChange(false)}
                            className="flex items-center gap-2"
                        >
                            <div className="relative h-8 w-8">
                                <div className="absolute inset-0 rotate-6 rounded-xl bg-gradient-to-tr from-primary via-violet-500 to-primary" />
                                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-card text-lg font-black">
                                    S
                                </div>
                            </div>
                            <span className="font-heading text-xl font-black tracking-tighter">
                                Slovor<span className="text-primary">.</span>
                            </span>
                        </Link>
                        <Drawer.Close asChild>
                            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 text-muted-foreground">
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
                                <h3 className="px-2 mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground/70">
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
                                                    "flex flex-col gap-2 p-4 rounded-2xl border transition-all active:scale-95",
                                                    isActive
                                                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                                                        : "bg-muted/30 border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                <Icon className="h-6 w-6" />
                                                <span className="font-bold text-sm">{link.label}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>

                            {user && (
                                <div>
                                    <h3 className="px-2 mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground/70">
                                        Account
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/profile"
                                            onClick={() => onOpenChange(false)}
                                            className="flex flex-col gap-2 p-4 rounded-2xl border bg-muted/30 border-transparent hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95"
                                        >
                                            <LayoutDashboard className="h-6 w-6" />
                                            <span className="font-bold text-sm">{t.common.profile}</span>
                                        </Link>
                                        <Link
                                            href="/profile/favorites"
                                            onClick={() => onOpenChange(false)}
                                            className="flex flex-col gap-2 p-4 rounded-2xl border bg-muted/30 border-transparent hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95"
                                        >
                                            <Heart className="h-6 w-6" />
                                            <span className="font-bold text-sm">Favorites</span>
                                        </Link>
                                        <Link
                                            href="/profile/saved-searches"
                                            onClick={() => onOpenChange(false)}
                                            className="flex flex-col gap-2 p-4 rounded-2xl border bg-muted/30 border-transparent hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95 col-span-2"
                                        >
                                            <Star className="h-6 w-6" />
                                            <span className="font-bold text-sm">Saved Searches</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Language Selector */}
                        <MobileLanguageSelector locale={locale} setLocale={setLocale} />
                    </div>

                    {/* Drawer Footer */}
                    <div className="border-t border-border/50 p-6 safe-bottom">
                        {!user && (
                            <Link
                                href="/login"
                                className="mt-3 block w-full rounded-2xl border border-border/50 bg-muted/30 py-4 text-center text-base font-bold text-foreground transition-colors active:bg-muted"
                                onClick={() => onOpenChange(false)}
                            >
                                {t.auth.hasAccount}{' '}
                                <span className="text-primary">{t.auth.signIn}</span>
                            </Link>
                        )}

                        {user && (
                            <button
                                onClick={() => {
                                    signOut()
                                    onOpenChange(false)
                                }}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 py-4 text-base font-bold text-destructive transition-colors active:bg-destructive/5"
                            >
                                <LogOut className="h-4 w-4" />
                                {t.auth.signOut}
                            </button>
                        )}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
