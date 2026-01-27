import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  getAuthenticatedClient,
  corsHeaders,
} from '../../utils'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) return createErrorResponse('Unauthorized', 401)

  try {
    const body = await req.json()
    const { listing_id, service_type, amount, currency } = body as {
      listing_id?: string
      service_type: string
      amount: number
      currency: string
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return createErrorResponse('Unauthorized', 401)

    // Create a pending record in transactions (using the new table name)
    const { data: transaction, error: dbError } = await supabase
      .from('transactions') // Was transactions, ensure we use the correct table
      .insert({
        user_id: user.id,
        amount,
        currency: currency || 'EUR',
        type: service_type, // promotion_top, promotion_highlight
        status: 'pending',
        metadata: { listing_id },
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB Error:', dbError)
      return createErrorResponse('Failed to create transaction record', 500)
    }

    // Create Stripe Session
    const origin = req.headers.get('origin') || 'http://localhost:3000'

    // Feature Name mapping
    const featureName = service_type === 'promotion_top' ? 'Top Position (7 Days)' : 'Premium Highlight (14 Days)'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency || 'EUR',
            product_data: {
              name: `Slovor Promotion: ${featureName}`,
              description: `Promoting listing ${listing_id}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/profile/wallet?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/listings/${listing_id}/promote?canceled=true`,
      metadata: {
        transaction_id: transaction.id,
        user_id: user.id,
        listing_id: listing_id || '',
        service_type,
      },
      client_reference_id: transaction.id,
    })

    if (!session.url) {
      return createErrorResponse('Failed to generate Stripe session', 500)
    }

    return createSuccessResponse({
      payment_url: session.url,
      transaction_id: transaction.id,
    })
  } catch (error) {
    console.error('Stripe Error:', error)
    return createErrorResponse(
      (error as Error).message || 'Internal Server Error',
      500
    )
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
