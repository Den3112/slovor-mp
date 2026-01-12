import { supabase } from '@/lib/supabase/client'
import type { Listing, ApiResponse } from '@/lib/types/database'
export type { Listing }
import { logError } from '@/lib/utils/logger'
import { validateListingContent } from '@/lib/moderation'
import {
    applyListingFilters,
    applyListingSorting,
    applyListingPagination
} from './filters'

export interface ListingFilterOptions {
    categoryId?: string
    categorySlug?: string
    search?: string
    limit?: number
    offset?: number
    page?: number
    priceMin?: number
    priceMax?: number
    condition?: 'new' | 'used'
    location?: string
    sort?: string
    isFeatured?: boolean
}

function buildListingsQuery(options?: ListingFilterOptions) {
    let query = supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('is_active', true)

    query = applyListingFilters(query, options)
    query = applyListingSorting(query, options?.sort)
    query = applyListingPagination(query, options)

    return query
}

export const listingsApi = {
    async getAll(options?: ListingFilterOptions): Promise<ApiResponse<Listing[]>> {
        try {
            const query = buildListingsQuery(options)
            const { data, error } = await query
            if (error) throw error
            return { data: data || [], error: null }
        } catch (error) {
            logError('listingsApi.getAll', error)
            return { data: null, error: (error as Error).message }
        }
    },

    async getCount(options?: Omit<ListingFilterOptions, 'limit' | 'offset' | 'sort'>): Promise<ApiResponse<number>> {
        try {
            let query = supabase
                .from('listings')
                .select('id', { count: 'exact', head: true })
                .eq('is_active', true)

            query = applyListingFilters(query, options)
            const { count, error } = await query
            if (error) throw error
            return { data: count || 0, error: null }
        } catch (error) {
            logError('listingsApi.getCount', error)
            return { data: null, error: (error as Error).message }
        }
    },

    async getFeatured(limit: number = 6): Promise<ApiResponse<Listing[]>> {
        try {
            const { data, error } = await supabase
                .from('listings')
                .select('*, category:categories(*)')
                .eq('is_active', true)
                .eq('featured', true)
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) throw error
            return { data: data || [], error: null }
        } catch (error) {
            logError('listingsApi.getFeatured', error)
            return { data: null, error: (error as Error).message }
        }
    },

    async getById(id: string): Promise<ApiResponse<Listing>> {
        try {
            const { data, error } = await supabase
                .from('listings')
                .select('*, category:categories(*), user:profiles(*)')
                .eq('id', id)
                .eq('is_active', true)
                .maybeSingle()

            if (error) throw error
            if (!data) return { data: null, error: 'Listing not found' }

            await supabase.from('listings').update({ views: (data.views || 0) + 1 }).eq('id', id)
            return { data, error: null }
        } catch (error) {
            logError('listingsApi.getById', error)
            return { data: null, error: (error as Error).message }
        }
    },

    async getForEdit(id: string): Promise<ApiResponse<Listing>> {
        try {
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .eq('id', id)
                .maybeSingle()

            if (error) throw error
            if (!data) return { data: null, error: 'Listing not found' }
            return { data, error: null }
        } catch (error) {
            logError('listingsApi.getForEdit', error)
            return { data: null, error: (error as Error).message }
        }
    },

    async create(listing: Partial<Listing>): Promise<ApiResponse<Listing>> {
        try {
            const contentCheck = validateListingContent(listing.title || '', listing.description || '')
            if (!contentCheck.isValid) return { data: null, error: contentCheck.error || 'Content validation failed' }

            const { data, error } = await supabase
                .from('listings')
                .insert({
                    ...listing,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    is_active: true,
                    views: 0,
                })
                .select()
                .maybeSingle()

            if (error) throw error
            if (!data) return { data: null, error: 'Failed to create listing' }
            return { data, error: null }
        } catch (error) {
            logError('listingsApi.create', error)
            return { data: null, error: (error as Error).message }
        }
    },

    async update(id: string, updates: Partial<Listing>): Promise<ApiResponse<Listing>> {
        try {
            const updateData = { ...updates, updated_at: new Date().toISOString() }
            Object.keys(updateData).forEach(key => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData])

            const { data, error } = await supabase.from('listings').update(updateData).eq('id', id).select().maybeSingle()
            if (error) throw error
            if (!data) return { data: null, error: 'Listing not found or update failed' }
            return { data, error: null }
        } catch (error) {
            logError('listingsApi.update', error)
            return { data: null, error: (error as Error).message }
        }
    },

    async delete(id: string): Promise<ApiResponse<null>> {
        try {
            const { error } = await supabase.from('listings').delete().eq('id', id)
            if (error) throw error
            return { data: null, error: null }
        } catch (error) {
            logError('listingsApi.delete', error)
            return { data: null, error: (error as Error).message }
        }
    },

    async getByUser(userId: string): Promise<ApiResponse<Listing[]>> {
        try {
            const { data, error } = await supabase.from('listings').select('*, category:categories(*)').eq('user_id', userId).order('created_at', { ascending: false })
            if (error) throw error
            return { data: data || [], error: null }
        } catch (error) {
            logError('listingsApi.getByUser', error)
            return { data: null, error: (error as Error).message }
        }
    },

    async getForOwner(id: string, userId: string): Promise<ApiResponse<Listing>> {
        try {
            const { data, error } = await supabase.from('listings').select('*, category:categories(*), user:profiles(*)').eq('id', id).eq('user_id', userId).maybeSingle()
            if (error) throw error
            if (!data) return { data: null, error: 'Listing not found' }
            return { data, error: null }
        } catch (error) {
            logError('listingsApi.getForOwner', error)
            return { data: null, error: (error as Error).message }
        }
    },

    async incrementContactClicks(id: string): Promise<ApiResponse<boolean>> {
        try {
            const { error } = await supabase.rpc('increment_contact_clicks', { listing_id: id })
            if (error) throw error
            return { data: true, error: null }
        } catch (error) {
            logError('listingsApi.incrementContactClicks', error)
            return { data: null, error: (error as Error).message }
        }
    }
}
