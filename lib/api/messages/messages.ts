import { supabase } from '@/lib/supabase/client'
import type { ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'
import type { Message } from './types'

export const messages = {
    /**
     * Gets messages for a conversation
     */
    async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `)
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true })

            if (error) {
                throw error
            }

            return { data: (data || []) as Message[], error: null }
        } catch (error) {
            logError('messagesApi.getMessages', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Sends a new message
     */
    async sendMessage(
        conversationId: string,
        senderId: string,
        content: string
    ): Promise<ApiResponse<Message>> {
        try {
            if (!content.trim()) {
                return { data: null, error: 'Message cannot be empty' }
            }

            const { data, error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conversationId,
                    sender_id: senderId,
                    content: content.trim(),
                    is_read: false,
                })
                .select()
                .single()

            if (error) {
                throw error
            }

            // Update conversation's updated_at
            await supabase
                .from('conversations')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', conversationId)

            return { data, error: null }
        } catch (error) {
            logError('messagesApi.sendMessage', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Marks messages as read
     */
    async markAsRead(conversationId: string, userId: string): Promise<ApiResponse<boolean>> {
        try {
            const { error } = await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('conversation_id', conversationId)
                .neq('sender_id', userId)

            if (error) {
                throw error
            }

            return { data: true, error: null }
        } catch (error) {
            logError('messagesApi.markAsRead', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Gets unread message count for a user
     */
    async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
        try {
            // Get conversation IDs where user is participant
            const { data: conversations, error: convError } = await supabase
                .from('conversations')
                .select('id')
                .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)

            if (convError) {
                throw convError
            }

            if (!conversations || conversations.length === 0) {
                return { data: 0, error: null }
            }

            const conversationIds = conversations.map(c => c.id)

            const { count, error } = await supabase
                .from('messages')
                .select('id', { count: 'exact', head: true })
                .in('conversation_id', conversationIds)
                .eq('is_read', false)
                .neq('sender_id', userId)

            if (error) {
                throw error
            }

            return { data: count || 0, error: null }
        } catch (error) {
            logError('messagesApi.getUnreadCount', error)
            return { data: null, error: (error as Error).message }
        }
    }
}
