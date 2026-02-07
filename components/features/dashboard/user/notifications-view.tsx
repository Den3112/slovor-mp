'use client'

import { useState, useEffect, useCallback } from 'react'
import { notificationsApi, type Notification } from '@/lib/api/notifications'
import { useAuth } from '@/components/providers/auth-provider'
import { useTranslation } from '@/lib/i18n'
import {
  Bell,
  MessageCircle,
  ShoppingBag,
  Star,
  Zap,
  CreditCard,
  Check,
  Trash2,
  Calendar,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'sonner'
import { EmptyState } from '@/components/ui/empty-state'

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

  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return {
          icon: MessageCircle,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
        }
      case 'sold':
        return {
          icon: ShoppingBag,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/10',
        }
      case 'offer':
        return { icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' }
      case 'promotion':
        return { icon: Zap, color: 'text-violet-500', bg: 'bg-violet-500/10' }
      case 'payment':
        return {
          icon: CreditCard,
          color: 'text-indigo-500',
          bg: 'bg-indigo-500/10',
        }
      default:
        return { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted' }
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

      {notifications.length > 0 ? (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification) => {
              const { icon: Icon, color, bg } = getIcon(notification.type)
              return (
                <motion.div
                  key={notification.id}
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
                            notification.is_read
                              ? 'text-foreground/70'
                              : 'text-foreground'
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
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="hover:bg-success/10 hover:text-success h-8 w-8 rounded-lg"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(notification.id)}
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
            })}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title={t('dashboard:notifications.emptyTitle')}
          description={t('dashboard:notifications.emptyDesc')}
        />
      )}
    </div>
  )
}
