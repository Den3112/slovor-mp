import { z } from 'zod';

/**
 * Define your client-side environment variables schema here.
 * These must start with NEXT_PUBLIC_.
 */
const clientSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

/**
 * Define your server-side environment variables schema here.
 * These will not be available in the browser.
 */
const serverSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    // Add other server-only variables here
});

/**
 * Validate all environment variables.
 */
const processEnv = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

// Merge schemas
const merged = serverSchema.merge(clientSchema);

/** @type {z.infer<typeof merged>} */
let env = process.env;

if (process.env.NODE_ENV !== 'test') {
    const parsed = merged.safeParse(processEnv);

    if (parsed.success === false) {
        console.error(
            '❌ Invalid environment variables:',
            parsed.error.flatten().fieldErrors,
        );
        throw new Error('Invalid environment variables');
    }

    env = parsed.data;
}

export { env };
