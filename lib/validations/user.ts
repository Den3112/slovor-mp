import * as z from 'zod'

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'Meno musí mať aspoň 2 znaky.',
    })
    .optional(),
  lastName: z
    .string()
    .min(2, {
      message: 'Priezvisko musí mať aspoň 2 znaky.',
    })
    .optional(),
  phone: z
    .string()
    .regex(/^(\+421|0)[2-9]\d{8}$/, {
      message: 'Neplatné slovenské telefónne číslo.',
    })
    .optional()
    .or(z.literal('')),
  avatarUrl: z
    .string()
    .url({
      message: 'Neplatná URL adresa avatara.',
    })
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(500, {
      message: 'Bio môže mať maximálne 500 znakov.',
    })
    .optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const phoneVerificationSchema = z.object({
  phone: z.string().regex(/^(\+421|0)[2-9]\d{8}$/, {
    message: 'Neplatné slovenské telefónne číslo.',
  }),
  code: z.string().length(6, {
    message: 'Overovací kód musí mať 6 číslic.',
  }),
})

export type PhoneVerificationInput = z.infer<typeof phoneVerificationSchema>
