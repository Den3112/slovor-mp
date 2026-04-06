import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, resetPasswordSchema } from '../auth'

describe('Auth Validations', () => {
  describe('loginSchema', () => {
    it('validates a correct login input', () => {
      const input = {
        email: 'test@example.com',
        password: 'password123',
      }
      const result = loginSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('fails on invalid email', () => {
      const input = {
        email: 'invalid-email',
        password: 'password123',
      }
      const result = loginSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          'Prosím, zadajte platnú e-mailovú adresu.'
        )
      }
    })

    it('fails on short password', () => {
      const input = {
        email: 'test@example.com',
        password: '12345',
      }
      const result = loginSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          'Heslo musí mať aspoň 6 znakov.'
        )
      }
    })
  })

  describe('registerSchema', () => {
    it('validates a correct registration input', () => {
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'securepassword123',
        confirmPassword: 'securepassword123',
      }
      const result = registerSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('fails if passwords do not match', () => {
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'securepassword123',
        confirmPassword: 'differentpassword',
      }
      const result = registerSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Heslá sa nezhodujú.')
      }
    })

    it('fails on short names', () => {
      const input = {
        firstName: 'J',
        lastName: 'D',
        email: 'john.doe@example.com',
        password: 'securepassword123',
        confirmPassword: 'securepassword123',
      }
      const result = registerSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(
          result.error.issues.some((e: any) => e.path.includes('firstName'))
        ).toBe(true)
        expect(
          result.error.issues.some((e: any) => e.path.includes('lastName'))
        ).toBe(true)
      }
    })

    it('fails on short password (8 chars)', () => {
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: '1234567',
        confirmPassword: '1234567',
      }
      const result = registerSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          'Heslo musí mať aspoň 8 znakov.'
        )
      }
    })
  })

  describe('resetPasswordSchema', () => {
    it('validates a correct email', () => {
      const input = { email: 'reset@example.com' }
      const result = resetPasswordSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('fails on invalid email', () => {
      const input = { email: 'not-an-email' }
      const result = resetPasswordSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })
})
