import { createClient } from '@/lib/supabase/client'
import { Listing } from '@/components/features/dashboard/user/listings-view/types'

export const listingsApi = {
  getAll: async () => {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('listings')
      .select('*, profiles(full_name, avatar_url)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as (Listing & {
      profiles?: { full_name?: string; avatar_url?: string }
    })[]
  },

  getById: async (id: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('listings')
      .select('*, profiles(full_name, avatar_url)')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data as
      | (Listing & { profiles?: { full_name?: string; avatar_url?: string } })
      | null
  },

  getByCategory: async (categoryId: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('listings')
      .select('*, profiles(full_name, avatar_url)')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as (Listing & {
      profiles?: { full_name?: string; avatar_url?: string }
    })[]
  },
}
