import { supabase } from '@/lib/supabase/client'
import type { ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

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
    async getMyLogs(limit = 50): Promise<ApiResponse<ActivityLog[]>> {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { data, error } = await supabase
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
    }
}
