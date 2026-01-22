'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

import {
    LayoutDashboard,
    Heart,
    Settings,
    Package,
    LogOut,
    Eye,
    MessageCircle,
    ShoppingBag,
    Store,
    Star
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavItem {
    href: string
    label: string
    icon: React.ElementType
    external?: boolean
}

interface NavSection {
    title?: string
    items: NavItem[]
}

import type { DashboardStats } from '@/lib/api/dashboard-stats'

interface DashboardSidebarProps {
    stats?: DashboardStats
}

export function DashboardSidebar({ stats }: DashboardSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    // Map stats to routes
    const getBadgeCount = (href: string) => {
        if (!stats) return 0
        switch (href) {
            case '/profile/my-listings': return stats.activeListings
            case '/profile/favorites': return stats.favorites
            case '/profile/orders': return stats.orders
            case '/profile/messages': return stats.messages
            case '/profile/saved-searches': return stats.savedSearches
            case '/profile/reviews': return stats.reviews
            default: return 0
        }
    }

    /* Premium Marketplace Sidebar Structure */
    const sections: NavSection[] = [
        {
            title: 'Overview', // Optional title for first section
            items: [
                {
                    href: '/profile/overview',
                    label: 'Dashboard',
                    icon: LayoutDashboard,
                },
            ]
        },
        {
            title: 'Commerce',
            items: [
                {
                    href: '/profile/my-listings',
                    label: 'My Listings',
                    icon: Store, // Changed to Store for "My Shop" feel
                },
                {
                    href: '/profile/orders',
                    label: 'Orders',
                    icon: Package,
                },
                {
                    href: '/profile/wallet',
                    label: 'Wallet',
                    icon: ShoppingBag, // Temporary, maybe use Wallet icon if available or DollarSign
                },
            ]
        },
        {
            title: 'Shopping',
            items: [
                {
                    href: '/profile/purchases',
                    label: 'Purchases',
                    icon: ShoppingBag,
                },
                {
                    href: '/profile/favorites',
                    label: 'Favorites',
                    icon: Heart,
                },
                {
                    href: '/profile/saved-searches',
                    label: 'Saved Searches',
                    icon: Star,
                },
            ]
        },
        {
            title: 'Communication',
            items: [
                {
                    href: '/profile/messages',
                    label: 'Inbox',
                    icon: MessageCircle,
                },
                {
                    href: '/profile/reviews',
                    label: 'Reviews',
                    icon: Star, // Need to import Star
                },
            ]
        },
        {
            title: 'Account',
            items: [
                {
                    href: '/profile/profile',
                    label: 'Public Profile',
                    icon: Eye,
                },
                {
                    href: '/profile/settings',
                    label: 'Settings',
                    icon: Settings,
                }
            ]
        }
    ]

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const isActiveLink = (href: string) => {
        if (href === '/profile/overview') return pathname === href
        return pathname.startsWith(href)
    }

    return (
        <>
            {/* Mobile Nav is now handled by MobileBottomNav component */}

            {/* Desktop: Full sidebar */}
            <aside className="hidden md:block w-72 flex-shrink-0">
                <div className="border-2 border-primary/10 bg-zinc-950 p-6 shadow-2xl sticky top-28 overflow-hidden group/sidebar">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="space-y-8 relative z-10">
                        {sections.map((section, idx) => (
                            <div key={idx}>
                                {section.title && (
                                    <h3 className="px-4 mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                                        {section.title}
                                    </h3>
                                )}
                                <nav className="space-y-1.5">
                                    {section.items.map((link) => {
                                        const Icon = link.icon
                                        const active = isActiveLink(link.href)
                                        const count = getBadgeCount(link.href)

                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={cn(
                                                    'flex items-center gap-4 border-2 px-4 py-4 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 group relative',
                                                    active
                                                        ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                                                        : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5 hover:border-white/10'
                                                )}
                                            >
                                                <Icon className={cn("relative z-10 h-4 w-4 transition-transform duration-300 group-hover:scale-110", active ? "text-white" : "text-zinc-500 group-hover:text-white")} />
                                                <span className="relative z-10 flex-1">{link.label}</span>

                                                {/* Counter Badge */}
                                                {count > 0 && (
                                                    <span className={cn(
                                                        "relative z-10 px-2.5 py-1 border font-sans text-[10px] font-bold min-w-[24px] text-center",
                                                        active
                                                            ? "border-white/30 bg-white/20 text-white"
                                                            : "border-primary/30 bg-primary/10 text-primary group-hover:bg-primary/20"
                                                    )}>
                                                        {count}
                                                    </span>
                                                )}

                                                {/* Active Indicator Bar */}
                                                {active && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                                                )}
                                            </Link>
                                        )
                                    })}
                                </nav>
                            </div>
                        ))}
                    </div>

                    <div className="my-8 border-t-2 border-primary/10" />

                    <button
                        onClick={handleSignOut}
                        className="relative z-10 flex w-full items-center gap-4 border-2 border-transparent px-4 py-4 font-sans text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-destructive hover:bg-destructive/5 hover:border-destructive/20 transition-all group"
                    >
                        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    )
}
