// Reports API
// Centralized API layer for managing listing reports
import { supabase } from '@/lib/supabase/client'
import type { ApiResponse, ListingReport } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export type ReportReason =
  | 'spam'
  | 'fraud'
  | 'offensive'
  | 'inappropriate'
  | 'counterfeit'
  | 'prohibited'
  | 'duplicate'
  | 'other'

export const reportsApi = {
  /**
   * Creates a new report for a listing or user
   */
  async create(report: {
    reporter_id: string
    listing_id?: string
    reported_user_id?: string
    reason: string
    description?: string
  }): Promise<ApiResponse<ListingReport>> {
    try {
      // Must report either a listing or a user
      if (!report.listing_id && !report.reported_user_id) {
        return { data: null, error: 'Must report either a listing or a user' }
      }

      // Cannot report yourself
      if (report.reporter_id === report.reported_user_id) {
        return { data: null, error: 'You cannot report yourself' }
      }

      const { data, error } = await supabase
        .from('listing_reports')
        .insert({
          reporter_id: report.reporter_id,
          listing_id: report.listing_id || null,
          reported_user_id: report.reported_user_id || null,
          reason: report.reason,
          description: report.description || null,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      return { data: data as ListingReport, error: null }
    } catch (error) {
      logError('reportsApi.create', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Gets all reports (for moderators)
   */
  async list(params?: {
    status?: ListingReport['status']
    limit?: number
    offset?: number
  }): Promise<ApiResponse<{ reports: ListingReport[]; total: number }>> {
    try {
      let query = supabase
        .from('listing_reports')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (params?.status) {
        query = query.eq('status', params.status)
      }

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: {
          reports: (data || []) as ListingReport[],
          total: count || 0,
        },
        error: null,
      }
    } catch (error) {
      logError('reportsApi.list', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Updates the status of a report
   */
  async updateStatus(
    id: string,
    status: ListingReport['status']
  ): Promise<ApiResponse<ListingReport>> {
    try {
      const { data, error } = await supabase
        .from('listing_reports')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { data: data as ListingReport, error: null }
    } catch (error) {
      logError('reportsApi.updateStatus', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Checks if a user has already reported a listing
   */
  async hasReported(
    reporterId: string,
    listingId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { data, error } = await supabase
        .from('listing_reports')
        .select('id')
        .eq('reporter_id', reporterId)
        .eq('listing_id', listingId)
        .maybeSingle()

      if (error) throw error

      return { data: Boolean(data), error: null }
    } catch (error) {
      logError('reportsApi.hasReported', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
