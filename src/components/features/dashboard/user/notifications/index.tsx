'use client'

import { useState, useEffect, useCallback } from 'react'
import { notificationsApi, type Notification } from '@/lib/api/notifications'
import { useAuth } from '@/components/providers/auth-provider'
import { useTranslation } from '@/lib/i18n'
import { Bell, Loader2 } from 'lucide-react'
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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-12 duration-700">
      {/* Premium Header */}
      <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 shadow-md">
        <div className="bg-primary/10 absolute -top-20 -right-20 h-64 w-64 animate-pulse rounded-full opacity-40 blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="bg-primary shadow-primary/20 flex h-16 w-16 items-center justify-center rounded-xl shadow-lg">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground ml-1 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
                {t('profile:notificationsSubtitle', {
                  defaultValue: 'Stay updated',
                })}
              </p>
              <h1 className="text-foreground text-5xl font-black tracking-tighter uppercase sm:text-6xl">
                {t('dashboard:notifications')}
              </h1>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-border hover:bg-primary/5 h-12 rounded-xl px-6 text-[10px] font-black tracking-widest uppercase transition-all"
              onClick={handleMarkAllAsRead} // Re-added onClick handler
            >
              {t('common:markAllAsRead')}
            </Button>
          </div>
        </div>
      </div>

      <div className="glass-panel border-primary/10 bg-background/10 shadow-primary/5 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
