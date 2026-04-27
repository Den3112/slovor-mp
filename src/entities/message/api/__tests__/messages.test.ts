import { describe, it, expect, vi, beforeEach } from 'vitest'
import { messagesApi } from '@/entities/message/api'
import { supabase } from '@/shared/lib/supabase/client'

// Mock dependencies
vi.mock('@/shared/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn(),
      single: vi.fn(),
      or: vi.fn(),
      order: vi.fn(),
      neq: vi.fn(),
      in: vi.fn(),
    })),
  },
}))

vi.mock('@/shared/lib/utils/logger', () => ({
  logError: vi.fn(),
}))

describe('messagesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getOrCreateConversation', () => {
    it('returns existing conversation', async () => {
      const mockConv = { id: 'conv-1', listing_id: 'l1' }
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockConv, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      const result = await messagesApi.getOrCreateConversation(supabase, 'l1', 'b1', 's1')

      expect(result.data).toEqual(mockConv)
      expect(supabase.from).toHaveBeenCalledWith('conversations')
    })

    it('creates new conversation if not exists', async () => {
      const mockChainFind = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }

      const mockNewConv = { id: 'new-conv' }
      const mockChainCreate = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockNewConv, error: null }),
      }

      ;(supabase.from as any)
        .mockReturnValueOnce(mockChainFind)
        .mockReturnValueOnce(mockChainCreate)

      const result = await messagesApi.getOrCreateConversation(supabase, 'l1', 'b1', 's1')

      expect(result.data).toEqual(mockNewConv)
    })
  })

  describe('getConversationsForUser', () => {
    it('fetches and formats conversations', async () => {
      const mockData = [
        { id: '1', messages: [{ id: 'm1', content: 'hi' }] },
        { id: '2', messages: [] },
      ]
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      const result = await messagesApi.getConversationsForUser(supabase, 'user-1')

      expect(result.data).toHaveLength(2)
      expect(result.data?.[0]?.last_message?.content).toBe('hi')
      expect(result.data?.[1]?.last_message).toBeNull()
    })
  })

  describe('sendMessage', () => {
    it('sends message and updates conversation timestamp', async () => {
      const mockMsg = { id: 'm1', content: 'hello' }
      const mockInsertChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockMsg, error: null }),
      }

      const mockUpdateChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      }

      ;(supabase.from as any)
        .mockReturnValueOnce(mockInsertChain)
        .mockReturnValueOnce(mockUpdateChain)

      const result = await messagesApi.sendMessage(supabase, 'c1', 'u1', ' hello ')

      expect(result.data?.content).toBe('hello') // trimmed
      expect(supabase.from).toHaveBeenCalledWith('messages')
      expect(supabase.from).toHaveBeenCalledWith('conversations')
    })

    it('returns error for empty message', async () => {
      const result = await messagesApi.sendMessage(supabase, 'c1', 'u1', '  ')
      expect(result.error).toBe('Message cannot be empty')
    })
  })

  describe('getUnreadCount', () => {
    it('calculates unread count correctly', async () => {
      const mockConvs = [{ id: 'c1' }, { id: 'c2' }]
      const mockConvChain = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockResolvedValue({ data: mockConvs, error: null }),
      }

      const mockMsgChain = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockResolvedValue({ count: 3, error: null }),
      }

      ;(supabase.from as any)
        .mockReturnValueOnce(mockConvChain)
        .mockReturnValueOnce(mockMsgChain)

      const result = await messagesApi.getUnreadCount(supabase, 'user-1')

      expect(result.data).toBe(3)
    })

    it('returns 0 if no conversations found', async () => {
      const mockConvChain = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockResolvedValue({ data: [], error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockConvChain)

      const result = await messagesApi.getUnreadCount(supabase, 'user-1')

      expect(result.data).toBe(0)
    })
  })
})
