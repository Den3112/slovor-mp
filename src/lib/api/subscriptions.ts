// Subscriptions API
import { supabase } from '@/lib/supabase/client'
import type { ApiResponse, UserSubscription } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export const subscriptionsApi = {
  /**
   * Get current user subscription
   */
  async getCurrent(): Promise<ApiResponse<UserSubscription>> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return { data: null, error: 'Not authenticated' }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .maybeSingle()

      if (error) throw error

      // If no subscription found, return a default 'free' one
      if (!data) {
        const defaultSub: UserSubscription = {
          id: '',
          user_id: user.id,
          plan_type: 'free',
          status: 'active',
          current_period_end: null,
          cancel_at_period_end: false,
          created_at: new Date().toISOString(),
        }
        return { data: defaultSub, error: null }
      }

      return { data: data as UserSubscription, error: null }
    } catch (error) {
      logError('subscriptionsApi.getCurrent', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Create or update subscription (simulated for now)
   */
  async subscribe(
    planType: UserSubscription['plan_type']
  ): Promise<ApiResponse<UserSubscription>> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return { data: null, error: 'Not authenticated' }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          plan_type: planType,
          status: 'active',
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      logError('subscriptionsApi.subscribe', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
