import { SupabaseClient } from '@supabase/supabase-js'
import type { Order } from '@/lib/types/database'

export const ordersApi = {
    async getMyOrders(supabase: SupabaseClient) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { data: null, error: 'Not authenticated' }

        return supabase
            .from('orders')
            .select(`
                *,
                listing:listings(title, images),
                buyer:profiles!orders_buyer_id_fkey(full_name, avatar_url),
                seller:profiles!orders_seller_id_fkey(full_name, avatar_url)
            `)
            .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
            .order('created_at', { ascending: false })
    },

    async getById(supabase: SupabaseClient, id: string) {
        return supabase
            .from('orders')
            .select(`
                *,
                listing:listings(*),
                buyer:profiles!orders_buyer_id_fkey(*),
                seller:profiles!orders_seller_id_fkey(*)
            `)
            .eq('id', id)
            .single()
    },

    async getAll(supabase: SupabaseClient) {
        return supabase
            .from('orders')
            .select(`
                *,
                listing:listings(title, id),
                buyer:profiles!orders_buyer_id_fkey(full_name, avatar_url),
                seller:profiles!orders_seller_id_fkey(full_name, avatar_url)
            `)
            .order('created_at', { ascending: false })
    },

    async create(supabase: SupabaseClient, order: Partial<Order>) {
        return supabase
            .from('orders')
            .insert(order)
            .select()
            .single()
    },

    async updateStatus(supabase: SupabaseClient, id: string, status: string) {
        return supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()
    },

    async purchase(supabase: SupabaseClient, listingId: string, amount: number) {
        return supabase.rpc('purchase_listing', {
            p_listing_id: listingId,
            p_amount: amount,
            p_payment_method: 'wallet'
        })
    }
}
