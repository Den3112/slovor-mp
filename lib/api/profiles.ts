// Profiles API
// Centralized API layer for user profiles management

import { supabase } from '@/lib/supabase/client'
import type { User, ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export const profilesApi = {
    /**
     * Fetches a single profile by user ID
     */
    async getById(id: string): Promise<ApiResponse<User>> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .maybeSingle()

            if (error) {
                throw error
            }

            if (!data) {
                return { data: null, error: 'Profile not found' }
            }

            return { data, error: null }
        } catch (error) {
            logError('profilesApi.getById', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Updates a user profile
     */
    async update(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
        try {
            // Remove sensitive or read-only fields
            const {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                id: _,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                created_at: __,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                updated_at: ___,
                ...safeUpdates
            } = updates

            const { data, error } = await supabase
                .from('profiles')
                .update(safeUpdates)
                .eq('id', id)
                .select()
                .maybeSingle()

            if (error) {
                throw error
            }

            if (!data) {
                return { data: null, error: 'Profile not found or update failed' }
            }

            return { data, error: null }
        } catch (error) {
            logError('profilesApi.update', error)
            return { data: null, error: (error as Error).message }
        }
    }
}
