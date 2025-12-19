// Category API - Following 8 Principles
// Updated to match production schema (no parent_id, no is_active)

import { supabase } from './client'
import type { Category, ApiResponse } from '../types/database'

// Get all categories (production schema)
export async function getMainCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    return { data: null, error: (error as Error).message }
  }
}

// Get category by slug
export async function getCategoryBySlug(
  slug: string
): Promise<ApiResponse<Category>> {
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
}

// Get category by ID
export async function getCategoryById(
  id: string
): Promise<ApiResponse<Category>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: (error as Error).message }
  }
}

// Get categories with listing counts
export async function getCategoriesWithCounts(): Promise<
  ApiResponse<Category[]>
> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        listings:listings(count)
      `)
      .order('order_index', { ascending: true })

    if (error) throw error

    // Transform count
    const categoriesWithCounts = (data || []).map((cat: any) => ({
      ...cat,
      listings_count: cat.listings?.[0]?.count || 0,
      listings: undefined, // Remove temporary field
    }))

    return { data: categoriesWithCounts, error: null }
  } catch (error) {
    return { data: null, error: (error as Error).message }
  }
}
