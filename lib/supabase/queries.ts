// Supabase API queries
// Principle #3: One responsibility - THIS IS THE ONLY PLACE FOR DB QUERIES
// Principle #5: Errors are part of design

import { createClient } from '@supabase/supabase-js'
import type { Category, Listing, ApiResponse } from '../types/database'
export type { Category, Listing, ApiResponse }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

const supabase = createClient(supabaseUrl, supabaseKey)

// Categories API
export const categoriesApi = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },
}

// Listings API
export const listingsApi = {
  async getAll(options?: {
    categoryId?: string
    categorySlug?: string
    search?: string
    limit?: number
    priceMin?: number
    priceMax?: number
    condition?: 'new' | 'used'
    location?: string
    sort?: string  // Changed to string for flexibility
  }): Promise<ApiResponse<Listing[]>> {
    try {
      let query = supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('is_active', true)

      if (options?.categoryId) {
        query = query.eq('category_id', options.categoryId)
      }

      if (options?.categorySlug) {
        query = query.eq('category.slug', options.categorySlug)
      }

      if (options?.search) {
        query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
      }

      if (options?.priceMin !== undefined) {
        query = query.gte('price', options.priceMin)
      }

      if (options?.priceMax !== undefined) {
        query = query.lte('price', options.priceMax)
      }

      if (options?.condition) {
        query = query.eq('condition', options.condition)
      }

      if (options?.location && options.location !== 'all') {
        query = query.ilike('location', `%${options.location}%`)
      }

      // Sorting
      switch (options?.sort) {
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'price-low':
          query = query.order('price', { ascending: true })
          break
        case 'price-high':
          query = query.order('price', { ascending: false })
          break
        case 'views':
          query = query.order('views', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  async getById(id: string): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) throw error
      
      // Increment views
      await supabase
        .from('listings')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  async getFeatured(limit = 6): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .order('views', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },
}
