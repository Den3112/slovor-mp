import { createClient } from '@/lib/supabase/client'
import type { ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export interface PlatformSettings {
    key: string;
    value: any;
    updated_at: string;
}

export const platformSettingsApi = {
    /**
     * Get all platform settings
     */
    async getAll(): Promise<ApiResponse<PlatformSettings[]>> {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('platform_settings')
                .select('*')

            if (error) throw error
            return { data: data as PlatformSettings[], error: null }
        } catch (error) {
            logError('platformSettingsApi.getAll', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Get a specific setting by key
     */
    async getByKey<T>(key: string): Promise<ApiResponse<T>> {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('platform_settings')
                .select('value')
                .eq('key', key)
                .single()

            if (error) throw error
            return { data: data.value as T, error: null }
        } catch (error) {
            logError(`platformSettingsApi.getByKey(${key})`, error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Update a specific setting
     */
    async update(key: string, value: any): Promise<ApiResponse<boolean>> {
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('platform_settings')
                .upsert({ key, value, updated_at: new Date().toISOString() })

            if (error) throw error
            return { data: true, error: null }
        } catch (error) {
            logError(`platformSettingsApi.update(${key})`, error)
            return { data: null, error: (error as Error).message }
        }
    }
}
