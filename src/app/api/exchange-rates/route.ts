import { NextResponse } from 'next/server'
import { FALLBACK_RATES, type CurrencyCode } from '@/shared/lib/types/currency'

interface ExchangeRateApiResponse {
  result: string
  base_code: string
  rates: Record<string, number>
}

// Cache exchange rates in memory (server-side)
let cachedRates: {
  rates: Partial<Record<CurrencyCode, number>>
  timestamp: number
} | null = null

const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export async function GET() {
  try {
    // Check cache
    if (cachedRates && Date.now() - cachedRates.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        base: 'EUR',
        rates: cachedRates.rates,
        updatedAt: new Date(cachedRates.timestamp).toISOString(),
        cached: true,
      })
    }

    // Fetch from open.er-api.com (free, no API key required)
    const response = await fetch('https://open.er-api.com/v6/latest/EUR', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error('Exchange rate API failed')
    }

    const data: ExchangeRateApiResponse = await response.json()

    // open.er-api.com returns { result: "success", rates: { ... } }
    if (data.result !== 'success' || !data.rates) {
      console.error(
        'Exchange rate lookup failed payload:',
        JSON.stringify(data).substring(0, 500)
      )
      throw new Error('Exchange rate lookup failed')
    }

    // Extract only the currencies we support
    const rates: Partial<Record<CurrencyCode, number>> = {
      EUR: 1,
      USD: data.rates.USD ?? FALLBACK_RATES.USD,
      CZK: data.rates.CZK ?? FALLBACK_RATES.CZK,
      PLN: data.rates.PLN ?? FALLBACK_RATES.PLN,
      UAH: data.rates.UAH ?? FALLBACK_RATES.UAH,
      GBP: data.rates.GBP ?? FALLBACK_RATES.GBP,
    }

    // Update cache
    cachedRates = {
      rates,
      timestamp: Date.now(),
    }

    return NextResponse.json({
      base: 'EUR',
      rates,
      updatedAt: new Date().toISOString(),
      cached: false,
    })
  } catch (error) {
    console.error('Exchange rate API failed:', error)

    // Return fallback rates
    return NextResponse.json({
      base: 'EUR',
      rates: FALLBACK_RATES,
      updatedAt: new Date().toISOString(),
      fallback: true,
    })
  }
}
