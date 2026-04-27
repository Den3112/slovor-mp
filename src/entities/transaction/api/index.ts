// Transactions API
// import { supabase } from '@/shared/lib/supabase/client'
// Global browser client import REMOVED to prevent SSR evaluation crashes.
// Every method must now receive a SupabaseClient as an argument.
import type { ApiResponse, Transaction } from '@/shared/lib/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'
import { logError } from '@/shared/lib/utils/logger'

export const transactionsApi = {
  /**
   * Gets all transactions for a user
   */
  async getForUser(
    client: SupabaseClient,
    userId: string
  ): Promise<ApiResponse<Transaction[]>> {
    try {
      const { data, error } = await client
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data: data as Transaction[], error: null }
    } catch (error) {
      logError('transactionsApi.getForUser', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Gets all transactions (for admin dashboard stats)
   */
  async getAll(client: SupabaseClient): Promise<ApiResponse<Transaction[]>> {
    try {
      const { data, error } = await client
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data: data as Transaction[], error: null }
    } catch (error) {
      logError('transactionsApi.getAll', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Creates a new transaction (usually from a payment webhook or success)
   */
  async create(
    client: SupabaseClient,
    transaction: Omit<Transaction, 'id' | 'created_at'>
  ): Promise<ApiResponse<Transaction>> {
    try {
      const { data, error } = await client
        .from('transactions')
        .insert(transaction)
        .select()
        .single()

      if (error) throw error

      return { data: data as Transaction, error: null }
    } catch (error) {
      logError('transactionsApi.create', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Gets stats for the admin dashboard
   */
  async getAdminStats(client: SupabaseClient): Promise<
    ApiResponse<{ total_revenue: number; count: number }>
  > {
    try {
      const { data, error } = await client
        .from('transactions')
        .select('amount')
        .eq('status', 'completed')

      if (error) throw error

      const total = (data || []).reduce(
        (sum: number, t: any) => sum + Number(t.amount),
        0
      )
      return {
        data: { total_revenue: total, count: (data || []).length },
        error: null,
      }
    } catch (error) {
      logError('transactionsApi.getAdminStats', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
