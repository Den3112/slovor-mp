'use client'

import { AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { useTranslation } from '@/lib/i18n'
import type { Notification } from '@/lib/api/notifications'
import { NotificationItem } from './notification-item'

interface NotificationListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
}: NotificationListProps) {
  const { t } = useTranslation(['dashboard'])

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title={t('dashboard:notifications.emptyTitle')}
        description={t('dashboard:notifications.emptyDesc')}
      />
    )
  }

  return (
    <div className="grid gap-4">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
