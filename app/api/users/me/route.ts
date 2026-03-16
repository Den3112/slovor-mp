import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  getAuthenticatedClient,
  corsHeaders,
} from '../../utils'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) {
    return createErrorResponse('Unauthorized', 401)
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return createErrorResponse('Unauthorized', 401)
    }

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // Fallback to user data if profile missing (shouldn't happen with triggers)
      return createSuccessResponse({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      })
    }

    return createSuccessResponse(profile)
  } catch (error) {
    return createErrorResponse(
      (error as Error).message || 'Internal Server Error',
      500
    )
  }
}

export async function PUT(req: NextRequest) {
  const supabase = getAuthenticatedClient(req)
  if (!supabase) {
    return createErrorResponse('Unauthorized', 401)
  }

  try {
    const body = await req.json()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return createErrorResponse('Unauthorized', 401)
    }

    // Whitelist allowed fields for update (Security Fix: Mass Assignment)
    const ProfileUpdateSchema = z.object({
      display_name: z.string().min(2).max(50).optional(),
      avatar_url: z.string().url().optional().or(z.literal('')),
      bio: z.string().max(500).optional(),
      location: z.string().max(100).optional(),
      phone_number: z.string().max(20).optional(),
      website: z.string().url().optional().or(z.literal('')),
    })

    const result = ProfileUpdateSchema.safeParse(body)
    if (!result.success) {
      return createErrorResponse('Invalid input: ' + result.error.message, 400)
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(result.data)
      .eq('id', user.id)

    if (updateError) {
      return createErrorResponse(updateError.message, 400)
    }

    return createSuccessResponse({ message: 'User updated successfully' })
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
