import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Map countries to supported locales
const COUNTRY_TO_LOCALE: Record<string, string> = {
  SK: 'sk', // Slovakia
  CZ: 'cs', // Czech Republic
  US: 'en', // United States
  GB: 'en', // United Kingdom
  CA: 'en', // Canada
  AU: 'en', // Australia
  // Add more mappings as needed
}

export async function GET() {
  try {
    const headersList = await headers()
    
    // Try to get country from Vercel's geo headers
    const country = headersList.get('x-vercel-ip-country') || 
                    headersList.get('cf-ipcountry') || // Cloudflare
                    null

    if (country && COUNTRY_TO_LOCALE[country]) {
      return NextResponse.json({
        locale: COUNTRY_TO_LOCALE[country],
        country,
        source: 'ip',
      })
    }

    // Fallback: try to detect from Accept-Language header
    const acceptLanguage = headersList.get('accept-language')
    if (acceptLanguage) {
      const parts = acceptLanguage.split(',')
      if (parts.length > 0 && parts[0]) {
        const browserLang = parts[0].split('-')[0]?.toLowerCase()
        if (browserLang && ['sk', 'cs', 'en'].includes(browserLang)) {
          return NextResponse.json({
            locale: browserLang,
            country: null,
            source: 'browser',
          })
        }
      }
    }

    // Default to English
    return NextResponse.json({
      locale: 'en',
      country: null,
      source: 'default',
    })
  } catch (error) {
    console.error('Error detecting locale:', error)
    return NextResponse.json(
      { locale: 'en', error: 'Failed to detect locale' },
      { status: 500 }
    )
  }
}
