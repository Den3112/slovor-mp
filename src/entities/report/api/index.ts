import type { SupabaseClient } from '@supabase/supabase-js'
import { logError } from '@/shared/lib/utils/logger'
import type { ApiResponse, ListingReport } from '@/shared/lib/types/database'

export type ReportReason =
  | 'spam'
  | 'inappropriate'
  | 'fraud'
  | 'counterfeit'
  | 'prohibited'
  | 'duplicate'
  | 'offensive'
  | 'other'

export interface ReportWithDetails extends ListingReport {
  listing?: {
    id: string
    title: string
    images?: string[]
  }
  reporter?: {
    display_name: string
    avatar_url?: string
  }
  reported_user?: {
    display_name: string
    avatar_url?: string
  }
}

export const reportsApi = {
  async getAll(client: SupabaseClient): Promise<ApiResponse<ReportWithDetails[]>> {
    return this.list(client)
  },

  async list(
    client: SupabaseClient,
    options?: {
      status?: string
      limit?: number
      offset?: number
    }
  ): Promise<ApiResponse<ReportWithDetails[]>> {
    try {
      let query = client
        .from('reports')
        .select(
          '*, listing:listings(id, title, images), reporter:profiles!reporter_id(display_name, avatar_url), reported_user:profiles!reported_user_id(display_name, avatar_url)',
          { count: 'exact' }
        )
        .order('created_at', { ascending: false })

      if (options?.status) {
        query = query.eq('status', options.status)
      }
      if (options?.limit) {
        query = query.limit(options.limit)
      }
      if (options?.offset && options.limit) {
        query = query.range(options.offset, options.offset + options.limit - 1)
      }

      const { data, error } = await query

      if (error) throw error
      return {
        data: (data as unknown as ReportWithDetails[]) || [],
        error: null,
      }
    } catch (error) {
      logError('reportsApi.list', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async hasReported(
    client: SupabaseClient,
    reporterId: string,
    listingId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { data, error } = await client
        .from('reports')
        .select('id')
        .eq('reporter_id', reporterId)
        .eq('listing_id', listingId)
        .maybeSingle()

      if (error) throw error
      return { data: !!data, error: null }
    } catch (error) {
      logError('reportsApi.hasReported', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async updateStatus(
    client: SupabaseClient,
    id: string,
    status: 'resolved' | 'dismissed'
  ): Promise<ApiResponse<ListingReport>> {
    try {
      const { data, error } = await client
        .from('reports')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      logError('reportsApi.updateStatus', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async create(
    client: SupabaseClient,
    report: Partial<ListingReport>
  ): Promise<ApiResponse<ListingReport>> {
    // Validate request
    if (!report.listing_id && !report.reported_user_id) {
      return { data: null, error: 'Must report either a listing or a user' }
    }

    if (
      report.reporter_id &&
      report.reported_user_id &&
      report.reporter_id === report.reported_user_id
    ) {
      return { data: null, error: 'You cannot report yourself' }
    }

    try {
      const { data, error } = await client
        .from('reports')
        .insert([report])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      logError('reportsApi.create', error)
      return { data: null, error: (error as Error).message }
    }
  },
}

