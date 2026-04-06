import { createClient } from '@supabase/supabase-js'
import { env } from '@/shared/lib/env'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  corsHeaders,
} from '@/app/api/utils'

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 128

/**
 * Validates password strength.
 * Requirements: min 8 chars, at least one uppercase, one lowercase, one digit.
 */
function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters`
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one digit'
  }
  return null
}

/**
 * Validates email format.
 */
function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Invalid email format'
  }
  if (email.length > 255) {
    return 'Email is too long'
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password) {
      return createErrorResponse('Email and password are required', 400)
    }

    // Input validation
    const emailError = validateEmail(email)
    if (emailError) {
      return createErrorResponse(emailError, 400)
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      return createErrorResponse(passwordError, 400)
    }

    // Sanitize name
    const sanitizedName = name ? String(name).trim().slice(0, 100) : undefined

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          display_name: sanitizedName,
        },
      },
    })

    if (error) {
      return createErrorResponse(error.message, 400)
    }

    return createSuccessResponse(
      {
        message: 'User registered successfully',
        user_id: data.user?.id,
        session: data.session,
      },
      201
    )
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
