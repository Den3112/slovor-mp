'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import type { ListingFormData } from '@/lib/utils/listing-form-schema'
import { revalidatePath } from 'next/cache'
import { validateListingContent } from '@/lib/moderation'

export async function updateListingAction(
  listingId: string,
  updates: ListingFormData,
  accessToken: string
) {
  try {
    // 1. Verify User
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(accessToken)

    if (authError || !user) {
      return { error: 'Unauthorized: Invalid session' }
    }

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

    // 4. Update Listing (Bypassing RLS via Admin Client)
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
  isActive: boolean,
  accessToken: string
) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(accessToken)

    if (authError || !user) {
      return { error: 'Unauthorized: Invalid session' }
    }

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

    revalidatePath('/dashboard/listings')
    revalidatePath(`/listings/${listingId}`)

    return { data: updated, error: null }
  } catch (err) {
    console.error('Action Error:', err)
    return { error: 'Internal Server Error' }
  }
}
