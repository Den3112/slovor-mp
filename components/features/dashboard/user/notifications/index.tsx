'use client'

import { useState, useEffect, useCallback } from 'react'
import { notificationsApi, type Notification } from '@/lib/api/notifications'
import { useAuth } from '@/components/providers/auth-provider'
import { useTranslation } from '@/lib/i18n'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { NotificationList } from './notification-list'

export function NotificationsView() {
  const { t } = useTranslation(['common', 'dashboard'])
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadNotifications = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    const { data } = await notificationsApi.getNotifications(user.id)
    if (data) setNotifications(data)
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const handleMarkAsRead = async (id: string) => {
    const { error } = await notificationsApi.markAsRead(id)
    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
    }
  }

  const handleMarkAllAsRead = async () => {
    const { error } = await notificationsApi.markAllAsRead(user!.id)
    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      toast.success(
        t('dashboard:notifications.markedAllRead') || 'All marked as read'
      )
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await notificationsApi.delete(id)
    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      toast.success(
        t('dashboard:notifications.deleted') || 'Notification deleted'
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
            {t('dashboard:notifications.title')}
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('dashboard:notifications.subtitle')}
          </p>
        </div>
        {notifications.some((n) => !n.is_read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="border-border/60 h-10 rounded-lg px-6 text-[10px] font-bold tracking-widest uppercase"
          >
            <Check className="mr-2 h-4 w-4" />
            {t('dashboard:notifications.markAllRead')}
          </Button>
        )}
      </div>

      <NotificationList
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    </div>
  )
}
