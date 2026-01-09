import { NextRequest, NextResponse } from 'next/server'
import { createErrorResponse, createSuccessResponse, getAuthenticatedClient, corsHeaders } from '../../../utils'

export async function PUT(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const supabase = getAuthenticatedClient(req)
    if (!supabase) return createErrorResponse('Unauthorized', 401)

    try {
        const params = await props.params
        const { id } = params
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return createErrorResponse('Unauthorized', 401)

        // Only receiver can mark as read
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', id)
            .eq('receiver_id', user.id)

        if (error) return createErrorResponse(error.message, 400)

        return createSuccessResponse({ message: 'Message marked as read' })

    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500)
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}
