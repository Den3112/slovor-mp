import '../app/globals.css'
import type { Preview, Decorator } from '@storybook/react'
import { ThemeProvider } from '../components/providers/theme-provider'
import { CurrencyProvider } from '../components/providers/currency-provider'
import { AuthProvider } from '../components/providers/auth-provider'
import React from 'react'

// Mock fetch for API calls in Storybook
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url

    if (url.includes('/api/exchange-rates')) {
      return new Response(
        JSON.stringify({
          base: 'EUR',
          rates: {
            USD: 1.08,
            CZK: 25.2,
            PLN: 4.32,
            UAH: 40.5,
            GBP: 0.86,
            RUB: 100,
          },
          updatedAt: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (url.includes('/api/geo')) {
      return new Response(
        JSON.stringify({
          country: 'Slovakia',
          countryCode: 'SK',
          city: 'Bratislava',
          currency: 'EUR',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return originalFetch(input, init)
  }
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    ((Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <CurrencyProvider>
            <Story />
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    )) as Decorator,
  ],
}

export default preview
