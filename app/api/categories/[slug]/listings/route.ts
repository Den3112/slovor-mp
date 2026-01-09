import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createErrorResponse, createSuccessResponse, corsHeaders } from '../../../utils'

export async function GET(
    _: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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

    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500)
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}
