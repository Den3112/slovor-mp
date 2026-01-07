'use client'

import Link from 'next/link'
import { X, LogOut, LayoutDashboard, Heart } from 'lucide-react'
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
                        <nav className="space-y-2">
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
                                            'flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-bold transition-all',
                                            isActive
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                : 'text-foreground hover:bg-muted'
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {link.label}
                                    </Link>
                                )
                            })}

                            {user && (
                                <>
                                    <div className="my-4 h-px bg-border/50" />
                                    <Link
                                        href="/profile"
                                        onClick={() => onOpenChange(false)}
                                        className="flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-bold text-foreground transition-all hover:bg-muted"
                                    >
                                        <LayoutDashboard className="h-5 w-5" />
                                        {t.common.profile}
                                    </Link>
                                    <Link
                                        href="/profile/favorites"
                                        onClick={() => onOpenChange(false)}
                                        className="flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-bold text-foreground transition-all hover:bg-muted"
                                    >
                                        <Heart className="h-5 w-5" />
                                        Favorites
                                    </Link>
                                </>
                            )}
                        </nav>

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
