import { supabase } from '../supabase/client'
import type { ApiResponse } from '../types/database'
import { logError } from '../utils/logger'

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
            const { data, error } = await supabase
                .from('profiles')
                .select('is_verified, verification_level, phone')
                .eq('id', userId)
                .single()

            if (error) throw error

            // In a real app, we'd check if email is confirmed via auth.getUser()
            // For now, we rely on the profile field
            return {
                data: {
                    email: true, // Assuming they are logged in
                    phone: !!data.phone,
                    documents: data.verification_level === 'documents' ? 'verified' : 'none', // Simplified
                    level: data.verification_level || 'none',
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
    async submitDocuments(userId: string, documentUrls: string[]): Promise<ApiResponse<boolean>> {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    verification_level: 'documents', // In real app: set to pending and create a task for admin
                    metadata: {
                        verification_documents: documentUrls,
                        verification_submitted_at: new Date().toISOString(),
                    }
                })
                .eq('id', userId)

            if (error) throw error
            return { data: true, error: null }
        } catch (error) {
            logError('verificationApi.submitDocuments', error)
            return { data: null, error: (error as Error).message }
        }
    }
}
