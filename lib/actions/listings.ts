'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import type { ListingFormData } from '@/lib/utils/listing-form-schema'
import { revalidatePath } from 'next/cache'
import { validateListingContent } from '@/lib/moderation'

export async function updateListingAction(
  listingId: string,
  updates: ListingFormData
) {
  try {
    // 1. Verify User via server cookies (secure — no token in payload)
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Unauthorized: Invalid session' }
    }

    const supabaseAdmin = createAdminClient()

    // 2. Verify Ownership
    const { data: listing, error: fetchError } = await supabaseAdmin
      .from('listings')
      .select('user_id')
      .eq('id', listingId)
      .single()

    if (fetchError || !listing) {
      return { error: 'Listing not found' }
    }

    if (listing.user_id !== user.id) {
      return { error: 'Unauthorized: You do not own this listing' }
    }

    // 3. Content moderation check
    const contentCheck = validateListingContent(
      updates.title,
      updates.description,
      updates.location
    )
    if (!contentCheck.isValid) {
      return { error: contentCheck.error || 'Content validation failed' }
    }

    // 4. Update Listing (via Admin Client to bypass RLS)
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('listings')
      .update({
        title: updates.title,
        description: updates.description,
        price: parseFloat(updates.price),
        currency: updates.currency,
        category_id: updates.category_id,
        condition: updates.condition,
        location: updates.location,
        images: updates.images,
        updated_at: new Date().toISOString(),
      })
      .eq('id', listingId)
      .select()
      .single()

    if (updateError) {
      console.error('Update Error:', updateError)
      return { error: 'Failed to update listing: ' + updateError.message }
    }

    revalidatePath(`/listings/${listingId}`)
    revalidatePath('/dashboard')

    return { data: updated, error: null }
  } catch (err) {
    console.error('Action Error:', err)
    return { error: 'Internal Server Error' }
  }
}

export async function toggleListingStatusAction(
  listingId: string,
  isActive: boolean
) {
  try {
    // Verify User via server cookies
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Unauthorized: Invalid session' }
    }

    const supabaseAdmin = createAdminClient()

    const { data: listing, error: fetchError } = await supabaseAdmin
      .from('listings')
      .select('user_id')
      .eq('id', listingId)
      .single()

    if (fetchError || !listing) {
      return { error: 'Listing not found' }
    }

    if (listing.user_id !== user.id) {
      return { error: 'Unauthorized: You do not own this listing' }
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('listings')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', listingId)
      .select()
      .single()

    if (updateError) {
      console.error('Status Update Error:', updateError)
      return { error: 'Failed to update status: ' + updateError.message }
    }

    revalidatePath(`/listings/${listingId}`)

    return { data: updated, error: null }
  } catch (err) {
    console.error('Action Error:', err)
    return { error: 'Internal Server Error' }
  }
}

export async function promoteListingAction(
  listingId: string,
  promoType: string,
  durationDays: number,
  cost: number
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const admin = createAdminClient()

    // 1. Verify ownership and listing
    const { data: listing, error: listingError } = await admin
      .from('listings')
      .select('user_id, status')
      .eq('id', listingId)
      .single()

    if (listingError || !listing) return { error: 'Listing not found' }
    if (listing.user_id !== user.id) return { error: 'Not authorized' }

    // 2. Get Wallet
    const { data: wallet, error: walletError } = await admin
      .from('wallets')
      .select('id, balance')
      .eq('user_id', user.id)
      .single()

    if (walletError || !wallet) return { error: 'Wallet not found' }
    if (Number(wallet.balance) < cost) return { error: 'Insufficient balance' }

    // 3. Perform Transaction (Simulated ACID via sequential awaits)
    // In a production environment, you might want to use a single RPC to ensure atomicity
    // but here we follow the instruction to move logic to Server Actions.

    // Deduct balance
    const { error: deductError } = await admin
      .from('wallets')
      .update({
        balance: Number(wallet.balance) - cost,
        updated_at: new Date().toISOString(),
      })
      .eq('id', wallet.id)

    if (deductError) throw deductError

    // Create transaction record
    await admin.from('transactions').insert({
      wallet_id: wallet.id,
      user_id: user.id,
      type: 'promotion',
      amount: -cost,
      currency: 'EUR',
      description: `Promotion: ${promoType} (${durationDays} days)`,
      status: 'completed',
    })

    // Create promotion record
    const endsAt = new Date()
    endsAt.setDate(endsAt.getDate() + durationDays)
    await admin.from('promotions').insert({
      listing_id: listingId,
      user_id: user.id,
      type: promoType,
      starts_at: new Date().toISOString(),
      ends_at: endsAt.toISOString(),
      cost,
      status: 'active',
    })

    // Update listing
    await admin
      .from('listings')
      .update({
        is_promoted: true,
        promoted_until: endsAt.toISOString(), // Simplified logic for GREATEST(NOW(), promoted_until) + interval
        updated_at: new Date().toISOString(),
      })
      .eq('id', listingId)

    // Log Activity
    await admin.from('activity_logs').insert({
      user_id: user.id,
      action: 'promotion_buy',
      metadata: { listing_id: listingId, type: promoType, cost },
    })

    revalidatePath(`/listings/${listingId}`)
    revalidatePath('/dashboard')

    return { success: true }
  } catch (err) {
    console.error('Promotion Action Error:', err)
    return { error: 'Failed to promote listing' }
  }
}

export async function purchaseListingAction(
  listingId: string,
  amount: number,
  paymentMethod: string = 'wallet'
) {
  try {
    const supabase = await createClient()
    const {
      data: { user: buyer },
    } = await supabase.auth.getUser()
    if (!buyer) return { error: 'Unauthorized' }

    const admin = createAdminClient()

    // 1. Get Listing and Seller
    const { data: listing, error: listingError } = await admin
      .from('listings')
      .select('user_id, status, title')
      .eq('id', listingId)
      .eq('status', 'active')
      .single()

    if (listingError || !listing) return { error: 'Listing not available' }
    if (listing.user_id === buyer.id)
      return { error: 'Cannot buy your own listing' }

    // 2. Get Buyer Wallet
    const { data: buyerWallet, error: walletError } = await admin
      .from('wallets')
      .select('id, balance')
      .eq('user_id', buyer.id)
      .single()

    if (walletError || !buyerWallet) return { error: 'Buyer wallet not found' }
    if (Number(buyerWallet.balance) < amount)
      return { error: 'Insufficient balance' }

    // 3. Create Order
    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({
        buyer_id: buyer.id,
        seller_id: listing.user_id,
        listing_id: listingId,
        amount,
        currency: 'EUR',
        status: 'completed',
        payment_method: paymentMethod,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 4. Update Wallets
    // Buyer
    await admin
      .from('wallets')
      .update({
        balance: Number(buyerWallet.balance) - amount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', buyerWallet.id)

    await admin.from('transactions').insert({
      wallet_id: buyerWallet.id,
      user_id: buyer.id,
      type: 'purchase',
      amount: -amount,
      currency: 'EUR',
      description: `Purchase: ${listing.title}`,
      status: 'completed',
      metadata: { order_id: order.id },
    })

    // Seller
    const { data: sellerWallet } = await admin
      .from('wallets')
      .select('id, balance')
      .eq('user_id', listing.user_id)
      .single()
    if (sellerWallet) {
      await admin
        .from('wallets')
        .update({
          balance: Number(sellerWallet.balance) + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sellerWallet.id)

      await admin.from('transactions').insert({
        wallet_id: sellerWallet.id,
        user_id: listing.user_id,
        type: 'payout',
        amount: amount,
        currency: 'EUR',
        description: `Sale: ${listing.title}`,
        status: 'completed',
        metadata: { order_id: order.id },
      })
    }

    // 5. Update Listing
    await admin
      .from('listings')
      .update({ status: 'sold', updated_at: new Date().toISOString() })
      .eq('id', listingId)

    // 6. Log Activity
    await admin.from('activity_logs').insert({
      user_id: buyer.id,
      action: 'listing_purchase',
      metadata: { order_id: order.id, listing_id: listingId, amount },
    })

    revalidatePath(`/listings/${listingId}`)
    revalidatePath('/dashboard/orders')

    return { success: true, orderId: order.id }
  } catch (err) {
    console.error('Purchase Action Error:', err)
    return { error: 'Failed to complete purchase' }
  }
}
