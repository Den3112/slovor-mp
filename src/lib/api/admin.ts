import { createClient } from '@/lib/supabase/client'
import { logError } from '@/lib/utils/logger'
import { withRetry } from '@/lib/supabase/utils'
import type { ApiResponse, Transaction } from '@/lib/types/database'

export interface AdminStats {
  totalUsers: number
  totalListings: number
  activeListings: number
  pendingModeration: number
  totalRevenue: number
  totalTransactions: number
  recentReports: number
}

export const adminApi = {
  async getDashboardStats(): Promise<ApiResponse<AdminStats>> {
    const supabase = createClient()
    try {
      // Fetch stats in parallel using optimized count-only queries with retries
      const [
        usersRes,
        totalListingsRes,
        activeListingsRes,
        pendingRes,
        transactionsRes,
        reportsRes,
      ] = await withRetry<any[]>(() =>
        Promise.all([
          supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true }),
          supabase
            .from('listings')
            .select('id', { count: 'exact', head: true }),
          supabase
            .from('listings')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'active'),
          supabase
            .from('listings')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
          supabase.from('transactions').select('amount, type'),
          supabase
            .from('reports')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
        ])
      )

      // Calculate actual revenue (spending on promotions and subscriptions)
      const revenueTypes = ['promotion', 'subscription']
      const totalRevenue =
        (transactionsRes.data as Transaction[])?.reduce(
          (sum: number, t: Transaction) => {
            if (revenueTypes.includes(t.type)) {
              return sum + Math.abs(Number(t.amount))
            }
            return sum
          },
          0
        ) || 0

      return {
        data: {
          totalUsers: usersRes.count || 0,
          totalListings: totalListingsRes.count || 0,
          activeListings: activeListingsRes.count || 0,
          pendingModeration: pendingRes.count || 0,
          totalRevenue,
          totalTransactions: transactionsRes.data?.length || 0,
          recentReports: reportsRes.count || 0,
        },
        error: null,
      }
    } catch (error) {
      logError('adminApi.getDashboardStats', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async logAction(action: {
    target_id: string
    target_type: 'listing' | 'user' | 'review'
    action_type: 'approve' | 'reject' | 'ban' | 'verify'
    reason?: string
  }): Promise<ApiResponse<null>> {
    const supabase = createClient()
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('admin_actions').insert([
        {
          admin_id: user.id,
          ...action,
        },
      ])

      if (error) throw error
      return { data: null, error: null }
    } catch (error) {
      logError('adminApi.logAction', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getActivityLogs(limit = 50): Promise<ApiResponse<any[]>> {
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*, profiles(display_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      logError('adminApi.getActivityLogs', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
