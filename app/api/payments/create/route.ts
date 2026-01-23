import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  getAuthenticatedClient,
  corsHeaders,
} from '../../utils'

export async function POST(req: NextRequest) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) return createErrorResponse('Unauthorized', 401)

  try {
    const body = await req.json()
    const { listing_id, service_type, amount, currency } = body

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return createErrorResponse('Unauthorized', 401)

    // Create a pending record in payments_subscriptions
    const { data: paymentRecord, error } = await supabase
      .from('payments_subscriptions')
      .insert({
        user_id: user.id,
        listing_id: listing_id || null,
        service_type,
        amount,
        currency: currency || 'EUR',
        status: 'pending',
      })
      .select()
      .single()

    if (error) return createErrorResponse(error.message, 400)

    // Mock Payment Gateway URL generation
    // In real app, call Stripe/PayPal here
    const mockPaymentUrl = `https://mock-gateway.com/pay/${paymentRecord.id}?amount=${amount}&currency=${currency || 'EUR'}`

    return createSuccessResponse({
      payment_url: mockPaymentUrl,
      transaction_id: paymentRecord.id,
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
