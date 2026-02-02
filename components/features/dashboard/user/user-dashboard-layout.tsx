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
                ]
            },
            {
                title: t('dashboard:activity') || 'Activity',
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
