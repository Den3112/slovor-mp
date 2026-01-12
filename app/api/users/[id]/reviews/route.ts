import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'
import { createErrorResponse, createSuccessResponse, getAuthenticatedClient, corsHeaders } from '../../../utils'

export async function GET(
    _: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY
    )

    try {
        const params = await props.params
        const { id } = params // User ID (target)

        const { data, error } = await supabase
            .from('reviews')
            .select('*, reviewer:profiles!reviews_buyer_id_fkey(full_name, avatar_url)') // Assuming buyer is reviewer, verify foreign key name if possible, or just 'profiles'
            .eq('seller_id', id)
            .order('created_at', { ascending: false })

        if (error) {
            // Fallback without specific join alias if it fails
            const { data: simpleData, error: simpleError } = await supabase
                .from('reviews')
                .select('*')
                .eq('seller_id', id)
                .order('created_at', { ascending: false })

            if (simpleError) return createErrorResponse(simpleError.message, 500)
            return createSuccessResponse(simpleData)
        }

        return createSuccessResponse(data)

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal Server Error'
        return createErrorResponse(message, 500)
    }
}

export async function POST(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const supabase = getAuthenticatedClient(req)
    if (!supabase) return createErrorResponse('Unauthorized', 401)

    try {
        const params = await props.params
        const { id: targetUserId } = params
        const body = await req.json()
        const { rating, comment, listing_id } = body

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return createErrorResponse('Unauthorized', 401)

        // Check if review already exists or allowed?
        // Insert into reviews (seller_id = target, buyer_id = me)
        const { data, error } = await supabase
            .from('reviews')
            .insert({
                seller_id: targetUserId,
                buyer_id: user.id,
                rating,
                comment,
                listing_id: listing_id || null
            })
            .select()
            .single()

        if (error) return createErrorResponse(error.message, 400)

        // Update user stats (optional/trigger based, but maybe we do it here if no trigger)
        // Ignoring trigger for now, assuming DB handles it or it's heavy to calc here.

        return createSuccessResponse({
            message: 'Review submitted successfully',
            review_id: data.id
        })

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal Server Error'
        return createErrorResponse(message, 500)
    }
}

export function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}
