'use server'

import { createClient } from '@/lib/supabase/server'
import { Listing, ApiResponse } from '@/lib/types/database'

export async function searchListings(
    query: string,
    limit: number = 5
): Promise<ApiResponse<Partial<Listing>[]>> {
    if (!query || query.length < 2) {
        return { data: [], error: null }
    }

    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('listings')
            .select('id, title, price, currency, images, category')
            .eq('status', 'active')
            .ilike('title', `%${query}%`)
            .limit(limit)

        if (error) {
            console.error('Search error:', error)
            return { data: null, error: 'Failed to search listings' }
        }

        // Map database result to ensure partial Listing compatibility if needed
        // In this case, standard select returns what we need
        const listings: Partial<Listing>[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            currency: item.currency,
            images: item.images,
            // @ts-ignore - Supabase join handling might be needed depending on detailed query, but simple select is fine for basic view
            category: item.category
        }))

        return { data: listings, error: null }
    } catch (err) {
        console.error('Search exception:', err)
        return { data: null, error: 'Unexpected error occurred' }
    }
}
