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
            .select('id, title, price, currency, images') // Removed category as it's not strictly needed for basic search results
            .eq('status', 'active')
            .ilike('title', `%${query}%`)
            .limit(limit)

        if (error) {
            console.error('Search error:', error)
            return { data: null, error: 'Failed to search listings' }
        }

        // Map database result to ensure partial Listing compatibility
        const listings: Partial<Listing>[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            currency: item.currency,
            images: item.images
        }))

        return { data: listings, error: null }
    } catch (err) {
        console.error('Search exception:', err)
        return { data: null, error: 'Unexpected error occurred' }
    }
}
