import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createErrorResponse, createSuccessResponse, corsHeaders } from '../../utils'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, password, name } = body

        if (!email || !password) {
            return createErrorResponse('Email and password are required', 400)
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        })

        if (error) {
            return createErrorResponse(error.message, 400)
        }

        return createSuccessResponse({
            message: 'User registered successfully',
            user_id: data.user?.id,
            session: data.session
        }, 201)

    } catch (error: any) {
        return createErrorResponse(error.message || 'Internal Server Error', 500)
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}
