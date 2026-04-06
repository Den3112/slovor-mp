import { cache } from 'react'
import { createClient } from '@/shared/lib/supabase/server'
import type { Category, ApiResponse } from '@/shared/lib/types/database'
import { logError } from '@/shared/lib/utils/logger'

export const serverCategoriesApi = {
  /**
   * Fetches all categories for Server Components with deduplication
   */
  getAll: cache(async (): Promise<ApiResponse<Category[]>> => {
    try {
      const supabase = await createClient()

      const { data: categories, error } = await supabase
        .from('categories')
        .select('*, listings:listings(count)')
        .order('name')

      if (error) throw error

      const formattedData = (categories || []).map((cat: any) => ({
        ...cat,
        listing_count: cat.listings?.[0]?.count || 0,
      }))

      return { data: formattedData, error: null }
    } catch (error) {
      logError('serverCategoriesApi.getAll', error)
      return { data: null, error: (error as Error).message }
    }
  }),

  /**
   * Fetches a single category by slug for Server Components with deduplication
   */
  getBySlug: cache(async (slug: string): Promise<ApiResponse<Category>> => {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error) throw error
      if (!data) return { data: null, error: 'Category not found' }

      // Get listing count
      const { count } = await supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', data.id)
        .eq('status', 'active')

      return {
        data: {
          ...data,
          listing_count: count || 0,
        },
        error: null,
      }
    } catch (error) {
      logError('serverCategoriesApi.getBySlug', error)
      return { data: null, error: (error as Error).message }
    }
  }),
}
