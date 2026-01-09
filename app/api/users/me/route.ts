import { NextRequest, NextResponse } from 'next/server'
import { createErrorResponse, createSuccessResponse, getAuthenticatedClient, corsHeaders } from '../../utils'

export async function GET(req: NextRequest) {
    const supabase = getAuthenticatedClient(req)
    if (!supabase) {
        return createErrorResponse('Unauthorized', 401)
    }

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return createErrorResponse('Unauthorized', 401)
        }

        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError) {
            console.error('Profile fetch error:', profileError)
            // Fallback to user data if profile missing (shouldn't happen with triggers)
            return createSuccessResponse({
                id: user.id,
                email: user.email,
                created_at: user.created_at
            })
        }

        return createSuccessResponse(profile)

    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500)
    }
}

export async function PUT(req: NextRequest) {
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

        const { error: updateError } = await supabase
            .from('profiles')
            .update(body)
            .eq('id', user.id)

        if (updateError) {
            return createErrorResponse(updateError.message, 400)
        }

        return createSuccessResponse({ message: 'User updated successfully' })

    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500)
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}
