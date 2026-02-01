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
} from 'lucide-react'


interface AdminDashboardLayoutProps {
    children: React.ReactNode
}

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
    const { t } = useTranslation(['common', 'admin'])

    const config: SidebarConfig = {
        signOutLabel: t('admin:signOut'),
        items: [
            { href: '/admin', label: t('admin:dashboard'), icon: LayoutDashboard },
            { href: '/admin/listings', label: t('admin:moderation'), icon: ShieldCheck },
            { href: '/admin/users', label: t('admin:users'), icon: Users },
            { href: '/admin/reports', label: t('admin:reports'), icon: AlertTriangle },
            { href: '/admin/verifications', label: t('admin:verifications'), icon: FileCheck },
            { href: '/admin/content', label: t('admin:content'), icon: FileText },
        ],
    }

    return (
        <DashboardShell config={config} title={t('adminDashboard')}>
            {children}
        </DashboardShell>
    )
}
