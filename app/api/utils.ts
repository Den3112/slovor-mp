import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import { type NextRequest, NextResponse } from 'next/server'

const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

export function createErrorResponse(
  message: string,
  status: number,
  details?: unknown
) {
  return NextResponse.json(
    { message, details },
    { status, headers: corsHeaders }
  )
}

export function createSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders })
}

export function getAuthenticatedClient(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return null
  }

  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) {
    return null
  }

  const supabaseUrl = env.SUPABASE_URL
  const supabaseAnonKey = env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

// Helper to handle OPTIONS requests for CORS
export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
