import { SupabaseClient } from '@supabase/supabase-js'
import { withRetry } from '@/lib/supabase/utils'
import type { Order } from '@/lib/types/database'

export const ordersApi = {
  async getMyOrders(supabase: SupabaseClient) {
    const {
      data: { user },
    } = await withRetry(() => supabase.auth.getUser())
    if (!user) return { data: null, error: 'Not authenticated' }

    return withRetry(() =>
      supabase
        .from('orders')
        .select(
          `
                    *,
                    listing:listings(title, images),
                    buyer:profiles!orders_buyer_id_fkey(display_name, avatar_url),
                    seller:profiles!orders_seller_id_fkey(display_name, avatar_url)
                `
        )
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .then((res) => res)
    )
  },

  async getById(supabase: SupabaseClient, id: string) {
    return withRetry(() =>
      supabase
        .from('orders')
        .select(
          `
                    *,
                    listing:listings(*),
                    buyer:profiles!orders_buyer_id_fkey(*),
                    seller:profiles!orders_seller_id_fkey(*)
                `
        )
        .eq('id', id)
        .single()
        .then((res) => res)
    )
  },

  async getAll(supabase: SupabaseClient) {
    return withRetry(() =>
      supabase
        .from('orders')
        .select(
          `
                    *,
                    listing:listings(title, id),
                    buyer:profiles!orders_buyer_id_fkey(display_name, avatar_url),
                    seller:profiles!orders_seller_id_fkey(display_name, avatar_url)
                `
        )
        .order('created_at', { ascending: false })
        .then((res) => res)
    )
  },

  async create(supabase: SupabaseClient, order: Partial<Order>) {
    return withRetry(() =>
      supabase
        .from('orders')
        .insert(order)
        .select()
        .single()
        .then((res) => res)
    )
  },

  async updateStatus(supabase: SupabaseClient, id: string, status: string) {
    return withRetry(() =>
      supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
        .then((res) => res)
    )
  },

  async purchase(supabase: SupabaseClient, listingId: string, amount: number) {
    return withRetry(() =>
      supabase
        .rpc('purchase_listing', {
          p_listing_id: listingId,
          p_amount: amount,
          p_payment_method: 'wallet',
        })
        .then((res) => res)
    )
  },
}
