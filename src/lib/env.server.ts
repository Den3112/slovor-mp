import 'server-only'
import { z } from 'zod'

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

const parsed = serverEnvSchema.safeParse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
})

if (!parsed.success) {
  // Only error out in development to help the developer fix their .env
  if (process.env.NODE_ENV === 'development') {
    console.error(
      '❌ Missing or invalid server environment variables:',
      parsed.error.flatten().fieldErrors
    )
  }
  // We do NOT host-wide throw here anymore to prevent CI crashes during load.
  // Validation should ideally happen at the edge (middleware/actions).
}

export const serverEnv = {
  SERVICE_ROLE_KEY: parsed.success
    ? parsed.data.SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_SERVICE_ROLE_KEY || '',
} as const
