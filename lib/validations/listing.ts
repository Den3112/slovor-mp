import * as z from 'zod'

export const listingConditionEnum = z.enum([
  'new',
  'like_new',
  'used',
  'refurbished',
])

export const createListingSchema = z.object({
  title: z
    .string()
    .min(10, {
      message: 'Názov musí mať aspoň 10 znakov.',
    })
    .max(100, {
      message: 'Názov môže mať maximálne 100 znakov.',
    }),
  description: z
    .string()
    .min(20, {
      message: 'Popis musí mať aspoň 20 znakov.',
    })
    .max(5000, {
      message: 'Popis môže mať maximálne 5000 znakov.',
    }),
  price: z.coerce.number().positive({
    message: 'Cena musí byť kladné číslo.',
  }),
  condition: listingConditionEnum,
  category: z.string().min(1, {
    message: 'Prosím, vyberte kategóriu.',
  }),
  location_region: z.string().min(1, { message: 'Kraj je povinný.' }),
  location_city: z.string().min(1, { message: 'Mesto je povinné.' }),
  location_zip: z.string().regex(/^\d{3}\s?\d{2}$/, {
    message: 'Neplatné PSČ.',
  }),
  contact_phone: z
    .string()
    .regex(/^(\+421|0)[2-9]\d{8}$/, {
      message: 'Neplatné slovenské telefónne číslo.',
    })
    .optional(),
  contact_email: z
    .string()
    .email({
      message: 'Neplatný e-mail.',
    })
    .optional(),
  images: z
    .array(z.any())
    .min(1, {
      message: 'Pridajte aspoň jednu fotografiu.',
    })
    .max(15, {
      message: 'Maximálne 15 fotografií.',
    }),
  is_premium: z.boolean().default(false),
})

export type CreateListingInput = z.infer<typeof createListingSchema>

export const listingFilterSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  condition: z.array(listingConditionEnum).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc']).optional(),
  page: z.coerce.number().int().positive().optional(),
})

export type ListingFilterInput = z.infer<typeof listingFilterSchema>
