import type { SupabaseClient } from '@supabase/supabase-js'

export const walletsApi = {
  /**
   * Get the current user's wallet
   */
  async getMyWallet(client: SupabaseClient) {
    const {
      data: { user },
    } = await client.auth.getUser()

    if (!user) return { data: null, error: 'Not authenticated' }

    return client
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
  },

  /**
   * Get wallet transactions
   */
  async getTransactions(client: SupabaseClient, walletId: string, limit = 10) {
    return client
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
      .limit(limit)
  },

  /**
   * Create wallet if doesn't exist (safety)
   */
  async ensureWallet(client: SupabaseClient) {
    const {
      data: { user },
    } = await client.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    const { data: wallet } = await client
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (wallet) return { data: wallet, error: null }

    return client
      .from('wallets')
      .insert({ user_id: user.id, balance: 0.0, currency: 'EUR' })
      .select()
      .maybeSingle()
  },
}
