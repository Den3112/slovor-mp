import 'server-only'
import { z } from 'zod'

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

const parsed = serverEnvSchema.safeParse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
})

if (!parsed.success) {
  console.error(
    '❌ Missing or invalid server environment variables:',
    parsed.error.flatten().fieldErrors
  )
  throw new Error('Invalid server environment variables')
}

export const serverEnv = {
  SERVICE_ROLE_KEY: parsed.data.SUPABASE_SERVICE_ROLE_KEY,
} as const
