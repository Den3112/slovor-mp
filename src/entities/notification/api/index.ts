// Notifications API
// Centralized API layer for user notifications

// import { supabase } from '@/shared/lib/supabase/client'
// Global browser client import REMOVED to prevent SSR evaluation crashes.
// Every method must now receive a SupabaseClient as an argument.
import type { ApiResponse } from '@/shared/lib/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'
import { logError } from '@/shared/lib/utils/logger'

export type NotificationType =
  | 'message'
  | 'sold'
  | 'offer'
  | 'system'
  | 'review'
  | 'payment'

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
  async getNotifications(
    client: SupabaseClient,
    userId: string
  ): Promise<ApiResponse<Notification[]>> {
    try {
      const { data, error } = await client
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
  async getUnreadCount(
    client: SupabaseClient,
    userId: string
  ): Promise<ApiResponse<number>> {
    try {
      const { count, error } = await client
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
  async markAsRead(
    client: SupabaseClient,
    notificationId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await client
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
  async markAllAsRead(
    client: SupabaseClient,
    userId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await client
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
  async delete(
    client: SupabaseClient,
    notificationId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await client
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
  async create(
    client: SupabaseClient,
    notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>
  ): Promise<ApiResponse<Notification>> {
    try {
      const { data, error } = await client
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
  },
}
