import { createClient } from '@supabase/supabase-js'
import { env } from '@/shared/lib/env'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  createErrorResponse,
  createSuccessResponse,
  corsHeaders,
} from '@/app/api/utils'

export async function GET(_: NextRequest) {
  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      return createErrorResponse(error.message, 500)
    }

    return createSuccessResponse(data)
  } catch (error) {
    return createErrorResponse(
      (error as Error).message || 'Internal Server Error',
      500
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
    const body = await req.json()

    const { data, error } = await supabase
      .from('categories')
      .insert(body)
      .select()
      .single()

    if (error) return createErrorResponse(error.message, 400)
    return createSuccessResponse(data)
  } catch (error) {
    return createErrorResponse((error as Error).message, 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return createErrorResponse('Category ID is required', 400)

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return createErrorResponse(error.message, 400)
    return createSuccessResponse(data)
  } catch (error) {
    return createErrorResponse((error as Error).message, 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return createErrorResponse('Category ID is required', 400)

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) return createErrorResponse(error.message, 400)
    return createSuccessResponse({ success: true })
  } catch (error) {
    return createErrorResponse((error as Error).message, 500)
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
