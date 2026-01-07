import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getGeoByIp } from '@/lib/geo'

export async function POST(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options: _ }) =>
                            request.cookies.set(name, value)
                        )
                    },
                },
            }
        )

        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const forwarded = request.headers.get('x-forwarded-for')
        const ip = forwarded ? (forwarded.split(',')[0] ?? '').trim() : null
        const userAgent = request.headers.get('user-agent') ?? 'unknown'
        const geo = await getGeoByIp(ip)

        const { error: insertError } = await supabase.from('access_logs').insert({
            user_id: user.id,
            email: user.email,
            ip_address: ip || 'unknown',
            country: geo.country,
            city: geo.city,
            user_agent: userAgent,
            login_method: 'email'
        })

        if (insertError) {
            console.error('Error logging access:', insertError)
            return NextResponse.json({ error: 'Failed to log' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('Unexpected error logging access:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
