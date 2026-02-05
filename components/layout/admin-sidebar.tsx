'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    ShieldCheck,
    Users,
    FileText,
    LogOut,
    AlertTriangle,
    FileCheck
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'


import { useTranslation } from '@/lib/i18n'

interface AdminSidebarProps {
    className?: string
    onNavigate?: () => void
}

export function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { t } = useTranslation('common')

    const links = [
        { href: '/admin', label: t('admin.dashboard'), icon: LayoutDashboard },
        { href: '/admin/listings', label: t('admin.moderation'), icon: ShieldCheck },
        { href: '/admin/users', label: t('admin.users'), icon: Users },
        { href: '/admin/reports', label: t('admin.reports'), icon: AlertTriangle },
        { href: '/admin/verifications', label: t('admin.verifications'), icon: FileCheck },
        { href: '/admin/content', label: t('admin.content'), icon: FileText },
    ]

    const isActive = (href: string) => {
        const cleanPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
        if (href === '/admin') return cleanPathname === '/admin' || cleanPathname === '/admin/'
        return cleanPathname.startsWith(href)
    }

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        onNavigate?.()
    }

    return (
        <aside className={cn("flex flex-col h-fit overflow-hidden bg-card border-r border-border", className)}>
            <div className="flex h-16 items-center px-6 border-b border-border bg-card">
                <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                    {t('admin.panel')}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-muted/10">
                <nav className="space-y-1">
                    {links.map((link, index) => {
                        const Icon = link.icon
                        const active = isActive(link.href)

                        return (
                            <Link
                                key={index}
                                href={link.href}
                                className={cn(
                                    'group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200 border border-transparent',
                                    active
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:bg-white hover:text-foreground hover:border-slate-200 hover:shadow-sm'
                                )}
                                onClick={onNavigate}
                            >
                                <Icon className={cn(
                                    "h-4 w-4 transition-transform duration-300",
                                    active && ""
                                )} />
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="p-4 mt-auto border-t border-border bg-card space-y-1">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-rose-600 transition-all duration-200 hover:bg-rose-50"
                >
                    <LogOut className="h-4 w-4" />
                    {t('admin.signOut')}
                </button>
            </div>
        </aside >
    )
}

