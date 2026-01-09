import { NextRequest, NextResponse } from 'next/server'
import { createErrorResponse, createSuccessResponse, getAuthenticatedClient, corsHeaders } from '../../../../utils'

export async function POST(req: NextRequest) {
    const supabase = getAuthenticatedClient(req)
    if (!supabase) return createErrorResponse('Unauthorized', 401)

    try {
        const body = await req.json()
        const { document_type, document_data } = body
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return createErrorResponse('Unauthorized', 401)

        const { error } = await supabase
            .from('user_verifications')
            .insert({
                user_id: user.id,
                document_type,
                document_data,
                status: 'pending'
            })

        if (error) return createErrorResponse(error.message, 400)

        return createSuccessResponse({ message: 'Verification request submitted' })

    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500)
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}
