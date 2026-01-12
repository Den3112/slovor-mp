import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'
import { createErrorResponse, createSuccessResponse, corsHeaders } from '../../utils'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, password } = body

        if (!email || !password) {
            return createErrorResponse('Email and password are required', 400)
        }

        const supabase = createClient(
            env.SUPABASE_URL,
            env.SUPABASE_ANON_KEY
        )

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
            user: data.user
        })

    } catch (error) {
        return createErrorResponse((error as Error).message || 'Internal Server Error', 500)
    }
}

export function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}
