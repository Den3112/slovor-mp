import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  getAuthenticatedClient,
  corsHeaders,
} from '../../../utils'

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ user_id: string }> }
) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) return createErrorResponse('Unauthorized', 401)

  try {
    const params = await props.params
    const { user_id: otherUserId } = params
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return createErrorResponse('Unauthorized', 401)

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true })

    if (error) return createErrorResponse(error.message, 500)

    return createSuccessResponse(data)
  } catch (error) {
    return createErrorResponse(
      (error as Error).message || 'Internal Server Error',
      500
    )
  }
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ user_id: string }> }
) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) return createErrorResponse('Unauthorized', 401)

  try {
    const params = await props.params
    const { user_id: receiverId } = params
    const body = await req.json()
    const { content, listing_id } = body

    if (!content) return createErrorResponse('Content is required', 400)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return createErrorResponse('Unauthorized', 401)

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
        content,
        listing_id: listing_id || null,
      })
      .select()
      .single()

    if (error) return createErrorResponse(error.message, 400)

    return createSuccessResponse({
      message: 'Message sent',
      message_id: data.id,
      data,
    })
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
