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

