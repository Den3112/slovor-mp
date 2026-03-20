'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema, registerSchema } from '@/lib/validations/auth'
import { revalidatePath } from 'next/cache'

export async function signIn(formData: FormData, _locale: string = 'en') {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const result = loginSchema.safeParse({ email, password })

  if (!result.success) {
    return { error: 'Invalid fields' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signUp(formData: FormData, _locale: string = 'en') {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  const result = registerSchema.safeParse({
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
  })

  if (!result.success) {
    return { error: 'Invalid fields' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${_locale}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}
