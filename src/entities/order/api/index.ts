import { SupabaseClient } from '@supabase/supabase-js'
import { withRetry } from '@/shared/lib/supabase/utils'
import type { Order } from '@/shared/lib/types/database'

export const ordersApi = {
  async getMyOrders(supabase: SupabaseClient): Promise<{ data: Order[] | null; error: any }> {
    const {
      data: { user },
    } = await withRetry<{ data: { user: any }; error: any }>(() => supabase.auth.getUser() as any)
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
    ) as any
  },

  async getById(supabase: SupabaseClient, id: string): Promise<{ data: Order | null; error: any }> {
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
    ) as any
  },

  async getAll(supabase: SupabaseClient): Promise<{ data: Order[] | null; error: any }> {
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
    ) as any
  },

  async create(supabase: SupabaseClient, order: Partial<Order>): Promise<{ data: Order | null; error: any }> {
    return withRetry(() =>
      supabase
        .from('orders')
        .insert(order)
        .select()
        .single()
    ) as any
  },

  async updateStatus(supabase: SupabaseClient, id: string, status: string): Promise<{ data: Order | null; error: any }> {
    return withRetry(() =>
      supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    ) as any
  },

  async purchase(supabase: SupabaseClient, listingId: string, amount: number) {
    return withRetry(() =>
      supabase.rpc('purchase_listing', {
        p_listing_id: listingId,
        p_amount: amount,
        p_payment_method: 'wallet',
      })
    )
  },
}
