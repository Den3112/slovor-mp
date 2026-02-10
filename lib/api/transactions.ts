// Transactions API
import { supabase } from '@/lib/supabase/client'
import type { ApiResponse, Transaction } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export const transactionsApi = {
  /**
   * Gets all transactions for a user
   */
  async getForUser(userId: string): Promise<ApiResponse<Transaction[]>> {
    try {
      const { data, error } = await supabase
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
  async getAll(): Promise<ApiResponse<Transaction[]>> {
    try {
      const { data, error } = await supabase
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
    transaction: Omit<Transaction, 'id' | 'created_at'>
  ): Promise<ApiResponse<Transaction>> {
    try {
      const { data, error } = await supabase
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
  async getAdminStats(): Promise<
    ApiResponse<{ total_revenue: number; count: number }>
  > {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed')

      if (error) throw error

      const total = data.reduce((sum, t) => sum + Number(t.amount), 0)
      return {
        data: { total_revenue: total, count: data.length },
        error: null,
      }
    } catch (error) {
      logError('transactionsApi.getAdminStats', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
