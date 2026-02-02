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
                href: '/dashboard',
                label: t('common:dashboard'),
                icon: LayoutDashboard,
            },
            {
                href: '/dashboard/listings',
                label: t('profile:myListings'),
                icon: Store,
                badgeCount: stats?.activeListings,
            },
            {
                href: '/dashboard/orders',
                label: t('profile:orders'),
                icon: Package,
                badgeCount: stats?.orders,
            },
            {
                href: '/dashboard/wallet',
                label: t('profile:wallet'),
                icon: ShoppingBag,
            },
            {
                href: '/dashboard/purchases',
                label: t('profile:purchases'),
                icon: ShoppingBag,
            },
            {
                href: '/favorites',
                label: t('profile:favorites'),
                icon: Heart,
                badgeCount: stats?.favorites,
            },
            {
                href: '/dashboard/saved-searches',
                label: t('profile:savedSearches'),
                icon: Star,
                badgeCount: stats?.savedSearches,
            },
            {
                href: '/messages',
                label: t('profile:inbox'),
                icon: MessageCircle,
                badgeCount: stats?.messages,
            },
            {
                href: '/dashboard/reviews',
                label: t('profile:reviews'),
                icon: Star,
                badgeCount: stats?.reviews,
            },
            {
                href: '/dashboard/profile',
                label: t('profile:publicProfile'),
                icon: Eye,
                external: true,
            },
            {
                href: '/dashboard/verification',
                label: t('profile:verification'),
                icon: ShieldCheck,
            },
            {
                href: '/dashboard/settings',
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
