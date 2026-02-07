// Categories API
// Centralized API layer for categories management

import { supabase } from '@/lib/supabase/client'
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
      const { data: categories, error: catError } = await supabaseClient
        .from('categories')
        .select('*')
        .order('name')

      if (catError) {
        throw catError
      }

      // Get listing counts for each category
      const categoriesWithCount = await Promise.all(
        (categories || []).map(async (category) => {
          const { count } = await supabaseClient
            .from('listings')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('is_active', true)

          return {
            ...category,
            listing_count: count || 0,
          }
        })
      )

      return { data: categoriesWithCount, error: null }
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
      const { data, error } = await supabaseClient
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .limit(1)
        .maybeSingle()

      if (error) {
        throw error
      }

      // Get listing count for this category
      const { count } = await supabaseClient
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', data.id)
        .eq('is_active', true)

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
