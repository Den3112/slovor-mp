'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { notificationsApi, type Notification } from '@/lib/api/notifications'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from 'sonner'

export function useNotifications() {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    const fetchNotifications = useCallback(async () => {
        if (!user) return
        setIsLoading(true)
        const { data } = await notificationsApi.getNotifications(user.id)
        if (data) {
            setNotifications(data)
        }
        const { data: count } = await notificationsApi.getUnreadCount(user.id)
        if (count !== null) {
            setUnreadCount(count)
        }
        setIsLoading(false)
    }, [user])

    useEffect(() => {
        fetchNotifications()

        if (!user) return

        // Subscribe to new notifications
        const channel = supabase
            .channel(`notifications:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newNotif = payload.new as Notification
                        setNotifications((prev) => [newNotif, ...prev])
                        setUnreadCount((prev) => prev + 1)

                        // Show toast for new notification
                        toast(newNotif.title, {
                            description: newNotif.content,
                            action: newNotif.link ? {
                                label: 'View',
                                onClick: () => window.location.href = newNotif.link!
                            } : undefined
                        })
                    } else if (payload.eventType === 'UPDATE') {
                        const updated = payload.new as Notification
                        setNotifications((prev) =>
                            prev.map((n) => n.id === updated.id ? updated : n)
                        )
                        // Refresh unread count
                        notificationsApi.getUnreadCount(user.id).then(({ data }) => {
                            if (data !== null) setUnreadCount(data)
                        })
                    } else if (payload.eventType === 'DELETE') {
                        setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id))
                        notificationsApi.getUnreadCount(user.id).then(({ data }) => {
                            if (data !== null) setUnreadCount(data)
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, supabase, fetchNotifications])

    const markAsRead = async (id: string) => {
        const { data } = await notificationsApi.markAsRead(id)
        if (data) {
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            )
            setUnreadCount((prev) => Math.max(0, prev - 1))
        }
    }

    const markAllAsRead = async () => {
        if (!user) return
        const { data } = await notificationsApi.markAllAsRead(user.id)
        if (data) {
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
            setUnreadCount(0)
        }
    }

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications
    }
}
