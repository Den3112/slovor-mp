import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  getAuthenticatedClient,
  corsHeaders,
} from '../../../../utils'

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ listing_id: string }> }
) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) return createErrorResponse('Unauthorized', 401)

  try {
    const params = await props.params
    const { listing_id } = params
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return createErrorResponse('Unauthorized', 401)

    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, listing_id })

    if (error) {
      if (error.code === '23505')
        return createErrorResponse('Already favorited', 409)
      return createErrorResponse(error.message, 500)
    }

    return createSuccessResponse({ message: 'Listing added to favorites' })
  } catch (error) {
    return createErrorResponse(
      (error as Error).message || 'Internal Server Error',
      500
    )
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ listing_id: string }> }
) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) return createErrorResponse('Unauthorized', 401)

  try {
    const params = await props.params
    const { listing_id } = params
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return createErrorResponse('Unauthorized', 401)

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', listing_id)

    if (error) return createErrorResponse(error.message, 500)

    return createSuccessResponse({ message: 'Listing removed from favorites' })
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
