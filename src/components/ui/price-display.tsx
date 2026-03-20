'use client'

import { useState, useEffect } from 'react'
import { useCurrency } from '@/components/providers/currency-provider'

interface PriceDisplayProps {
  amount: number
  baseCurrency?: string
  className?: string
  showOriginal?: boolean
}

export function PriceDisplay({
  amount,
  baseCurrency = 'EUR',
  className = '',
  showOriginal = false,
}: PriceDisplayProps) {
  const { formatPrice, currency, isLoading } = useCurrency()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // On server and initial render, show simple format to avoid hydration mismatch
  if (!mounted || isLoading) {
    // Use simple formatting without locale-dependent functions
    const simplePrice = Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    return (
      <span className={className} suppressHydrationWarning>
        {simplePrice} {baseCurrency}
      </span>
    )
  }

  const formattedPrice = formatPrice(amount, baseCurrency)
  const isConverted = currency !== baseCurrency

  return (
    <span className={className} suppressHydrationWarning>
      {formattedPrice}
      {showOriginal && isConverted && (
        <span
          className="text-muted-foreground ml-1 text-xs"
          suppressHydrationWarning
        >
          (~{amount.toLocaleString()} {baseCurrency})
        </span>
      )}
    </span>
  )
}
