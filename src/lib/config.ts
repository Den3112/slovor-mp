import { env } from './env'

export const CONFIG = {
  site: {
    name: 'Slovor Marketplace',
    description: 'Prémiový bazár na Slovensku',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://slovor.sk',
  },
  api: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  limits: {
    maxImages: 15,
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxTitleLength: 100,
    maxDescriptionLength: 5000,
    compareLimit: 4,
    searchDebounce: 300,
  },
  features: {
    voiceSearch: true,
    realtimeChat: true,
    pwa: true,
    premiumListings: true,
  },
  auth: {
    redirectTo: '/profile',
  },
  app: {
    adminEmails: env.ADMIN_EMAILS,
  },
} as const

export const config = CONFIG

export type AppConfig = typeof CONFIG
