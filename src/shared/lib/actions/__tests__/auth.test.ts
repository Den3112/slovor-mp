import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signIn, signUp, signOut } from '@/app/[lang]/(auth)/actions'
import { createClient } from '@/shared/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Mock Supabase server client
vi.mock('@/shared/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Mock next/cache revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Auth Server Actions', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(createClient as any).mockResolvedValue(mockSupabase)
  })

  describe('signIn', () => {
    it('successfully signs in and redirects', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {},
        error: null,
      })

      await signIn(formData)

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
      expect(redirect).not.toHaveBeenCalled()
    })

    it('returns error message on failure', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrong')

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid credentials' },
      })

      const result = await signIn(formData)

      expect(result).toEqual({ error: 'Invalid credentials' })
      expect(redirect).not.toHaveBeenCalled()
    })
  })

  describe('signUp', () => {
    it('successfully signs up and returns success', async () => {
      const formData = new FormData()
      formData.append('email', 'new@example.com')
      formData.append('password', 'password123')
      formData.append('firstName', 'John')
      formData.append('lastName', 'Doe')

      mockSupabase.auth.signUp.mockResolvedValueOnce({ data: {}, error: null })

      const result = await signUp(formData)

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          data: {
            display_name: 'John Doe',
          },
          emailRedirectTo: expect.stringContaining('/api/auth/callback'),
        },
      })
      expect(result).toEqual({ success: true })
    })

    it('returns error message on signUp failure', async () => {
      const formData = new FormData()
      formData.append('email', 'existing@example.com')
      formData.append('password', 'password123')

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: null,
        error: { message: 'User already exists' },
      })

      const result = await signUp(formData)

      expect(result).toEqual({ error: 'User already exists' })
    })
  })

  describe('signOut', () => {
    it('calls signOut and redirects', async () => {
      await signOut('en')

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
      expect(redirect).toHaveBeenCalledWith('/en/login')
    })
  })
})
