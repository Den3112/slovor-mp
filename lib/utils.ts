import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sk-SK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatPrice(amount: number, currency = 'EUR') {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
