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
     * Fetches a profile by user ID, or returns empty profile data (for new users)
     */
    async getOrCreate(id: string, email?: string): Promise<ApiResponse<User>> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .maybeSingle()

            if (error) {
                throw error
            }

            // If profile doesn't exist, return a default profile structure
            if (!data) {
                const defaultProfile: Partial<User> = {
                    id,
                    display_name: email?.split('@')[0] || '',
                    bio: '',
                    phone: '',
                    location: '',
                    avatar_url: '',
                }
                return { data: defaultProfile as User, error: null }
            }

            return { data, error: null }
        } catch (error) {
            logError('profilesApi.getOrCreate', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Updates a user profile (creates if doesn't exist)
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

            // Use upsert to create profile if it doesn't exist
            const { data, error } = await supabase
                .from('profiles')
                .upsert({ id, ...safeUpdates }, { onConflict: 'id' })
                .select()
                .maybeSingle()

            if (error) {
                throw error
            }

            if (!data) {
                return { data: null, error: 'Profile update failed' }
            }

            return { data, error: null }
        } catch (error) {
            logError('profilesApi.update', error)
            return { data: null, error: (error as Error).message }
        }
    }
}
export const usersApi = profilesApi
