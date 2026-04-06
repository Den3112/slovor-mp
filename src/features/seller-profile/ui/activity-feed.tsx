'use client'

import { MessageSquare, Heart, Info, DollarSign } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { motion } from 'framer-motion'
import { useTranslation } from '@/shared/lib/i18n'

interface ActivityItem {
  id: string
  type: 'message' | 'like' | 'system' | 'sale'
  title: string
  description: string
  time: string
  isUnread: boolean
}

export function ActivityFeed() {
  const { t } = useTranslation(['dashboard'])

  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'message',
      title: t('dashboard:activityLog.entries.newMessage'),
      description: t('dashboard:activityLog.entries.newMessageDesc', {
        user: 'Peter',
        item: 'iPhone 15',
      }),
      time: '2m',
      isUnread: true,
    },
    {
      id: '2',
      type: 'sale',
      title: t('dashboard:activityLog.entries.itemsSold'),
      description: t('dashboard:activityLog.entries.saleDesc', {
        item: 'Acoustic Guitar',
        user: '@marek_s',
      }),
      time: '45m',
      isUnread: true,
    },
    {
      id: '3',
      type: 'like',
      title: t('dashboard:activityLog.entries.listingFavorited'),
      description: t('dashboard:activityLog.entries.favoriteDesc', {
        item: 'MacBook M3',
        count: 5,
      }),
      time: '1h',
      isUnread: false,
    },
    {
      id: '4',
      type: 'system',
      title: t('dashboard:activityLog.entries.listingExpiring'),
      description: t('dashboard:activityLog.entries.expiringDesc', {
        item: 'Vintage Watch',
        days: 2,
      }),
      time: '3h',
      isUnread: false,
    },
  ]

  return (
    <div className="space-y-1">
      {activities.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={cn(
            'group relative flex items-start gap-4 rounded-xl p-3 transition-all duration-200',
            'hover:bg-accent/50 hover:border-border/50 border border-transparent',
            item.isUnread && 'bg-primary/5'
          )}
        >
          <div
            className={cn(
              'mt-1 shrink-0 rounded-xl p-2',
              item.type === 'message' && 'bg-primary/10 text-primary',
              item.type === 'like' && 'bg-pink-500/10 text-pink-500',
              item.type === 'system' && 'bg-amber-500/10 text-amber-500',
              item.type === 'sale' && 'bg-success/10 text-success'
            )}
          >
            {item.type === 'message' && <MessageSquare className="h-4 w-4" />}
            {item.type === 'like' && <Heart className="h-4 w-4" />}
            {item.type === 'system' && <Info className="h-4 w-4" />}
            {item.type === 'sale' && <DollarSign className="h-4 w-4" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <h4
                className={cn(
                  'truncate text-xs font-bold tracking-tight transition-colors',
                  item.isUnread
                    ? 'text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {item.title}
              </h4>
              <span className="text-muted-foreground/50 ml-2 text-[10px] font-bold tracking-widest whitespace-nowrap uppercase">
                {item.time}
              </span>
            </div>
            <p className="text-muted-foreground/80 mt-0.5 line-clamp-1 text-[11px] leading-relaxed">
              {item.description}
            </p>
          </div>

          {item.isUnread && (
            <div className="bg-primary absolute top-3 right-2 h-1.5 w-1.5 rounded-full" />
          )}
        </motion.div>
      ))}
    </div>
  )
}
