// Reviews API
// Centralized API layer for seller reviews management

import { supabase } from '@/lib/supabase/client'
import type { ApiResponse, Review } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export type { Review } from '@/lib/types/database'

export interface SellerRating {
  averageRating: number
  totalReviews: number
  reviews: Review[]
}

export const reviewsApi = {
  /**
   * Creates a new review for a seller
   */
  async create(review: {
    seller_id: string
    buyer_id: string
    listing_id?: string
    rating: number
    comment?: string
  }): Promise<ApiResponse<Review>> {
    try {
      // Prevent self-reviews
      if (review.seller_id === review.buyer_id) {
        return { data: null, error: 'You cannot review yourself' }
      }

      // Validate rating
      if (review.rating < 1 || review.rating > 5) {
        return { data: null, error: 'Rating must be between 1 and 5' }
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          seller_id: review.seller_id,
          buyer_id: review.buyer_id,
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
  async getForSeller(sellerId: string): Promise<ApiResponse<SellerRating>> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(
          `
          *,
          buyer:profiles!reviews_buyer_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `
        )
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })

      console.log('API: getForSeller', { sellerId, data, error })

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
    sellerId: string,
    buyerId: string,
    listingId?: string
  ): Promise<ApiResponse<boolean>> {
    try {
      let query = supabase
        .from('reviews')
        .select('id')
        .eq('seller_id', sellerId)
        .eq('buyer_id', buyerId)

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
    reviewId: string,
    buyerId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('buyer_id', buyerId)

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
  async getByBuyer(buyerId: string): Promise<ApiResponse<Review[]>> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(
          `
                  *,
                  seller:profiles!reviews_seller_id_fkey (
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
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return { data: data as unknown as Review[], error: null }
    } catch (error) {
      logError('reviewsApi.getByBuyer', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
