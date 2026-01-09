// Saved Searches API
// API for managing search subscriptions and notifications

import { supabase } from '@/lib/supabase/client'
import type { ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export interface SavedSearch {
    id: string
    user_id: string
    name: string
    query: string | null
    category_id: string | null
    location: string | null
    min_price: number | null
    max_price: number | null
    notify_email: boolean
    notify_push: boolean
    frequency: 'instant' | 'daily' | 'weekly'
    last_notified_at: string | null
    created_at: string
    updated_at: string
    category?: {
        id: string
        name: string
        slug: string
    }
}

export interface CreateSavedSearchInput {
    name: string
    query?: string
    category_id?: string
    location?: string
    min_price?: number
    max_price?: number
    notify_email?: boolean
    notify_push?: boolean
    frequency?: 'instant' | 'daily' | 'weekly'
}

export const savedSearchesApi = {
    /**
     * Get all saved searches for current user
     */
    async getAll(): Promise<ApiResponse<SavedSearch[]>> {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                return { data: null, error: 'Not authenticated' }
            }

            const { data, error } = await supabase
                .from('saved_searches')
                .select(`
                    *,
                    category:categories(id, name, slug)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error

            return { data: data as SavedSearch[], error: null }
        } catch (error) {
            logError('savedSearchesApi.getAll', error)
            return { data: null, error: (error as Error).message || 'Unknown error' }
        }
    },

    /**
     * Create a new saved search
     */
    async create(input: CreateSavedSearchInput): Promise<ApiResponse<SavedSearch>> {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                return { data: null, error: 'Not authenticated' }
            }

            const { data, error } = await supabase
                .from('saved_searches')
                .insert({
                    user_id: user.id,
                    name: input.name,
                    query: input.query || null,
                    category_id: input.category_id || null,
                    location: input.location || null,
                    min_price: input.min_price || null,
                    max_price: input.max_price || null,
                    notify_email: input.notify_email ?? true,
                    notify_push: input.notify_push ?? false,
                    frequency: input.frequency || 'daily',
                })
                .select()
                .single()

            if (error) throw error

            return { data, error: null }
        } catch (error) {
            logError('savedSearchesApi.create', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Update a saved search
     */
    async update(id: string, input: Partial<CreateSavedSearchInput>): Promise<ApiResponse<SavedSearch>> {
        try {
            const { data, error } = await supabase
                .from('saved_searches')
                .update({
                    ...input,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            return { data, error: null }
        } catch (error) {
            logError('savedSearchesApi.update', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Delete a saved search
     */
    async delete(id: string): Promise<ApiResponse<boolean>> {
        try {
            const { error } = await supabase
                .from('saved_searches')
                .delete()
                .eq('id', id)

            if (error) throw error

            return { data: true, error: null }
        } catch (error) {
            logError('savedSearchesApi.delete', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Save current search filters as a saved search
     */
    saveCurrentSearch(
        name: string,
        filters: {
            query?: string
            category?: string
            location?: string
            minPrice?: number
            maxPrice?: number
        }
    ): Promise<ApiResponse<SavedSearch>> {
        return this.create({
            name,
            query: filters.query,
            category_id: filters.category,
            location: filters.location,
            min_price: filters.minPrice,
            max_price: filters.maxPrice,
        })
    },
}
