// Notifications API
// Centralized API layer for user notifications

import { supabase } from '@/lib/supabase/client'
import type { ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export type NotificationType = 'message' | 'sold' | 'offer' | 'system' | 'review' | 'payment'

export interface Notification {
    id: string
    user_id: string
    type: NotificationType
    title: string
    content: string | null
    link: string | null
    is_read: boolean
    metadata: any
    created_at: string
}

export const notificationsApi = {
    /**
     * Gets all notifications for a user
     */
    async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50)

            if (error) throw error

            return { data: (data || []) as Notification[], error: null }
        } catch (error) {
            logError('notificationsApi.getNotifications', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Gets unread notification count
     */
    async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
        try {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('is_read', false)

            if (error) throw error

            return { data: count || 0, error: null }
        } catch (error) {
            logError('notificationsApi.getUnreadCount', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Marks notification as read
     */
    async markAsRead(notificationId: string): Promise<ApiResponse<boolean>> {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId)

            if (error) throw error

            return { data: true, error: null }
        } catch (error) {
            logError('notificationsApi.markAsRead', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Marks all notifications as read
     */
    async markAllAsRead(userId: string): Promise<ApiResponse<boolean>> {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', userId)
                .eq('is_read', false)

            if (error) throw error

            return { data: true, error: null }
        } catch (error) {
            logError('notificationsApi.markAllAsRead', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Deletes a notification
     */
    async delete(notificationId: string): Promise<ApiResponse<boolean>> {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId)

            if (error) throw error

            return { data: true, error: null }
        } catch (error) {
            logError('notificationsApi.delete', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Creates a new notification
     */
    async create(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<ApiResponse<Notification>> {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .insert([{ ...notification, is_read: false }])
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            logError('notificationsApi.create', error)
            return { data: null, error: (error as Error).message }
        }
    }
}
