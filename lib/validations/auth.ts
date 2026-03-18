import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Prosím, zadajte platnú e-mailovú adresu.',
  }),
  password: z.string().min(6, {
    message: 'Heslo musí mať aspoň 6 znakov.',
  }),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    firstName: z.string().min(2, {
      message: 'Meno musí mať aspoň 2 znaky.',
    }),
    lastName: z.string().min(2, {
      message: 'Priezvisko musí mať aspoň 2 znaky.',
    }),
    email: z.string().email({
      message: 'Prosím, zadajte platnú e-mailovú adresu.',
    }),
    password: z.string().min(8, {
      message: 'Heslo musí mať aspoň 8 znakov.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Heslá sa nezhodujú.',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

export const resetPasswordSchema = z.object({
  email: z.string().email({
    message: 'Prosím, zadajte platnú e-mailovú adresu.',
  }),
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
