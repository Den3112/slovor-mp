import { createClient } from '@/shared/lib/supabase/client'

export const walletsApi = {
  /**
   * Get the current user's wallet
   */
  async getMyWallet() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { data: null, error: 'Not authenticated' }

    return supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
  },

  /**
   * Get wallet transactions
   */
  async getTransactions(walletId: string, limit = 10) {
    const supabase = createClient()
    return supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
      .limit(limit)
  },

  /**
   * Create wallet if doesn't exist (safety)
   */
  async ensureWallet() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (wallet) return { data: wallet, error: null }

    return supabase
      .from('wallets')
      .insert({ user_id: user.id, balance: 0.0, currency: 'EUR' })
      .select()
      .maybeSingle()
  },
}
