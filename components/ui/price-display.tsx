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
    showOriginal = false
}: PriceDisplayProps) {
    const { formatPrice, currency, isLoading } = useCurrency()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // On server and initial render, show simple format to avoid hydration mismatch
    if (!mounted || isLoading) {
        return (
            <span className={className} suppressHydrationWarning>
                {amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {baseCurrency}
            </span>
        )
    }

    const formattedPrice = formatPrice(amount, baseCurrency)
    const isConverted = currency !== baseCurrency

    return (
        <span className={className} suppressHydrationWarning>
            {formattedPrice}
            {showOriginal && isConverted && (
                <span className="ml-1 text-xs text-muted-foreground" suppressHydrationWarning>
                    (~{amount.toLocaleString()} {baseCurrency})
                </span>
            )}
        </span>
    )
}
