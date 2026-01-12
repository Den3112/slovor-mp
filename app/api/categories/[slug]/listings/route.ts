import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'
import { createErrorResponse, createSuccessResponse, corsHeaders } from '../../../utils'

export async function GET(
    _: NextRequest,
    props: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await props.params
        const { slug } = params

        const supabase = createClient(
            env.SUPABASE_URL,
            env.SUPABASE_ANON_KEY
        )

        // First get category ID
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', slug)
            .single()

        if (catError || !category) {
            return createErrorResponse('Category not found', 404)
        }

        // Then get listings
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('category_id', category.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })

        if (error) {
            return createErrorResponse(error.message, 500)
        }

        return createSuccessResponse(data)

    } catch (error) {
        return createErrorResponse((error as Error).message || 'Internal Server Error', 500)
    }
}

export function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}
