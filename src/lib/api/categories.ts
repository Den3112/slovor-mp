// Categories API
// Centralized API layer for categories management

import { supabase } from '@/lib/supabase/client'
import { withRetry } from '@/lib/supabase/utils'
import type { Category, ApiResponse } from '@/lib/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'
export type { Category }

export const categoriesApi = {
  /**
   * Fetches all categories with listing counts
   * @param client - Optional Supabase client (provide server client for server components)
   * @returns Array of categories ordered by name
   */
  async getAll(client?: SupabaseClient): Promise<ApiResponse<Category[]>> {
    const supabaseClient = client || supabase
    try {
      // Use resource embedding to get counts in a single query if possible,
      // but for filtering (is_active: true) we might still need some logic.
      // Let's try the simple approach first that fetches all at once.
      const { data: categories, error } = await withRetry<any>(() =>
        supabaseClient
          .from('categories')
          .select('*, listings:listings(count)')
          .order('name')
      )

      if (error) throw error

      const formattedData = (categories || []).map((cat: any) => ({
        ...cat,
        listing_count: cat.listings?.[0]?.count || 0,
      }))

      return { data: formattedData, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches single category by slug with listing count
   * @param slug - Category slug (e.g., 'electronics')
   * @param client - Optional Supabase client
   * @returns Category object or null if not found
   */
  async getBySlug(
    slug: string,
    client?: SupabaseClient
  ): Promise<ApiResponse<Category>> {
    const supabaseClient = client || supabase
    try {
      const { data, error } = await withRetry<any>(() =>
        supabaseClient
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .limit(1)
          .maybeSingle()
      )

      if (error) {
        throw error
      }

      if (!data) {
        return { data: null, error: 'Category not found' }
      }

      // Get listing count for this category
      const { count } = await withRetry<any>(() =>
        supabaseClient
          .from('listings')
          .select('id', { count: 'exact', head: true })
          .eq('category_id', data.id)
          .eq('is_active', true)
      )

      return {
        data: {
          ...data,
          listing_count: count || 0,
        },
        error: null,
      }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Creates a new category
   */
  async create(
    category: Omit<Category, 'id' | 'created_at'>
  ): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Updates an existing category
   */
  async update(
    id: string,
    updates: Partial<Category>
  ): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Deletes a category
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id)

      if (error) throw error
      return { data: undefined, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },
}
