import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  getAuthenticatedClient,
  corsHeaders,
} from '../../../../utils'

export async function POST(req: NextRequest) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) return createErrorResponse('Unauthorized', 401)

  try {
    const body = await req.json()
    const { type, document_url } = body
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return createErrorResponse('Unauthorized', 401)

    const { error } = await supabase.from('verifications').insert({
      user_id: user.id,
      type,
      document_url,
      status: 'pending',
    })

    if (error) return createErrorResponse(error.message, 400)

    return createSuccessResponse({ message: 'Verification request submitted' })
  } catch (error) {
    return createErrorResponse(
      (error as Error).message || 'Internal Server Error',
      500
    )
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
