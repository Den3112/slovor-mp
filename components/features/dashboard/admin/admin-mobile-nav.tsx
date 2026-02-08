'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  AlertTriangle,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

interface AdminMobileNavProps {
  onMenuClick?: () => void
}

export function AdminMobileNav({ onMenuClick }: AdminMobileNavProps) {
  const pathname = usePathname()
  const { t, locale } = useTranslation(['common', 'admin'])

  const isActive = (href: string) => {
    const cleanPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
    return cleanPathname === href || cleanPathname.startsWith(href + '/')
  }

  const navItems = [
    { href: '/admin', label: t('admin:dashboard'), icon: LayoutDashboard },
    {
      href: '/admin/listings',
      label: t('admin:moderation'),
      icon: ShieldCheck,
    },
    { href: '/admin/users', label: t('admin:users'), icon: Users },
    { href: '/admin/reports', label: t('admin:reports'), icon: AlertTriangle },
  ]

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 md:hidden">
      {/* Solid Background */}
      <div className="bg-card border-border absolute inset-0 border-t shadow-[0_-5px_20px_rgba(0,0,0,0.05)]" />

      <nav className="pb-safe relative flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                'flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors active:scale-95',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', active && 'fill-primary/10')} />
              <span className="max-w-[60px] truncate text-[9px] font-bold tracking-widest uppercase">
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* More / Menu Trigger (opens the Drawer in DashboardShell) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-none hover:bg-transparent active:scale-95"
        >
          <Menu className="text-muted-foreground h-5 w-5" />
          <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">
            {t('common:more')}
          </span>
        </Button>
      </nav>
    </div>
  )
}
