// Messages API
// Centralized API layer for conversations and messages

import { supabase } from '@/lib/supabase/client'
import type { ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export interface Conversation {
    id: string
    listing_id: string
    buyer_id: string
    seller_id: string
    created_at: string
    updated_at: string
    listing?: {
        id: string
        title: string
        images: string[]
        price: number
    }
    buyer?: {
        id: string
        display_name: string | null
        avatar_url: string | null
    }
    seller?: {
        id: string
        display_name: string | null
        avatar_url: string | null
    }
    last_message?: Message | null
}

export interface Message {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    is_read: boolean
    created_at: string
    sender?: {
        id: string
        display_name: string | null
        avatar_url: string | null
    }
}

export const messagesApi = {
    /**
     * Gets or creates a conversation for a listing between buyer and seller
     */
    async getOrCreateConversation(
        listingId: string,
        buyerId: string,
        sellerId: string
    ): Promise<ApiResponse<Conversation>> {
        try {
            // First, try to find existing conversation
            const { data: existing, error: findError } = await supabase
                .from('conversations')
                .select('*')
                .eq('listing_id', listingId)
                .eq('buyer_id', buyerId)
                .eq('seller_id', sellerId)
                .maybeSingle()

            if (findError) {
                throw findError
            }

            if (existing) {
                return { data: existing, error: null }
            }

            // Create new conversation
            const { data, error } = await supabase
                .from('conversations')
                .insert({
                    listing_id: listingId,
                    buyer_id: buyerId,
                    seller_id: sellerId,
                })
                .select()
                .single()

            if (error) {
                throw error
            }

            return { data, error: null }
        } catch (error) {
            logError('messagesApi.getOrCreateConversation', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Gets all conversations for a user
     */
    async getConversationsForUser(userId: string): Promise<ApiResponse<Conversation[]>> {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .select(`
          *,
          listing:listings (
            id,
            title,
            images,
            price
          ),
          buyer:profiles!conversations_buyer_id_fkey (
            id,
            display_name,
            avatar_url
          ),
          seller:profiles!conversations_seller_id_fkey (
            id,
            display_name,
            avatar_url
          ),
          messages (
            id,
            content,
            created_at,
            sender_id,
            is_read
          )
        `)
                .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
                .order('updated_at', { ascending: false })

            if (error) {
                throw error
            }

            const conversations = (data || []).map((c: any) => ({
                ...c,
                last_message: c.messages?.[0] || null
            }))

            return { data: conversations, error: null }
        } catch (error) {
            logError('messagesApi.getConversationsForUser', error)
            return { data: null, error: (error as Error).message }
        }
    },

    // Alias for consistency
    getConversations(userId: string) {
        return this.getConversationsForUser(userId)
    },

    /**
     * Gets a single conversation by ID
     */
    async getConversation(conversationId: string): Promise<ApiResponse<Conversation>> {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .select(`
          *,
          listing:listings (
            id,
            title,
            images,
            price
          ),
          buyer:profiles!conversations_buyer_id_fkey (
            id,
            display_name,
            avatar_url
          ),
          seller:profiles!conversations_seller_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `)
                .eq('id', conversationId)
                .single()

            if (error) {
                throw error
            }

            return { data: data as Conversation, error: null }
        } catch (error) {
            logError('messagesApi.getConversation', error)
            return { data: null, error: (error as Error).message }
        }
    },

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
    },

    /**
     * DANGEROUS: Deletes all messages and conversations for a user
     */
    async cleanupAllData(userId: string): Promise<ApiResponse<boolean>> {
        try {
            // Delete conversations where user is buyer or seller
            // Cascade should delete messages, but doing explicit to be safe if no cascade

            // 1. Get IDs
            const { data: conversations } = await supabase
                .from('conversations')
                .select('id')
                .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)

            if (!conversations?.length) return { data: true, error: null }

            const ids = conversations.map(c => c.id)

            // 2. Delete Messages
            await supabase.from('messages').delete().in('conversation_id', ids)

            // 3. Delete Conversations
            await supabase.from('conversations').delete().in('id', ids)

            return { data: true, error: null }
        } catch (error) {
            logError('messagesApi.cleanupAllData', error)
            return { data: null, error: (error as Error).message }
        }
    }
}
