'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Notification } from '@/lib/api/notifications'
import { getNotificationIcon } from './utils'
import { useTranslation } from '@/lib/i18n'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const { t } = useTranslation(['common', 'dashboard'])
  const { icon: Icon, color, bg } = getNotificationIcon(notification.type)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="group relative"
    >
      <div
        className={cn(
          'flex gap-5 rounded-2xl border p-6 transition-all duration-300',
          notification.is_read
            ? 'bg-card border-border/40 opacity-80'
            : 'bg-primary/5 border-primary/20 shadow-primary/5 shadow-sm'
        )}
      >
        <div
          className={cn(
            'border-border/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-transform group-hover:scale-105',
            bg,
            color
          )}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={cn(
                'line-clamp-1 text-base font-bold tracking-tight',
                notification.is_read ? 'text-foreground/70' : 'text-foreground'
              )}
            >
              {notification.title}
            </h3>
            <Badge
              variant="outline"
              className="border-border/60 hidden rounded-md px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase sm:flex"
            >
              {notification.type}
            </Badge>
          </div>

          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed font-medium">
            {notification.content}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <span className="text-muted-foreground/50 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase">
              <Calendar className="h-3 w-3" />
              {new Date(notification.created_at).toLocaleString()}
            </span>
            {notification.link && (
              <Link
                href={notification.link}
                className="text-primary flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase hover:underline"
              >
                {t('common:viewDetails')}
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {!notification.is_read && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMarkAsRead(notification.id)}
              className="hover:bg-success/10 hover:text-success h-8 w-8 rounded-lg"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(notification.id)}
            className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {!notification.is_read && (
        <div className="bg-primary absolute top-1/2 left-0 h-3 w-1 -translate-x-1 -translate-y-1/2 rounded-r-full" />
      )}
    </motion.div>
  )
}
