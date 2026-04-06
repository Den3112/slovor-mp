import { describe, it, expect } from 'vitest'
import { messageSchema, conversationSchema } from '../chat'

describe('Chat Validations', () => {
  describe('messageSchema', () => {
    it('validates a correct message input', () => {
      const input = {
        content: 'Dobrý deň, je tento inzerát stále aktuálny?',
        conversationId: 'conv-123',
      }
      const result = messageSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('fails if content is empty', () => {
      const input = {
        content: '',
        conversationId: 'conv-123',
      }
      const result = messageSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          'Správa nemôže byť prázdna.'
        )
      }
    })

    it('fails if content is too long', () => {
      const input = {
        content: 'a'.repeat(2001),
        conversationId: 'conv-123',
      }
      const result = messageSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          'Správa môže mať maximálne 2000 znakov.'
        )
      }
    })

    it('allows optional attachments', () => {
      const input = {
        content: 'Tu je fotka.',
        conversationId: 'conv-123',
        attachments: ['img1.jpg', 'img2.jpg'],
      }
      const result = messageSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  describe('conversationSchema', () => {
    it('validates a correct conversation input', () => {
      const input = {
        listingId: 'listing-123',
        sellerId: 'seller-456',
        buyerId: 'buyer-789',
      }
      const result = conversationSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('fails if any ID is missing', () => {
      const input = {
        listingId: 'listing-123',
        sellerId: 'seller-456',
      }
      const result = conversationSchema.safeParse(input as any)
      expect(result.success).toBe(false)
    })
  })
})
