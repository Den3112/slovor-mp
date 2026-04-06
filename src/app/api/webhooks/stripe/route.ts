import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/shared/lib/stripe'
import { createClient } from '@/shared/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  if (!signature) {
    return new NextResponse('Missing signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return new NextResponse(`Webhook Error: ${(error as Error).message}`, {
      status: 400,
    })
  }

  const supabase = await createClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const transactionId = session.metadata?.transaction_id
    const listingId = session.metadata?.listing_id
    const serviceType = session.metadata?.service_type

    if (transactionId) {
      // 1. Update Transaction Status
      const { error: txError } = await supabase
        .from('transactions') // Ensure table match
        .update({
          status: 'completed',
          provider_id: session.payment_intent as string,
          metadata: { ...session.metadata, stripe_session_id: session.id },
        })
        .eq('id', transactionId)

      if (txError) console.error('Error updating transaction:', txError)

      // 2. Apply Promotion to Listing
      if (listingId && serviceType) {
        const promotionDays = serviceType === 'promotion_top' ? 7 : 14
        const promotedUntil = new Date()
        promotedUntil.setDate(promotedUntil.getDate() + promotionDays)

        const { error: listingError } = await supabase
          .from('listings')
          .update({
            is_highlighted: true,
            promoted_until: promotedUntil.toISOString(),
            // Consider adding specific fields for 'top' vs 'highlight' if schema supports it
            // For now we treat both as 'is_highlighted' / 'promoted'
          })
          .eq('id', listingId)

        if (listingError)
          console.error('Error promoting listing:', listingError)

        // 3. Create Notification
        const { data: txData } = await supabase
          .from('transactions')
          .select('user_id')
          .eq('id', transactionId)
          .single()

        if (txData?.user_id) {
          await supabase.from('notifications').insert({
            user_id: txData.user_id,
            type: 'payment',
            title: '⚡ Promotion Active',
            content: `Your listing is now promoted until ${promotedUntil.toLocaleDateString()}.`,
            link: `/listings/${listingId}`,
            metadata: { listing_id: listingId, transaction_id: transactionId },
          })
        }
      }
    }
  }

  return new NextResponse(null, { status: 200 })
}
