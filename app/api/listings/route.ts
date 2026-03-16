export const runtime = 'edge'

import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createErrorResponse,
  createSuccessResponse,
  getAuthenticatedClient,
  corsHeaders,
} from '../utils'

const QuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => parseInt(v || '1')),
  limit: z
    .string()
    .optional()
    .transform((v) => parseInt(v || '10')),
  search: z.string().optional(),
  category: z.string().optional(),
  min_price: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : undefined)),
  max_price: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : undefined)),
  location: z.string().optional(),
  sort_by: z.enum(['created_at', 'price']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

    const searchParams = Object.fromEntries(req.nextUrl.searchParams)
    const result = QuerySchema.safeParse(searchParams)

    if (!result.success) {
      return createErrorResponse(
        'Invalid query parameters: ' +
          result.error.issues.map((e) => e.message).join(', '),
        400
      )
    }

    const {
      page,
      limit,
      search,
      category,
      min_price,
      max_price,
      location,
      sort_by,
      order,
    } = result.data
    const offset = (page - 1) * limit

    // Filters
    const query = supabase
      .from('listings')
      .select('*, profiles(display_name, avatar_url)', { count: 'exact' })
      .eq('status', 'active')

    if (search) {
      query.textSearch('title', search, {
        type: 'websearch',
        config: 'english',
      })
    }

    if (category) {
      query.eq('category_id', category)
    }

    if (min_price !== undefined) {
      query.gte('price', min_price)
    }

    if (max_price !== undefined) {
      query.lte('price', max_price)
    }

    if (location) {
      query.ilike('location', `%${location}%`)
    }

    // Sort
    query.order(sort_by, { ascending: order === 'asc' })

    // Pagination
    query.range(offset, offset + limit - 1)

    const { data, count, error } = await query

    if (error) {
      return createErrorResponse(error.message, 500)
    }

    return createSuccessResponse({
      data,
      total: count,
      page,
      limit,
    })
  } catch (error) {
    return createErrorResponse(
      (error as Error).message || 'Internal Server Error',
      500
    )
  }
}

export async function POST(req: NextRequest) {
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

    // Whitelist allowed fields for creation (Security Fix: Mass Assignment)
    const ListingSchema = z.object({
      title: z.string().min(3).max(100),
      description: z.string().min(10).max(5000),
      price: z.number().nonnegative(),
      currency: z.string().length(3).default('EUR'),
      category_id: z.string().uuid(),
      location: z.string().min(2),
      images: z.array(z.string().url()).default([]),
      condition: z.enum(['new', 'used']).default('used'),
      attributes: z.record(z.string(), z.any()).default({}),
    })

    const result = ListingSchema.safeParse(body)
    if (!result.success) {
      return createErrorResponse('Invalid input: ' + result.error.message, 400)
    }

    // Set secure fields from server state (not from body)
    const listingData = {
      ...result.data,
      user_id: user.id,
      status: 'active',
      views_count: 0,
      is_highlighted: false,
      promoted_until: null,
    }

    const { data, error } = await supabase
      .from('listings')
      .insert(listingData)
      .select()
      .single()

    if (error) {
      return createErrorResponse(error.message, 400)
    }

    return createSuccessResponse(
      {
        message: 'Listing created successfully',
        listing_id: data.id,
        listing: data,
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
