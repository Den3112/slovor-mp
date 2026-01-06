'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import {
    LogOut,
    Settings,
    LayoutDashboard,
    Heart,
    Store,
    Eye,
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'

interface UserMenuProps {
    user: SupabaseUser
    signOut: () => void
}

export function UserMenu({ user, signOut }: UserMenuProps) {
    const { t } = useTranslation()
    const [showUserMenu, setShowUserMenu] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                aria-label="User menu"
                aria-expanded={showUserMenu}
                className="group flex items-center gap-2"
            >
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary via-violet-500 to-indigo-500 p-[1.5px] shadow-lg shadow-primary/10 transition-transform group-hover:scale-105">
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-primary/10 bg-card font-black text-primary">
                        {user.user_metadata?.avatar_url ? (
                            <Image
                                src={user.user_metadata.avatar_url}
                                alt="User avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span aria-hidden="true">{user.email?.[0]?.toUpperCase()}</span>
                        )}
                    </div>
                </div>
            </button>
            <AnimatePresence>
                {showUserMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="shadow-premium absolute right-0 z-50 mt-3 w-60 overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-2xl"
                    >
                        <div className="border-b border-border/50 bg-muted/30 px-5 py-4">
                            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                {t.auth.signedInAs}
                            </p>
                            <p className="truncate text-sm font-bold text-foreground">
                                {user.email}
                            </p>
                        </div>
                        <div className="p-2 space-y-0.5">
                            <Link
                                href="/dashboard/overview"
                                className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-primary/5 hover:text-primary"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <LayoutDashboard className="h-4 w-4 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-primary" />
                                {t.common.dashboard}
                            </Link>

                            <Link
                                href="/dashboard/listings"
                                className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-primary/5 hover:text-primary"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <Store className="h-4 w-4 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-primary" />
                                My Listings
                            </Link>

                            <Link
                                href="/dashboard/favorites"
                                className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-primary/5 hover:text-primary"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <Heart className="h-4 w-4 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-primary" />
                                Favorites
                            </Link>

                            <div className="mx-2 my-1 h-px bg-border/50" />

                            <Link
                                href="/dashboard/profile"
                                className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-primary/5 hover:text-primary"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <Eye className="h-4 w-4 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-primary" />
                                Public Profile
                            </Link>

                            <Link
                                href="/dashboard/settings"
                                className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-primary/5 hover:text-primary"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <Settings className="h-4 w-4 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-primary" />
                                Settings
                            </Link>

                            <div className="mx-2 my-1 h-px bg-border/50" />

                            <button
                                onClick={() => signOut()}
                                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-destructive transition-all hover:bg-destructive/5"
                            >
                                <LogOut className="h-4 w-4" />
                                {t.auth.signOut}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
