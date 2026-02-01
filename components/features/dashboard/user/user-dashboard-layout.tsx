'use client'

import React from 'react'
import { useTranslation } from '@/lib/i18n' // Using project's i18n wrapper
import { DashboardShell } from '@/components/features/dashboard/layouts/dashboard-shell'
import type { SidebarConfig } from '@/components/features/dashboard/shared/sidebar'
import type { DashboardStats } from '@/lib/api/dashboard-stats'
import { MobileBottomNav } from '@/components/profile/mobile-nav' // Reuse for now as per plan to keep distinct mobile nav style
import {
    LayoutDashboard,
    Store,
    Package,
    ShoppingBag,
    Heart,
    Star,
    MessageCircle,
    Eye,
    ShieldCheck,
    Settings,
} from 'lucide-react'

interface UserDashboardLayoutProps {
    children: React.ReactNode
    stats: DashboardStats
}

export function UserDashboardLayout({ children, stats }: UserDashboardLayoutProps) {
    const { t } = useTranslation(['common', 'profile', 'dashboard', 'auth'])

    const config: SidebarConfig = {
        signOutLabel: t('auth:signOut'),
        sections: [
            {
                title: t('profile:overview'),
                items: [
                    {
                        href: '/profile/overview',
                        label: t('common:dashboard'),
                        icon: LayoutDashboard,
                    },
                ],
            },
            {
                title: t('profile:commerce'),
                items: [
                    {
                        href: '/profile/listings',
                        label: t('profile:myListings'),
                        icon: Store,
                        badgeCount: stats?.activeListings,
                    },
                    {
                        href: '/profile/orders',
                        label: t('profile:orders'),
                        icon: Package,
                        badgeCount: stats?.orders,
                    },
                    {
                        href: '/profile/wallet',
                        label: t('profile:wallet'),
                        icon: ShoppingBag,
                        // badgeCount: 0
                    },
                ],
            },
            {
                title: t('profile:shopping'),
                items: [
                    {
                        href: '/profile/purchases',
                        label: t('profile:purchases'),
                        icon: ShoppingBag,
                    },
                    {
                        href: '/profile/favorites',
                        label: t('profile:favorites'),
                        icon: Heart,
                        badgeCount: stats?.favorites,
                    },
                    {
                        href: '/profile/saved-searches',
                        label: t('profile:savedSearches'),
                        icon: Star,
                        badgeCount: stats?.savedSearches,
                    },
                ],
            },
            {
                title: t('profile:communication'),
                items: [
                    {
                        href: '/profile/messages',
                        label: t('profile:inbox'),
                        icon: MessageCircle,
                        badgeCount: stats?.messages,
                    },
                    {
                        href: '/profile/reviews',
                        label: t('profile:reviews'),
                        icon: Star,
                        badgeCount: stats?.reviews,
                    },
                ],
            },
            {
                title: t('profile:account'),
                items: [
                    {
                        href: '/profile/profile',
                        label: t('profile:publicProfile'),
                        icon: Eye,
                        external: true, // Though it's internal link, semantically "View Public"
                    },
                    {
                        href: '/profile/verification',
                        label: t('profile:verification'),
                        icon: ShieldCheck,
                    },
                    {
                        href: '/profile/settings',
                        label: t('profile:settings'),
                        icon: Settings,
                    },
                ],
            },
        ],
    }

    return (
        <DashboardShell
            config={config}
            mobileNav={<MobileBottomNav stats={stats} />}
        >
            {children}
        </DashboardShell>
    )
}
