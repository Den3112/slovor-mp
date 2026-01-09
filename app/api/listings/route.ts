import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createErrorResponse, createSuccessResponse, getAuthenticatedClient, corsHeaders } from '../utils'

export async function GET(req: NextRequest) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const searchParams = req.nextUrl.searchParams
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const offset = (page - 1) * limit

        // Filters
        const query = supabase
            .from('listings')
            .select('*, profiles(full_name, avatar_url)', { count: 'exact' })
            .eq('status', 'active')

        if (searchParams.get('search')) {
            const searchTerm = searchParams.get('search')!
            query.ilike('title', `%${searchTerm}%`)
        }

        if (searchParams.get('category')) {
            // Assuming category is slug, need lookup or passed ID. Using ID for simplicity as standard query param
            // If slug needed, would require join or separate lookup.
            // Let's assume ID for now based on standard filter patterns, or we could handle slug if we added a join
            query.eq('category_id', searchParams.get('category')!)
        }

        if (searchParams.get('min_price')) {
            query.gte('price', searchParams.get('min_price')!)
        }

        if (searchParams.get('max_price')) {
            query.lte('price', searchParams.get('max_price')!)
        }

        if (searchParams.get('location')) {
            query.ilike('location', `%${searchParams.get('location')!}%`)
        }

        // Sort
        const sort = searchParams.get('sort_by') || 'created_at'
        const order = searchParams.get('order') === 'asc' ? true : false
        query.order(sort, { ascending: order })

        // Pagination
        query.range(offset, offset + limit - 1)

        const { data, count, error } = await query

        if (error) {
            return createErrorResponse(error.message, 500)
        }

        return createSuccessResponse({
            data,
            total: count,
            page,
            limit
        })

    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500)
    }
}

export async function POST(req: NextRequest) {
    const supabase = getAuthenticatedClient(req)
    if (!supabase) {
        return createErrorResponse('Unauthorized', 401)
    }

    try {
        const body = await req.json()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return createErrorResponse('Unauthorized', 401)
        }

        // Add user_id to body
        const listingData = { ...body, user_id: user.id, status: 'active' }

        const { data, error } = await supabase
            .from('listings')
            .insert(listingData)
            .select()
            .single()

        if (error) {
            return createErrorResponse(error.message, 400)
        }

        return createSuccessResponse({
            message: 'Listing created successfully',
            listing_id: data.id,
            listing: data
        }, 201)

    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500)
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}
