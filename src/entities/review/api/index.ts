// Reviews API
// Centralized API layer for seller reviews management

// import { supabase } from '@/shared/lib/supabase/client'
// Global browser client import REMOVED to prevent SSR evaluation crashes.
// Every method must now receive a SupabaseClient as an argument.
import type { ApiResponse, Review } from '@/shared/lib/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'
import { logError } from '@/shared/lib/utils/logger'

export type { Review } from '@/shared/lib/types/database'

export interface SellerRating {
  averageRating: number
  totalReviews: number
  reviews: Review[]
}

export const reviewsApi = {
  /**
   * Creates a new review for a seller
   */
  async create(
    client: SupabaseClient,
    review: {
      recipient_id: string
      author_id: string
      listing_id?: string
      rating: number
      comment?: string
    }
  ): Promise<ApiResponse<Review>> {
    try {
      // Prevent self-reviews
      if (review.recipient_id === review.author_id) {
        return { data: null, error: 'You cannot review yourself' }
      }

      // Validate rating
      if (review.rating < 1 || review.rating > 5) {
        return { data: null, error: 'Rating must be between 1 and 5' }
      }

      const { data, error } = await client
        .from('reviews')
        .insert({
          seller_id: review.recipient_id,
          buyer_id: review.author_id,
          listing_id: review.listing_id || null,
          rating: review.rating,
          comment: review.comment || null,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      logError('reviewsApi.create', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Gets all reviews and average rating for a seller
   */
  async getForSeller(
    client: SupabaseClient,
    sellerId: string
  ): Promise<ApiResponse<SellerRating>> {
    try {
      const { data, error } = await client
        .from('reviews')
        .select(
          `
          *,
          author:profiles!reviews_buyer_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `
        )
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      const reviews = (data || []) as Review[]

      // Calculate average rating
      const totalReviews = reviews.length
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0

      return {
        data: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews,
          reviews,
        },
        error: null,
      }
    } catch (error) {
      logError('reviewsApi.getForSeller', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Checks if a user has already reviewed a seller for a specific listing
   */
  async hasReviewed(
    client: SupabaseClient,
    recipientId: string,
    authorId: string,
    listingId?: string
  ): Promise<ApiResponse<boolean>> {
    try {
      let query = client
        .from('reviews')
        .select('id')
        .eq('seller_id', recipientId)
        .eq('buyer_id', authorId)

      if (listingId) {
        query = query.eq('listing_id', listingId)
      }

      const { data, error } = await query.maybeSingle()

      if (error) {
        throw error
      }

      return { data: Boolean(data), error: null }
    } catch (error) {
      logError('reviewsApi.hasReviewed', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Deletes a review (only by the original buyer)
   */
  async delete(
    client: SupabaseClient,
    reviewId: string,
    authorId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await client
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('buyer_id', authorId)

      if (error) {
        throw error
      }

      return { data: true, error: null }
    } catch (error) {
      logError('reviewsApi.delete', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Gets reviews written by a specific buyer
   */
  async getByAuthor(
    client: SupabaseClient,
    authorId: string
  ): Promise<ApiResponse<Review[]>> {
    try {
      const { data, error } = await client
        .from('reviews')
        .select(
          `
                  *,
                  recipient:profiles!reviews_seller_id_fkey (
                    id,
                    display_name,
                    avatar_url
                  ),
                  listing:listings (
                    id,
                    title,
                    images
                  )
                `
        )
        .eq('buyer_id', authorId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return { data: data as unknown as Review[], error: null }
    } catch (error) {
      logError('reviewsApi.getByAuthor', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async reply(
    client: SupabaseClient,
    reviewId: string,
    reply: string
  ): Promise<ApiResponse<Review>> {
    try {
      const { data, error } = await client
        .from('reviews')
        .update({
          seller_reply: reply,
          seller_reply_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      logError('reviewsApi.reply', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
