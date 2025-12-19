// Supabase API queries
// Principle #3: One responsibility - THIS IS THE ONLY PLACE FOR DB QUERIES
// Principle #5: Errors are part of design

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

const supabase = createClient(supabaseUrl, supabaseKey)

// Types - Principle #6: Clear naming
export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  listing_count?: number
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  image_url?: string
  category_id: string
  category?: Category
  created_at: string
  location?: string
  user_id: string
}

// Principle #5: Structured error responses
type ApiResponse<T> = 
  | { data: T; error: null }
  | { data: null; error: string }

// Categories API
export const categoriesApi = {
  // Principle #1: Small functions (< 15 lines)
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
    category?: string
    search?: string
    limit?: number
  }): Promise<ApiResponse<Listing[]>> {
    try {
      let query = supabase
        .from('listings')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false })

      if (options?.category) {
        query = query.eq('category_id', options.category)
      }

      if (options?.search) {
        query = query.ilike('title', `%${options.search}%`)
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
        .single()

      if (error) throw error
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
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },
}
