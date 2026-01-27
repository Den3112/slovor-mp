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

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/listings', label: 'Moderation', icon: ShieldCheck },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/reports', label: 'Reports', icon: AlertTriangle },
        { href: '/admin/verifications', label: 'Verifications', icon: FileCheck },
        { href: '/admin/content', label: 'Content', icon: FileText },
    ]

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === href
        return pathname.startsWith(href)
    }

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/40 md:flex">
            <div className="flex h-14 items-center border-b px-6 font-bold text-lg">
                Admin Panel
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-2">
                    {links.map((link, index) => {
                        const Icon = link.icon
                        return (
                            <Link
                                key={index}
                                href={link.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive(link.href)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="border-t p-4">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
