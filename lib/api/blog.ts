// Blog API
import { supabase } from '@/lib/supabase/client'
import type { ApiResponse, BlogPost } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export const blogApi = {
    /**
     * Gets published blog posts
     */
    async listPosts(params?: { limit?: number; offset?: number }): Promise<ApiResponse<BlogPost[]>> {
        try {
            let query = supabase
                .from('blog_posts')
                .select(`
          *,
          author:profiles (
            id,
            display_name,
            avatar_url
          )
        `)
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
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select(`
          *,
          author:profiles (
            id,
            display_name,
            avatar_url
          )
        `)
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
    }
}
