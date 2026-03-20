import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Map countries to supported languages
const COUNTRY_TO_LANG: Record<string, string> = {
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
    const country =
      headersList.get('x-vercel-ip-country') ||
      headersList.get('cf-ipcountry') || // Cloudflare
      null

    if (country && COUNTRY_TO_LANG[country]) {
      return NextResponse.json({
        lang: COUNTRY_TO_LANG[country],
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
            lang: browserLang,
            country: null,
            source: 'browser',
          })
        }
      }
    }

    // Default to English
    return NextResponse.json({
      lang: 'en',
      country: null,
      source: 'default',
    })
  } catch (error) {
    console.error('Error detecting language:', error)
    return NextResponse.json(
      { lang: 'en', error: 'Failed to detect language' },
      { status: 500 }
    )
  }
}
