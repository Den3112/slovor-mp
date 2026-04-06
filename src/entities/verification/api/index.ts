import { supabase } from '@/shared/lib/supabase/client'
import type { ApiResponse } from '@/shared/lib/types/database'
import { logError } from '@/shared/lib/utils/logger'

export interface VerificationStatus {
  email: boolean
  phone: boolean
  documents: 'none' | 'pending' | 'verified' | 'rejected'
  level: 'none' | 'email' | 'phone' | 'documents'
}

export const verificationApi = {
  /**
   * Gets the verification status of the current user
   */
  async getStatus(userId: string): Promise<ApiResponse<VerificationStatus>> {
    try {
      // Fetch profile for phone and level
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_verified, verification_level, phone')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      // Fetch latest document verification request
      const { data: latestVerification, error: verificationError } =
        await supabase
          .from('verifications')
          .select('status')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

      if (verificationError && verificationError.code !== 'PGRST116')
        throw verificationError

      return {
        data: {
          email: true, // Assuming they are logged in and session is valid
          phone: !!profile.phone,
          documents: latestVerification?.status || 'none',
          level:
            (profile.verification_level as VerificationStatus['level']) ||
            'none',
        },
        error: null,
      }
    } catch (error) {
      logError('verificationApi.getStatus', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Submits a request for document verification
   */
  async submitDocuments(
    userId: string,
    documentUrls: string[]
  ): Promise<ApiResponse<boolean>> {
    try {
      // 1. Create verification request
      const { error: insertError } = await supabase
        .from('verifications')
        .insert({
          user_id: userId,
          type: 'id_document', // Changed document_type to type
          document_url: documentUrls[0] || '',
          status: 'pending',
        })

      if (insertError) throw insertError

      // 2. Update profile level to show pending status if needed,
      // but usually we keep verification_level as the LAST COMPLETED level.
      // Let's just update the metadata if we want to track it there too.
      await supabase
        .from('profiles')
        .update({
          metadata: {
            last_verification_attempt: new Date().toISOString(),
          },
        })
        .eq('id', userId)

      return { data: true, error: null }
    } catch (error) {
      logError('verificationApi.submitDocuments', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Admin: Approves a verification request
   */
  async approveVerification(
    verificationId: string,
    userId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      // 1. Update verification request status
      const { error: verifError } = await supabase
        .from('verifications')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() }) // status verified -> approved, verified_at -> reviewed_at
        .eq('id', verificationId)

      if (verifError) throw verifError

      // 2. Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ verification_level: 'documents', is_verified: true })
        .eq('id', userId)

      if (profileError) throw profileError

      return { data: true, error: null }
    } catch (error) {
      logError('verificationApi.approveVerification', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Admin: Rejects a verification request
   */
  async rejectVerification(
    verificationId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('verifications')
        .update({ status: 'rejected' })
        .eq('id', verificationId)

      if (error) throw error
      return { data: true, error: null }
    } catch (error) {
      logError('verificationApi.rejectVerification', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Admin: Fetches all verification requests
   */
  async getAdminAll(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('verifications')
        .select(
          '*, profile:profiles!user_id(id, display_name, avatar_url, phone)'
        )
        .returns<any[]>() // Keep any[] for now as the join return type is complex, but improve the return signature
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      logError('verificationApi.getAdminAll', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
