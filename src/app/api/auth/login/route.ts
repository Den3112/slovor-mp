import { createClient } from '@supabase/supabase-js'
import { env } from '@/shared/lib/env'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  corsHeaders,
} from '@/app/api/utils'

import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = LoginSchema.safeParse(body)

    if (!result.success) {
      return createErrorResponse(
        'Validation failed: ' +
          result.error.issues.map((e) => e.message).join(', '),
        400
      )
    }

    const { email, password } = result.data

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return createErrorResponse(error.message, 401)
    }

    return createSuccessResponse({
      access_token: data.session.access_token,
      token_type: 'bearer',
      expires_in: data.session.expires_in,
      user: data.user,
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
