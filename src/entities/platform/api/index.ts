import type { SupabaseClient } from '@supabase/supabase-js'
import type { ApiResponse } from '@/shared/lib/types/database'
import { logError } from '@/shared/lib/utils/logger'

export interface PlatformSettings {
  key: string
  value: any
  updated_at: string
}

export const platformSettingsApi = {
  /**
   * Get all platform settings
   */
  async getAll(client: SupabaseClient): Promise<ApiResponse<PlatformSettings[]>> {
    try {
      const { data, error } = await client
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
  async getByKey<T>(client: SupabaseClient, key: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await client
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
  async update(
    client: SupabaseClient,
    key: string,
    value: any
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await client
        .from('platform_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() })

      if (error) throw error
      return { data: true, error: null }
    } catch (error) {
      logError(`platformSettingsApi.update(${key})`, error)
      return { data: null, error: (error as Error).message }
    }
  },
}

