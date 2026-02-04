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
    Loader2
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
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        }
    }

    const handleMarkAllAsRead = async () => {
        const { error } = await notificationsApi.markAllAsRead(user!.id)
        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
            toast.success(t('dashboard:notifications.markedAllRead') || 'All marked as read')
        }
    }

    const handleDelete = async (id: string) => {
        const { error } = await notificationsApi.delete(id)
        if (!error) {
            setNotifications(prev => prev.filter(n => n.id !== id))
            toast.success(t('dashboard:notifications.deleted') || 'Notification deleted')
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'message': return { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' }
            case 'sold': return { icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
            case 'offer': return { icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' }
            case 'promotion': return { icon: Zap, color: 'text-violet-500', bg: 'bg-violet-500/10' }
            case 'payment': return { icon: CreditCard, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
            default: return { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted' }
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">{t('dashboard:notifications.title') || 'Notifications'}</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                        {t('dashboard:notifications.subtitle') || 'Stay updated with your latest alerts and activities'}
                    </p>
                </div>
                {notifications.some(n => !n.is_read) && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] font-black uppercase tracking-widest rounded-xl border-border/60 h-10 px-6"
                    >
                        <Check className="h-4 w-4 mr-2" />
                        {t('dashboard:notifications.markAllRead') || 'Mark all read'}
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
                                    className="relative group"
                                >
                                    <div className={cn(
                                        "flex gap-5 p-6 rounded-2xl border transition-all duration-300",
                                        notification.is_read
                                            ? "bg-card border-border/40 opacity-80"
                                            : "bg-primary/5 border-primary/20 shadow-sm shadow-primary/5"
                                    )}>
                                        <div className={cn(
                                            "flex h-12 w-12 items-center justify-center rounded-xl shrink-0 transition-transform group-hover:scale-105 border border-border/10",
                                            bg, color
                                        )}>
                                            <Icon className="h-6 w-6" />
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className={cn(
                                                    "text-base font-bold tracking-tight line-clamp-1",
                                                    notification.is_read ? "text-foreground/70" : "text-foreground"
                                                )}>
                                                    {notification.title}
                                                </h3>
                                                <Badge variant="outline" className="hidden sm:flex rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border-border/60">
                                                    {notification.type}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl">
                                                {notification.content}
                                            </p>

                                            <div className="flex items-center gap-4 pt-2">
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </span>
                                                {notification.link && (
                                                    <Link
                                                        href={notification.link}
                                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        {t('common:viewDetails')}
                                                        <ArrowRight className="h-3 w-3" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notification.is_read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="h-8 w-8 rounded-lg hover:bg-success/10 hover:text-success"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(notification.id)}
                                                className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {!notification.is_read && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 h-3 w-1 bg-primary rounded-r-full" />
                                    )}
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                <EmptyState
                    icon={Bell}
                    title={t('dashboard:notifications.emptyTitle') || 'Quiet for now'}
                    description={t('dashboard:notifications.emptyDesc') || "You're all caught up! New alerts will appear here."}
                />
            )}
        </div>
    )
}
