'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Store,
    Plus,
    MessageCircle,
    Menu
} from 'lucide-react'
import { MobileMenuDrawer } from './mobile-menu-drawer'

import type { DashboardStats } from '@/lib/api/dashboard-stats'

interface MobileBottomNavProps {
    stats?: DashboardStats
}

export function MobileBottomNav({ stats }: MobileBottomNavProps) {
    const pathname = usePathname()
    const [open, setOpen] = React.useState(false)

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
            {/* Architectural Background */}
            <div className="absolute inset-0 bg-zinc-950 border-t-2 border-primary/20 shadow-[0_-5px_30px_rgba(0,0,0,0.5)]" />

            <nav className="relative h-[88px] pb-[28px] px-2 flex items-center justify-around">
                {/* 1. Dashboard */}
                <Link
                    href="/profile/overview"
                    className={cn(
                        "flex flex-col items-center justify-center w-16 h-full gap-1.5 transition-all active:scale-95",
                        isActive('/profile/overview') ? "text-primary" : "text-zinc-500 hover:text-white"
                    )}
                >
                    <LayoutDashboard className={cn("h-6 w-6")} />
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Home</span>
                </Link>

                {/* 2. My Listings - Show Badge */}
                <Link
                    href="/profile/my-listings"
                    className={cn(
                        "flex flex-col items-center justify-center w-16 h-full gap-1.5 transition-all active:scale-95 relative",
                        isActive('/profile/my-listings') ? "text-primary" : "text-zinc-500 hover:text-white"
                    )}
                >
                    <div className="relative">
                        <Store className={cn("h-6 w-6")} />
                        {stats && stats.activeListings > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center border border-white/20 bg-primary font-sans text-[9px] font-bold text-white shadow-lg">
                                {stats.activeListings}
                            </span>
                        )}
                    </div>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Selling</span>
                </Link>

                {/* 3. CORE ACTION: POST AD */}
                <div className="relative -top-6">
                    <Link href="/post">
                        <div className="h-14 w-14 bg-primary shadow-xl shadow-primary/20 flex items-center justify-center text-white active:scale-95 transition-all border-2 border-white/10 hover:-translate-y-1">
                            <Plus className="h-8 w-8 stroke-[3]" />
                        </div>
                    </Link>
                </div>

                {/* 4. Inbox - Show Badge */}
                <Link
                    href="/profile/messages"
                    className={cn(
                        "flex flex-col items-center justify-center w-16 h-full gap-1.5 transition-all active:scale-95",
                        isActive('/profile/messages') ? "text-primary" : "text-zinc-500 hover:text-white"
                    )}
                >
                    <div className="relative">
                        <MessageCircle className={cn("h-6 w-6")} />
                        {stats && stats.messages > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center border border-white/20 bg-primary font-sans text-[9px] font-bold text-white shadow-lg">
                                {stats.messages}
                            </span>
                        )}
                    </div>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Inbox</span>
                </Link>

                {/* 5. Menu Drawer Trigger */}
                <MobileMenuDrawer open={open} setOpenAction={setOpen} stats={stats}>
                    <button
                        className={cn(
                            "flex flex-col items-center justify-center w-16 h-full gap-1.5 transition-all active:scale-95",
                            open ? "text-primary" : "text-zinc-500 hover:text-white"
                        )}
                    >
                        <Menu className="h-6 w-6" />
                        <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Menu</span>
                    </button>
                </MobileMenuDrawer>
            </nav>
        </div>
    )
}
