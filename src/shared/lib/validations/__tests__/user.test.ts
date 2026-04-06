import { describe, it, expect } from 'vitest'
import { updateProfileSchema, phoneVerificationSchema } from '../user'

describe('User Validations', () => {
  describe('updateProfileSchema', () => {
    const validProfile = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '0912345670',
      avatarUrl: 'https://example.com/avatar.jpg',
      bio: 'Just a regular seller.',
    }

    it('validates a correct profile input', () => {
      const result = updateProfileSchema.safeParse(validProfile)
      expect(result.success).toBe(true)
    })

    it('allows optional fields to be empty strings', () => {
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '',
        avatarUrl: '',
        bio: '',
      }
      const result = updateProfileSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('fails on invalid phone number', () => {
      const input = { ...validProfile, phone: '123' }
      const result = updateProfileSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          'Neplatné slovenské telefónne číslo.'
        )
      }
    })

    it('fails on invalid URL', () => {
      const input = { ...validProfile, avatarUrl: 'invalid-url' }
      const result = updateProfileSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('fails on long bio', () => {
      const input = { ...validProfile, bio: 'a'.repeat(501) }
      const result = updateProfileSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })

  describe('phoneVerificationSchema', () => {
    it('validates a correct verification input', () => {
      const input = {
        phone: '0912345670',
        code: '123456',
      }
      const result = phoneVerificationSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('fails on wrong code length', () => {
      const input = {
        phone: '0912345670',
        code: '12345',
      }
      const result = phoneVerificationSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })
})
