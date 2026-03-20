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
  Rocket,
  Clock,
} from 'lucide-react'

interface UserDashboardLayoutProps {
  children: React.ReactNode
  stats: DashboardStats
}

export function UserDashboardLayout({
  children,
  stats,
}: UserDashboardLayoutProps) {
  const { t } = useTranslation(['common', 'profile', 'dashboard', 'auth'])

  const config: SidebarConfig = {
    signOutLabel: t('auth:signOut'),
    sections: [
      {
        title: t('dashboard:growth'),
        items: [
          {
            href: '/dashboard',
            label: t('common:dashboard'),
            icon: LayoutDashboard,
          },
          {
            href: '/dashboard/analytics',
            label: t('dashboard:marketInsights'),
            icon: Zap,
          },
        ],
      },
      {
        title: t('dashboard:selling'),
        items: [
          {
            href: '/dashboard/listings',
            label: t('profile:myListings'),
            icon: Package,
            badgeCount: stats?.activeListings,
          },
          {
            href: '/dashboard/promote',
            label: t('dashboard:promoteListings'),
            icon: Rocket,
          },
        ],
      },
      {
        title: t('dashboard:activity'),
        items: [
          {
            href: '/dashboard/orders',
            label: t('dashboard:ordersAndSales'),
            icon: ShoppingBag,
            badgeCount: stats?.orders,
          },
          {
            href: '/dashboard/messages',
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
            href: '/dashboard/notifications',
            label: t('common:notifications'),
            icon: Bell,
          },
          {
            href: '/dashboard/activity',
            label: t('dashboard:activityLog.title'),
            icon: Clock,
          },
        ],
      },
      {
        title: t('dashboard:account'),
        items: [
          {
            href: '/dashboard/wallet',
            label: t('profile:wallet'),
            icon: ShoppingBag,
          },
          {
            href: '/dashboard/favorites',
            label: t('profile:favorites'),
            icon: Heart,
            badgeCount: stats?.favorites,
          },
          {
            href: '/dashboard/settings',
            label: t('profile:settings'),
            icon: Settings,
          },
          {
            href: '/dashboard/profile',
            label: t('profile:publicProfile'),
            icon: Eye,
          },
          {
            href: '/dashboard/verification',
            label: t('profile:verification'),
            icon: ShieldCheck,
          },
        ],
      },
    ],
  }

  return <DashboardShell config={config}>{children}</DashboardShell>
}
