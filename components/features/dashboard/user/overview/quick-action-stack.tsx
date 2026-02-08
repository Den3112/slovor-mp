import Link from 'next/link'
import { Plus, TrendingUp, MessageCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

export function QuickActionStack() {
  const { t, locale } = useTranslation([
    'common',
    'dashboard',
    'createListing',
    'profile',
  ])

  const actions = [
    {
      href: `/${locale}/post`,
      label: t('createListing:publish'),
      icon: Plus,
      color: 'bg-primary text-primary-foreground',
      hover: 'hover:bg-primary/90',
    },
    {
      href: `/${locale}/dashboard/promote`,
      label: t('dashboard:promoteListings'),
      icon: TrendingUp,
      color: 'bg-emerald-500 text-white',
      hover: 'hover:bg-emerald-600',
    },
    {
      href: `/${locale}/dashboard/messages`,
      label: t('profile:inbox'),
      icon: MessageCircle,
      color: 'bg-blue-500 text-white',
      hover: 'hover:bg-blue-600',
    },
    {
      href: `/${locale}/dashboard/settings`,
      label: t('profile:settings'),
      icon: Settings,
      color: 'bg-zinc-800 text-white',
      hover: 'hover:bg-zinc-900',
    },
  ]

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="mb-4">
        <h3 className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
          {t('dashboard:quickActions')}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, idx) => (
          <Button
            key={idx}
            asChild
            className={cn(
              'h-12 w-full justify-start gap-4 rounded-2xl px-4 text-xs font-bold tracking-widest uppercase transition-all duration-300',
              action.color,
              action.hover
            )}
          >
            <Link href={action.href}>
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}

import { cn } from '@/lib/utils'
