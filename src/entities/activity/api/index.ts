// import { supabase } from '@/shared/lib/supabase/client'
// Global browser client import REMOVED to prevent SSR evaluation crashes.
// Every method must now receive a SupabaseClient as an argument.
import type { ApiResponse } from '@/shared/lib/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'
import { logError } from '@/shared/lib/utils/logger'

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  metadata: any
  ip_address: string | null
  created_at: string
}

export const activityApi = {
  /**
   * Gets activity logs for the current user
   */
  async getMyLogs(
    client: SupabaseClient,
    limit = 50
  ): Promise<ApiResponse<ActivityLog[]>> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await client
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { data: (data || []) as ActivityLog[], error: null }
    } catch (error) {
      logError('activityApi.getMyLogs', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
