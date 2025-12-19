// Database queries for Slovor Marketplace
// Pure functions with explicit error handling (Principles #1, #3, #5)

import { supabase } from './client'
import type {
  Listing,
  Category,
  ApiResponse,
  ApiListResponse,
} from '../types/database'

// Listings API
export const listingsApi = {
  // Get all listings with pagination (Principle #1: Minimize code)
  async getAll(
    page = 1,
    limit = 12,
    filters?: {
      search?: string
      categoryId?: string
      minPrice?: number
      maxPrice?: number
      location?: string
    }
  ): Promise<ApiListResponse<Listing>> {
    try {
      let query = supabase
        .from('listings')
        .select('*, category:categories(*), user:users(username, avatar_url, full_name)', {
          count: 'exact',
        })
        .eq('status', 'active')

      // Apply filters (Principle #4: Explicit is better)
      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }
      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice)
      }
      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice)
      }
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      const start = (page - 1) * limit
      const end = start + limit - 1

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(start, end)

      if (error) {
        console.error('[listingsApi.getAll] Error:', error)
        return { data: null, error: new Error(error.message) }
      }

      return {
        data: {
          items: (data as Listing[]) || [],
          total: count || 0,
          page,
          perPage: limit,
        },
        error: null,
      }
    } catch (err) {
      console.error('[listingsApi.getAll] Unexpected error:', err)
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Unknown error'),
      }
    }
  },

  // Get single listing by ID
  async getById(id: string): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*), user:users(username, avatar_url, full_name)')
        .eq('id', id)
        .single()

      if (error) {
        console.error('[listingsApi.getById] Error:', error)
        return { data: null, error: new Error(error.message) }
      }

      return { data: data as Listing, error: null }
    } catch (err) {
      console.error('[listingsApi.getById] Unexpected error:', err)
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Unknown error'),
      }
    }
  },

  // Get featured listings
  async getFeatured(limit = 6): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*), user:users(username, avatar_url, full_name)')
        .eq('status', 'active')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('[listingsApi.getFeatured] Error:', error)
        return { data: null, error: new Error(error.message) }
      }

      return { data: (data as Listing[]) || [], error: null }
    } catch (err) {
      console.error('[listingsApi.getFeatured] Unexpected error:', err)
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Unknown error'),
      }
    }
  },
}

// Categories API
export const categoriesApi = {
  // Get all categories
  async getAll(): Promise<ApiResponse<Category[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('[categoriesApi.getAll] Error:', error)
        return { data: null, error: new Error(error.message) }
      }

      return { data: (data as Category[]) || [], error: null }
    } catch (err) {
      console.error('[categoriesApi.getAll] Unexpected error:', err)
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Unknown error'),
      }
    }
  },

  // Get category by slug
  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('[categoriesApi.getBySlug] Error:', error)
        return { data: null, error: new Error(error.message) }
      }

      return { data: data as Category, error: null }
    } catch (err) {
      console.error('[categoriesApi.getBySlug] Unexpected error:', err)
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Unknown error'),
      }
    }
  },
}
