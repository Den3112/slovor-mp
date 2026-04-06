// Static Pages API
import { supabase } from '@/shared/lib/supabase/client'
import type { ApiResponse, StaticPage } from '@/shared/lib/types/database'
export type { StaticPage } from '@/shared/lib/types/database'
import { logError } from '@/shared/lib/utils/logger'

export const pagesApi = {
  /**
   * List all static pages
   */
  async getAll(): Promise<ApiResponse<StaticPage[]>> {
    if (process.env.SKIP_ENV_VALIDATION === '1') {
      return { data: [], error: null }
    }
    try {
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .order('title', { ascending: true })

      if (error) throw error
      return { data: data as StaticPage[], error: null }
    } catch (error) {
      logError('pagesApi.getAll', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Get a single page by slug
   */
  async getBySlug(slug: string): Promise<ApiResponse<StaticPage>> {
    if (process.env.SKIP_ENV_VALIDATION === '1') {
      return { data: null as any, error: 'Build skip' }
    }
    try {
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error) throw error
      return { data: data as StaticPage, error: null }
    } catch (error) {
      logError('pagesApi.getBySlug', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Admin: Create a new static page
   */
  async create(page: Partial<StaticPage>): Promise<ApiResponse<StaticPage>> {
    try {
      const { data, error } = await supabase
        .from('static_pages')
        .insert(page)
        .select()
        .single()

      if (error) throw error
      return { data: data as StaticPage, error: null }
    } catch (error) {
      logError('pagesApi.create', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Admin: Update a static page
   */
  async update(
    id: string,
    page: Partial<StaticPage>
  ): Promise<ApiResponse<StaticPage>> {
    try {
      const { data, error } = await supabase
        .from('static_pages')
        .update({ ...page, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data: data as StaticPage, error: null }
    } catch (error) {
      logError('pagesApi.update', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Admin: Delete a static page
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('static_pages')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { data: true, error: null }
    } catch (error) {
      logError('pagesApi.delete', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
