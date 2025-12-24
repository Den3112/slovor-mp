import { NextRequest, NextResponse } from 'next/server'

// Country code to locale mapping
const COUNTRY_TO_LOCALE: Record<string, string> = {
  SK: 'sk', // Slovakia
  CZ: 'cs', // Czech Republic
  US: 'en',
  GB: 'en',
  // Add more mappings as needed
}

/**
 * Detect user locale based on IP geolocation
 * Uses Cloudflare's CF-IPCountry header or falls back to external API
 */
export async function GET(request: NextRequest) {
  try {
    // Try Cloudflare header first (if deployed on Vercel/Cloudflare)
    const cfCountry = request.headers.get('cf-ipcountry')
    if (cfCountry && COUNTRY_TO_LOCALE[cfCountry]) {
      return NextResponse.json({ 
        locale: COUNTRY_TO_LOCALE[cfCountry],
        country: cfCountry,
        source: 'cloudflare'
      })
    }

    // Try x-vercel-ip-country (Vercel Edge)
    const vercelCountry = request.headers.get('x-vercel-ip-country')
    if (vercelCountry && COUNTRY_TO_LOCALE[vercelCountry]) {
      return NextResponse.json({ 
        locale: COUNTRY_TO_LOCALE[vercelCountry],
        country: vercelCountry,
        source: 'vercel'
      })
    }

    // Fallback: try to get IP and use free geolocation API
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip')
    
    if (ip && ip !== '127.0.0.1' && !ip.startsWith('192.168.')) {
      // Use ip-api.com (free, no key required, 45 req/min limit)
      const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
        headers: { 'User-Agent': 'Slovor-Marketplace' }
      })
      
      if (geoResponse.ok) {
        const geoData = await geoResponse.json()
        const countryCode = geoData.countryCode
        
        if (countryCode && COUNTRY_TO_LOCALE[countryCode]) {
          return NextResponse.json({ 
            locale: COUNTRY_TO_LOCALE[countryCode],
            country: countryCode,
            source: 'ip-api'
          })
        }
      }
    }

    // Default to English
    return NextResponse.json({ 
      locale: 'en',
      country: null,
      source: 'default'
    })
  } catch (error) {
    console.error('Locale detection error:', error)
    return NextResponse.json({ 
      locale: 'en',
      country: null,
      source: 'error'
    })
  }
}
