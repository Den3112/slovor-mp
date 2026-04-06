import { createClient } from '@supabase/supabase-js'
import { env } from '@/shared/lib/env'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  getAuthenticatedClient,
  corsHeaders,
} from '@/app/api/utils'
import { z } from 'zod'

export async function GET(
  _: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

  try {
    const params = await props.params
    const { id } = params
    const { data, error } = await supabase
      .from('listings')
      .select('*, profiles(*)')
      .eq('id', id)
      .single()

    if (error) {
      return createErrorResponse('Listing not found', 404)
    }

    // Increment views count
    // Using try-catch instead of .catch() because RPC returns a builder
    try {
      await supabase.rpc('increment_listing_views', { listing_id: id })
    } catch {
      // Ignore errors on view increment
    }

    return createSuccessResponse(data)
  } catch (error) {
    return createErrorResponse(
      (error as Error).message || 'Internal Server Error',
      500
    )
  }
}

const ListingUpdateSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(5000).optional(),
  price: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  category_id: z.string().uuid().optional(),
  location: z.string().min(2).optional(),
  images: z.array(z.string().url()).optional(),
  condition: z.enum(['new', 'used']).optional(),
  attributes: z.record(z.string(), z.any()).optional(),
})

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) {
    return createErrorResponse('Unauthorized', 401)
  }

  try {
    const params = await props.params
    const { id } = params
    const body = await req.json()
    const result = ListingUpdateSchema.safeParse(body)

    if (!result.success) {
      return createErrorResponse(
        'Validation failed: ' + result.error.message,
        400
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return createErrorResponse('Unauthorized', 401)

    // Verify ownership
    const { data: listing } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!listing || listing.user_id !== user.id) {
      return createErrorResponse('Forbidden', 403)
    }

    // Only allow updating validated fields
    const { error } = await supabase
      .from('listings')
      .update(result.data)
      .eq('id', id)

    if (error) {
      return createErrorResponse(error.message, 400)
    }

    return createSuccessResponse({ message: 'Listing updated successfully' })
  } catch (error) {
    return createErrorResponse(
      (error as Error).message || 'Internal Server Error',
      500
    )
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) {
    return createErrorResponse('Unauthorized', 401)
  }

  try {
    const params = await props.params
    const { id } = params
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return createErrorResponse('Unauthorized', 401)

    // Verify ownership will be handled by RLS, but double check good practice
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure only owner can delete via query too

    if (error) {
      return createErrorResponse(error.message, 400)
    }

    return createSuccessResponse({ message: 'Listing deleted successfully' })
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
