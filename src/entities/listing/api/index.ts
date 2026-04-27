// import { supabase } from '@/shared/lib/supabase/client'
// Global browser client import REMOVED to prevent SSR evaluation crashes. 
// Every method must now receive a SupabaseClient as an argument.
import type { Listing, ApiResponse } from '@/shared/lib/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'
export type { Listing }
import { logError } from '@/shared/lib/utils/logger'
import { validateListingContent } from '@/shared/lib/moderation'
import {
  applyListingFilters,
  applyListingSorting,
  applyListingPagination,
  type ListingFilterOptions,
} from './filters'
import { MOCK_LISTINGS } from './mock-listings'
export * from './geo'

export type { ListingFilterOptions }

function buildListingsQuery(
  client: SupabaseClient,
  options?: ListingFilterOptions
) {
  let query = client
    .from('listings')
    .select('*, category:categories(*)')
    .eq('status', 'active')

  query = applyListingFilters(query, options)
  query = applyListingSorting(query, options?.sort)
  query = applyListingPagination(query, options)

  return query
}

export const listingsApi = {
  async getAll(
    client: SupabaseClient,
    options?: ListingFilterOptions
  ): Promise<ApiResponse<Listing[]>> {
    try {
      const query = buildListingsQuery(client, options)
      const { data, error } = await query
      if (error) {
        if (
          error.message?.includes('default credentials') ||
          (error as any).status === 500
        ) {
          console.warn('Supabase Error: Falling back to MOCK_LISTINGS')
          return { data: MOCK_LISTINGS as any as Listing[], error: null }
        }
        throw error
      }
      return { data: data || [], error: null }
    } catch (error) {
      logError('listingsApi.getAll', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getAdminAll(client: SupabaseClient): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await client
        .from('listings')
        .select('*, category:categories(*), user:profiles(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      logError('listingsApi.getAdminAll', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getCount(
    client: SupabaseClient,
    options: Omit<ListingFilterOptions, 'limit' | 'offset' | 'sort'> | undefined
  ): Promise<ApiResponse<number>> {
    try {
      let query = client
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')

      query = applyListingFilters(query, options)
      const { count, error } = await query
      if (error) {
        if (
          error.message?.includes('default credentials') ||
          (error as any).status === 500
        ) {
          return { data: MOCK_LISTINGS.length, error: null }
        }
        throw error
      }
      return { data: count || 0, error: null }
    } catch (error) {
      logError('listingsApi.getCount', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getPendingCount(client: SupabaseClient): Promise<ApiResponse<number>> {
    try {
      const { count, error } = await client
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')

      if (error) throw error
      return { data: count || 0, error: null }
    } catch (error) {
      logError('listingsApi.getPendingCount', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getFeatured(
    client: SupabaseClient,
    limit: number = 6
  ): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await client
        .from('listings')
        .select('*, category:categories(*)')
        .eq('status', 'active')
        .eq('is_highlighted', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      logError('listingsApi.getFeatured', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getById(
    client: SupabaseClient,
    id: string
  ): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await client
        .from('listings')
        .select('*, category:categories(*), user:profiles(*)')
        .eq('id', id)
        .eq('status', 'active')
        .maybeSingle()

      if (error) throw error
      if (!data) return { data: null, error: 'Listing not found' }

      // Analytics: increment view count (optional, can be done asynchronously)
      client
        .from('listings')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id)
        .then(() => {}) // fire and forget

      return { data, error: null }
    } catch (error) {
      logError('listingsApi.getById', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getForEdit(
    client: SupabaseClient,
    id: string
  ): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await client
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

  async create(
    client: SupabaseClient,
    listing: Partial<Listing>
  ): Promise<ApiResponse<Listing>> {
    try {
      const contentCheck = validateListingContent(
        listing.title || '',
        listing.description || '',
        listing.location
      )
      if (!contentCheck.isValid)
        return {
          data: null,
          error: contentCheck.error || 'Content validation failed',
        }

      const { data, error } = await client
        .from('listings')
        .insert({
          ...listing,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active',
          views_count: 0,
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

  async update(
    client: SupabaseClient,
    id: string,
    updates: Partial<Listing>
  ): Promise<ApiResponse<Listing>> {
    try {
      if (updates.title || updates.description || updates.location) {
        const contentCheck = validateListingContent(
          updates.title || '',
          updates.description || '',
          updates.location
        )
        if (!contentCheck.isValid)
          return {
            data: null,
            error: contentCheck.error || 'Content validation failed',
          }
      }

      const updateData = { ...updates, updated_at: new Date().toISOString() }
      Object.keys(updateData).forEach(
        (key) =>
          updateData[key as keyof typeof updateData] === undefined &&
          delete updateData[key as keyof typeof updateData]
      )

      const { data, error } = await client
        .from('listings')
        .update(updateData)
        .eq('id', id)
        .select()
        .maybeSingle()
      if (error) throw error
      if (!data)
        return { data: null, error: 'Listing not found or update failed' }
      return { data, error: null }
    } catch (error) {
      logError('listingsApi.update', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async delete(client: SupabaseClient, id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await client.from('listings').delete().eq('id', id)
      if (error) throw error
      return { data: null, error: null }
    } catch (error) {
      logError('listingsApi.delete', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getByUser(
    client: SupabaseClient,
    userId: string
  ): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await client
        .from('listings')
        .select('*, category:categories(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      logError('listingsApi.getByUser', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getForOwner(
    client: SupabaseClient,
    id: string,
    userId: string
  ): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await client
        .from('listings')
        .select('*, category:categories(*), user:profiles(*)')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle()
      if (error) throw error
      if (!data) return { data: null, error: 'Listing not found' }
      return { data, error: null }
    } catch (error) {
      logError('listingsApi.getForOwner', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async incrementContactClicks(
    client: SupabaseClient,
    id: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await client.rpc('increment_contact_clicks', {
        listing_id: id,
      })
      if (error) throw error
      return { data: true, error: null }
    } catch (error) {
      logError('listingsApi.incrementContactClicks', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async promote(
    client: SupabaseClient,
    id: string,
    type: string,
    duration: number,
    cost: number
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await client.rpc('promote_listing', {
        p_listing_id: id,
        p_promo_type: type,
        p_duration_days: duration,
        p_cost: cost,
      })
      if (error) throw error
      return { data: undefined, error: null }
    } catch (error) {
      logError('listingsApi.promote', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async bulkDelete(
    client: SupabaseClient,
    ids: string[]
  ): Promise<ApiResponse<null>> {
    try {
      const { error } = await client.from('listings').delete().in('id', ids)
      if (error) throw error
      return { data: null, error: null }
    } catch (error) {
      logError('listingsApi.bulkDelete', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async bulkUpdateStatus(
    client: SupabaseClient,
    ids: string[],
    status: Listing['status']
  ): Promise<ApiResponse<null>> {
    try {
      const { error } = await client
        .from('listings')
        .update({ status, updated_at: new Date().toISOString() })
        .in('id', ids)
      if (error) throw error
      return { data: null, error: null }
    } catch (error) {
      logError('listingsApi.bulkUpdateStatus', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
