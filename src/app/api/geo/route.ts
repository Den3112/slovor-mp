import { NextResponse } from 'next/server'
import { getGeoByIp } from '@/entities/listing/api/geo'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Get client IP from headers
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? (forwarded.split(',')[0] ?? '').trim() : null

  const geoData = await getGeoByIp(ip)

  return NextResponse.json({
    country: geoData.country,
    countryCode: geoData.countryCode,
    city: geoData.city,
    currency: geoData.currency,
  })
}
