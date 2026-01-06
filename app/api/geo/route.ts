import { NextResponse } from 'next/server'
import { COUNTRY_CURRENCY_MAP, DEFAULT_CURRENCY, type CurrencyCode } from '@/lib/types/currency'

interface GeoApiResponse {
    status: string
    country: string
    countryCode: string
    city: string
}

export async function GET(request: Request) {
    try {
        // Get client IP from headers
        const forwarded = request.headers.get('x-forwarded-for')
        const ip = forwarded ? (forwarded.split(',')[0] ?? '').trim() : null

        // Skip for localhost
        if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            return NextResponse.json({
                country: 'Slovakia',
                countryCode: 'SK',
                city: 'Bratislava',
                currency: 'EUR' as CurrencyCode,
            })
        }

        // Query ip-api.com (free, no API key needed, 45 req/min limit)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, {
            next: { revalidate: 86400 }, // Cache for 24 hours
        })

        if (!response.ok) {
            throw new Error('Geo API failed')
        }

        const data: GeoApiResponse = await response.json()

        if (data.status !== 'success') {
            throw new Error('Geo lookup failed')
        }

        const currency: CurrencyCode = COUNTRY_CURRENCY_MAP[data.countryCode] || DEFAULT_CURRENCY

        return NextResponse.json({
            country: data.country,
            countryCode: data.countryCode,
            city: data.city,
            currency,
        })
    } catch (error) {
        console.warn('Geo API failed, using fallback location (Slovakia).')
        // Fallback to Slovakia/EUR
        return NextResponse.json({
            country: 'Slovakia',
            countryCode: 'SK',
            city: 'Unknown',
            currency: 'EUR' as CurrencyCode,
        })
    }
}
