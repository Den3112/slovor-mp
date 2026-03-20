import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  getAuthenticatedClient,
  corsHeaders,
} from '../../../utils'

export async function GET(req: NextRequest) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) return createErrorResponse('Unauthorized', 401)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return createErrorResponse('Unauthorized', 401)

    const { data, error } = await supabase
      .from('favorites')
      .select('*, listings(*)')
      .eq('user_id', user.id)

    if (error) return createErrorResponse(error.message, 500)

    return createSuccessResponse(data)
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
