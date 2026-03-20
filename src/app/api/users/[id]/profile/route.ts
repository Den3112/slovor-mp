import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  corsHeaders,
} from '../../../utils'

export async function GET(
  _: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

  try {
    const params = await props.params
    const { id } = params
    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, display_name, avatar_url, rating, review_count, bio, is_verified, verification_level, created_at'
      )
      .eq('id', id)
      .single()

    if (error) return createErrorResponse('User not found', 404)

    return createSuccessResponse(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return createErrorResponse(message, 500)
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
