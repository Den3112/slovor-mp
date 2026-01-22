// Reports API
// Centralized API layer for managing user/listing reports

import { supabase } from '@/lib/supabase/client'
import type { ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export type ReportStatus = 'open' | 'in_review' | 'resolved'
export type ReportReason =
    | 'spam'
    | 'inappropriate'
    | 'fraud'
    | 'counterfeit'
    | 'prohibited'
    | 'duplicate'
    | 'other'

export interface Report {
    id: string
    reporter_id: string
    reported_listing_id: string | null
    reported_user_id: string | null
    reason: ReportReason
    description: string | null
    status: ReportStatus
    created_at: string
    updated_at: string
}

export const reportsApi = {
    /**
     * Creates a new report
     */
    async create(report: {
        reporter_id: string
        reported_listing_id?: string
        reported_user_id?: string
        reason: ReportReason
        description?: string
    }): Promise<ApiResponse<Report>> {
        try {
            // Must report either a listing or a user
            if (!report.reported_listing_id && !report.reported_user_id) {
                return { data: null, error: 'Must report either a listing or a user' }
            }

            // Cannot report yourself
            if (report.reporter_id === report.reported_user_id) {
                return { data: null, error: 'You cannot report yourself' }
            }

            const { data, error } = await supabase
                .from('reports')
                .insert({
                    reporter_id: report.reporter_id,
                    reported_listing_id: report.reported_listing_id || null,
                    reported_user_id: report.reported_user_id || null,
                    reason: report.reason,
                    description: report.description || null,
                    status: 'open' as ReportStatus,
                })
                .select()
                .single()

            if (error) {
                throw error
            }

            return { data, error: null }
        } catch (error) {
            logError('reportsApi.create', error)
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Gets all reports (for moderators)
     */
    async list(params?: {
        status?: ReportStatus
        limit?: number
        offset?: number
    }): Promise<ApiResponse<{ reports: Report[]; total: number }>> {
        try {
            let query = supabase
                .from('reports')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })

            if (params?.status) {
                query = query.eq('status', params.status)
            }

            if (params?.limit) {
                query = query.limit(params.limit)
            }

            if (params?.offset !== undefined) {
                query = query.range(params.offset, params.offset + (params.limit || 20) - 1)
            }

            const { data, error, count } = await query

            if (error) {
                throw error
            }

            return {
                data: {
                    reports: (data || []) as Report[],
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
    async updateStatus(id: string, status: ReportStatus): Promise<ApiResponse<Report>> {
        try {
            const { data, error } = await supabase
                .from('reports')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single()

            if (error) {
                throw error
            }

            return { data, error: null }
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
                .from('reports')
                .select('id')
                .eq('reporter_id', reporterId)
                .eq('reported_listing_id', listingId)
                .maybeSingle()

            if (error) {
                throw error
            }

            return { data: Boolean(data), error: null }
        } catch (error) {
            logError('reportsApi.hasReported', error)
            return { data: null, error: (error as Error).message }
        }
    },
}
