import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  getAuthenticatedClient,
  corsHeaders,
} from '../../../../utils'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) return createErrorResponse('Unauthorized', 401)

  try {
    const body = await req.json()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return createErrorResponse('Unauthorized', 401)

    const VerificationSchema = z.object({
      type: z.enum(['id_card', 'passport', 'driver_license']),
      document_url: z.string().url(),
    })

    const result = VerificationSchema.safeParse(body)
    if (!result.success) {
      return createErrorResponse('Invalid input: ' + result.error.message, 400)
    }

    const { error } = await supabase.from('verifications').insert({
      user_id: user.id,
      ...result.data,
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
