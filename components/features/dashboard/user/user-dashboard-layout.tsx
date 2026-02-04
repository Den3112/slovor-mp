'use client'

import React from 'react'
import { useTranslation } from '@/lib/i18n' // Using project's i18n wrapper
import { DashboardShell } from '@/components/features/dashboard/layouts/dashboard-shell'
import type { SidebarConfig } from '@/components/features/dashboard/shared/sidebar'
import type { DashboardStats } from '@/lib/api/dashboard-stats'
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Heart,
    Star,
    MessageCircle,
    Eye,
    ShieldCheck,
    Settings,
    Zap,
    Bell,
    Activity,
    Rocket,
    Search,
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
                title: t('dashboard:main') || 'Main',
                items: [
                    {
                        href: '/dashboard',
                        label: t('common:dashboard'),
                        icon: LayoutDashboard,
                    },
                    {
                        href: '/dashboard/listings',
                        label: t('profile:myListings'),
                        icon: Package,
                        badgeCount: stats?.activeListings,
                    },
                    {
                        href: '/dashboard/wallet',
                        label: t('profile:wallet'),
                        icon: ShoppingBag,
                    },
                    {
                        href: '/dashboard/subscription',
                        label: t('profile:subscription'),
                        icon: Zap,
                    },
                    {
                        href: '/dashboard/promote',
                        label: t('dashboard:promoteListings'),
                        icon: Rocket,
                    },
                ]
            },
            {
                title: t('common:activityHistory') || 'Activity History',
                items: [
                    {
                        href: '/dashboard/orders',
                        label: t('profile:orders'),
                        icon: ShoppingBag,
                        badgeCount: stats?.orders,
                    },
                    {
                        href: '/dashboard/reviews',
                        label: t('profile:reviews'),
                        icon: Star,
                        badgeCount: stats?.reviews,
                    },
                    {
                        href: '/dashboard/notifications',
                        label: t('common:notifications') || 'Notifications',
                        icon: Bell,
                    },
                    {
                        href: '/dashboard/activity',
                        label: t('common:activityHistory') || 'Activity History',
                        icon: Activity,
                    },
                ]
            },
            {
                title: t('dashboard:quickAccess') || 'Quick Access',
                items: [
                    {
                        href: '/messages',
                        label: t('profile:inbox'),
                        icon: MessageCircle,
                        badgeCount: stats?.messages,
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
                        icon: Search,
                    },
                ]
            },
            {
                title: t('dashboard:account') || 'Account',
                items: [
                    {
                        href: '/dashboard/settings',
                        label: t('profile:settings'),
                        icon: Settings,
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
                ]
            }
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
