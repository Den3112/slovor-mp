'use client'

import React from 'react'
import { useTranslation } from '@/lib/i18n' // Using project's i18n wrapper
import { DashboardShell } from '@/components/features/dashboard/layouts/dashboard-shell'
import type { SidebarConfig } from '@/components/features/dashboard/shared/sidebar'
import type { DashboardStats } from '@/lib/api/dashboard-stats'
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
        items: [
            {
                href: '/profile/overview',
                label: t('common:dashboard'),
                icon: LayoutDashboard,
            },
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
            },
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
            {
                href: '/profile/profile',
                label: t('profile:publicProfile'),
                icon: Eye,
                external: true,
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
    }

    return (
        <DashboardShell
            config={config}
        >
            {children}
        </DashboardShell>
    )
}
