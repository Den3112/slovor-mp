import { z } from 'zod'

export const listingConditionSchema = z.enum(['new', 'used'])

export const listingSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(5000),
    price: z.number().nonnegative(),
    currency: z.string().length(3),
    category_id: z.string().uuid().nullable(),
    user_id: z.string().uuid(),
    location: z.string().min(2),
    featured: z.boolean().default(false),
    images: z.array(z.string().url()).min(1),
    condition: listingConditionSchema,
    views: z.number().int().nonnegative().default(0),
    is_active: z.boolean().default(true),
    metadata: z.record(z.string(), z.any()).nullable().optional(),
    created_at: z.string(),
    updated_at: z.string(),
    expires_at: z.string().nullable().optional(),
})

export const listingCreateSchema = listingSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    views: true,
})

export const listingUpdateSchema = listingCreateSchema.partial()

export type ListingSchema = z.infer<typeof listingSchema>
export type ListingCreateSchema = z.infer<typeof listingCreateSchema>
export type ListingUpdateSchema = z.infer<typeof listingUpdateSchema>
