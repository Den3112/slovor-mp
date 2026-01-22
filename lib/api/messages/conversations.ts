import { supabase } from '@/lib/supabase/client'
import type { ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'
import type { Conversation } from './types'

export const conversations = {
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

            const conversations = (data || []).map((c) => ({
                ...c,
                last_message: c.messages?.[0] || null
            })) as Conversation[]

            return { data: conversations, error: null }
        } catch (error) {
            logError('messagesApi.getConversationsForUser', error)
            return { data: null, error: (error as Error).message }
        }
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
     * DANGEROUS: Deletes all messages and conversations for a user
     */
    async cleanupAllData(userId: string): Promise<ApiResponse<boolean>> {
        try {
            // Delete conversations where user is buyer or seller
            // Cascade should delete messages
            const { data: conversations } = await supabase
                .from('conversations')
                .select('id')
                .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)

            if (!conversations?.length) return { data: true, error: null }

            const ids = conversations.map(c => c.id)

            await supabase.from('messages').delete().in('conversation_id', ids)
            await supabase.from('conversations').delete().in('id', ids)

            return { data: true, error: null }
        } catch (error) {
            logError('messagesApi.cleanupAllData', error)
            return { data: null, error: (error as Error).message }
        }
    }
}
