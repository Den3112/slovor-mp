import { z } from 'zod'

export const profileSchema = z.object({
    id: z.string().uuid(),
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
    display_name: z.string().min(1).max(50).nullable(),
    full_name: z.string().min(1).max(100).nullable(),
    avatar_url: z.string().url().nullable().optional(),
    bio: z.string().max(1000).nullable().optional(),
    phone: z.string().max(20).nullable().optional(),
    location: z.string().max(100).nullable().optional(),
    verified: z.boolean().default(false),
    preferred_currency: z.string().length(3).nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
})

export const profileUpdateSchema = profileSchema.omit({
    id: true,
    username: true,
    created_at: true,
}).partial()

export type ProfileSchema = z.infer<typeof profileSchema>
export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>
