// Blog API
import { supabase } from '@/shared/lib/supabase/client'
import type { ApiResponse, BlogPost } from '@/shared/lib/types/database'
export type { BlogPost } from '@/shared/lib/types/database'
import { logError } from '@/shared/lib/utils/logger'

export const blogApi = {
  /**
   * Gets published blog posts
   */
  async listPosts(params?: {
    limit?: number
    offset?: number
  }): Promise<ApiResponse<BlogPost[]>> {
    if (process.env.SKIP_ENV_VALIDATION === '1') {
      return { data: [], error: null }
    }
    try {
      let query = supabase
        .from('blog_posts')
        .select(
          `
          *,
          author:profiles (
            id,
            display_name,
            avatar_url
          )
        `
        )
        .eq('is_published', true)
        .order('published_at', { ascending: false })

      if (params?.limit) query = query.limit(params.limit)

      const { data, error } = await query

      if (error) throw error

      return { data: data as BlogPost[], error: null }
    } catch (error) {
      logError('blogApi.listPosts', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Gets a single post by slug
   */
  async getPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    if (process.env.SKIP_ENV_VALIDATION === '1') {
      return { data: null, error: 'Build skip' }
    }
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(
          `
          *,
          author:profiles (
            id,
            display_name,
            avatar_url
          )
        `
        )
        .eq('slug', slug)
        .single()

      if (error) throw error

      return { data: data as BlogPost, error: null }
    } catch (error) {
      logError('blogApi.getPostBySlug', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Admin: List all posts
   */
  async adminListPosts(): Promise<ApiResponse<BlogPost[]>> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data: data as BlogPost[], error: null }
    } catch (error) {
      logError('blogApi.adminListPosts', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Admin: Create a new blog post
   */
  async create(post: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(post)
        .select()
        .single()

      if (error) throw error
      return { data: data as BlogPost, error: null }
    } catch (error) {
      logError('blogApi.create', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Admin: Update a blog post
   */
  async update(
    id: string,
    post: Partial<BlogPost>
  ): Promise<ApiResponse<BlogPost>> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...post, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data: data as BlogPost, error: null }
    } catch (error) {
      logError('blogApi.update', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Admin: Delete a blog post
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)

      if (error) throw error
      return { data: true, error: null }
    } catch (error) {
      logError('blogApi.delete', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
