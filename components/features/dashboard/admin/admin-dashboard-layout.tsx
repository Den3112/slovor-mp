'use client'

import { useTranslation } from '@/lib/i18n'
import { DashboardShell } from '@/components/features/dashboard/layouts/dashboard-shell'
import type { SidebarConfig } from '@/components/features/dashboard/shared/sidebar'
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  AlertTriangle,
  FileCheck,
  FileText,
  ShoppingBag,
  Layers,
  LifeBuoy,
  BarChart3,
  Activity,
  Settings,
} from 'lucide-react'

interface AdminDashboardLayoutProps {
  children: React.ReactNode
}

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const { t } = useTranslation(['common', 'admin'])

  const config: SidebarConfig = {
    signOutLabel: t('admin:signOut'),
    sections: [
      {
        title: t('admin:overview'),
        items: [
          {
            href: '/admin',
            label: t('admin:dashboard'),
            icon: LayoutDashboard,
          },
          {
            href: '/admin/monitor',
            label: t('admin:liveMonitor'),
            icon: Activity,
          },
          {
            href: '/admin/analytics',
            label: t('admin:analytics'),
            icon: BarChart3,
          },
        ],
      },
      {
        title: t('admin:operations') || 'OPERATIONS',
        items: [
          {
            href: '/admin/listings',
            label: t('admin:moderation'),
            icon: ShieldCheck,
          },
          {
            href: '/admin/verifications',
            label: t('admin:verifications'),
            icon: FileCheck,
          },
          {
            href: '/admin/reports',
            label: t('admin:reports'),
            icon: AlertTriangle,
          },
        ],
      },
      {
        title: t('admin:platform') || 'PLATFORM',
        items: [
          { href: '/admin/users', label: t('admin:users'), icon: Users },
          {
            href: '/admin/categories',
            label: t('admin:categories'),
            icon: Layers,
          },
          {
            href: '/admin/orders',
            label: t('admin:marketplace'),
            icon: ShoppingBag,
          },
        ],
      },
      {
        title: t('admin:system') || 'SYSTEM',
        items: [
          { href: '/admin/content', label: t('admin:content'), icon: FileText },
          {
            href: '/admin/support',
            label: t('admin:supportTickets'),
            icon: LifeBuoy,
          },
          {
            href: '/admin/settings',
            label: t('admin:settings'),
            icon: Settings,
          },
        ],
      },
    ],
  }

  return (
    <DashboardShell config={config} title={t('admin:controlCenter') || 'Mission Control'}>
      {children}
    </DashboardShell>
  )
}
