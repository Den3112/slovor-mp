// Category API - Following 8 Principles
import { supabase } from './client'
import type { Category, ApiResponse } from '../types/database'

// Get all root categories (no parent)
export async function getMainCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    return { data: null, error: (error as Error).message }
  }
}

// Get category with subcategories
export async function getCategoryWithSubcategories(
  slug: string
): Promise<ApiResponse<Category>> {
  try {
    // Get main category
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (categoryError) throw categoryError

    // Get subcategories
    const { data: subcategories, error: subError } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', category.id)
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (subError) throw subError

    return {
      data: { ...category, subcategories: subcategories || [] },
      error: null
    }
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
      .eq('is_active', true)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: (error as Error).message }
  }
}

// Get all categories with hierarchy
export async function getAllCategoriesWithHierarchy(): Promise<
  ApiResponse<Category[]>
> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error

    // Build hierarchy
    const categories = data || []
    const roots = categories.filter((c) => !c.parent_id)
    const children = categories.filter((c) => c.parent_id)

    roots.forEach((root) => {
      root.subcategories = children.filter((c) => c.parent_id === root.id)
    })

    return { data: roots, error: null }
  } catch (error) {
    return { data: null, error: (error as Error).message }
  }
}
