import Stripe from 'stripe'

// Initialize Stripe only if key is available (prevents build failure)
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia' as any,
      typescript: true,
    })
  : ({} as Stripe) // Fallback to avoid crash, will fail at runtime if used

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'production') {
  console.warn('STRIPE_SECRET_KEY is missing. Stripe features will not work.')
}
