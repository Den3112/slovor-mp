// Supabase API queries
// Principle #3: One responsibility - THIS IS THE ONLY PLACE FOR DB QUERIES
// Principle #5: Errors are part of design

import { createClient } from '@supabase/supabase-js'
import type { Category, Listing, ApiResponse } from '../types/database'
export type { Category, Listing, ApiResponse }
import type { PostgrestError } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

const supabase = createClient(supabaseUrl, supabaseKey)



// Categories API
export const categoriesApi = {
  // Principle #1: Small functions (< 15 lines)
  async getAll(): Promise<ApiResponse<Category[]>> {
    try {
      // Fetch all active categories
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index')

      if (error) throw error

      // Build tree structure
      const categoriesMap = new Map<string, Category>()
      const roots: Category[] = []

      // First pass: create objects
      data?.forEach((row: any) => {
        categoriesMap.set(row.id, {
          ...row,
          subcategories: [], // Initialize subcategories
        })
      })

      // Second pass: link parents and children
      data?.forEach((row: any) => {
        if (row.parent_id) {
          const parent = categoriesMap.get(row.parent_id)
          if (parent) {
            parent.subcategories = parent.subcategories || []
            parent.subcategories.push(categoriesMap.get(row.id)!)
          }
        } else {
          roots.push(categoriesMap.get(row.id)!)
        }
      })

      return { data: roots, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*, subcategories:categories(*)') // recursive join for one level? Supabase doesn't support recursive easily, but we can fake it or just get parent
        .eq('slug', slug)
        .single()

      // For deep category page, we might want to know if it's a subcategory
      // And get its children if any. 
      // Simplified: Just get the category.

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
  }): Promise<ApiResponse<Listing[]>> {
    try {
      let query = supabase
        .from('listings')
        .select('*, category:categories!inner(*)')
        .order('created_at', { ascending: false })

      if (options?.categoryId) {
        query = query.eq('category_id', options.categoryId)
      }

      if (options?.categorySlug) {
        query = query.eq('category.slug', options.categorySlug)
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
