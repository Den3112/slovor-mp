import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useChat } from '../index'
import { createClient } from '@/shared/lib/supabase/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      mutations: { retry: false },
    },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = 'QueryClientWrapper'
  return Wrapper
}

describe('useChat', () => {
  const mockConversationId = 'conv-123'
  const mockCurrentUserId = 'user-1'
  let mockSupabase: any
  let handlers: Record<string, Function> = {}

  beforeEach(() => {
    vi.clearAllMocks()
    handlers = {}

    const mockChannel = {
      on: vi.fn((event, filter, callback) => {
        const key =
          event === 'postgres_changes'
            ? `postgres_changes:${filter.event || ''}`
            : `broadcast:${filter.event || ''}`
        const actualCallback =
          callback || (typeof filter === 'function' ? filter : null)
        if (actualCallback) handlers[key] = actualCallback
        return mockChannel
      }),
      subscribe: vi.fn().mockReturnThis(),
      send: vi.fn(),
      then: vi
        .fn()
        .mockImplementation((cb) => cb && cb({ data: null, error: null })),
    }

    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn(),
      channel: vi.fn(() => mockChannel),
      removeChannel: vi.fn(),
      then: vi
        .fn()
        .mockImplementation((cb) => cb && cb({ data: null, error: null })),
    }

    vi.mocked(createClient).mockReturnValue(mockSupabase)
  })

  it('fetches initial messages', async () => {
    mockSupabase.order.mockResolvedValueOnce({
      data: [{ id: '1', content: 'test' }],
      error: null,
    })

    const { result } = renderHook(
      () => useChat(mockConversationId, mockCurrentUserId),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.messages).toEqual([{ id: '1', content: 'test' }])
  })

  it('handles real-time message insertion', async () => {
    mockSupabase.order.mockResolvedValueOnce({ data: [], error: null })
    mockSupabase.eq.mockReturnThis()

    const { result } = renderHook(
      () => useChat(mockConversationId, mockCurrentUserId),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const newMessage = { id: '2', content: 'new!', sender_id: 'user-2' }
    await act(async () => {
      const handler = handlers['postgres_changes:INSERT']
      if (handler) handler({ new: newMessage })
    })

    await waitFor(() =>
      expect(result.current.messages).toContainEqual(newMessage)
    )
  })

  it('handles broadcast typing status', async () => {
    mockSupabase.order.mockResolvedValueOnce({ data: [], error: null })
    const { result } = renderHook(
      () => useChat(mockConversationId, mockCurrentUserId),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      const handler = handlers['broadcast:typing']
      if (handler) handler({ payload: { userId: 'user-2', typing: true } })
    })
    expect(result.current.otherUserTyping).toBe(true)

    act(() => {
      const handler = handlers['broadcast:typing']
      if (handler) handler({ payload: { userId: 'user-2', typing: false } })
    })
    expect(result.current.otherUserTyping).toBe(false)
  })

  it('sends message with optimistic update', async () => {
    mockSupabase.order.mockResolvedValueOnce({ data: [], error: null })
    mockSupabase.single.mockResolvedValueOnce({
      data: { id: '3', content: 'sent' },
      error: null,
    })

    const { result } = renderHook(
      () => useChat(mockConversationId, mockCurrentUserId),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.sendMessage({
        content: 'optimistic',
        conversationId: mockConversationId,
      })
    })

    await waitFor(() => {
      expect(result.current.messages.length).toBe(1)
      expect(result.current.messages[0]).toMatchObject({
        content: 'optimistic',
        optimistic: true,
      })
    })

    await waitFor(() => expect(result.current.isSending).toBe(false))
  })

  it('reverts optimistic update on failure', async () => {
    mockSupabase.order.mockResolvedValueOnce({ data: [], error: null })

    // DELAY the failure to allow optimistic update to be observed
    mockSupabase.single.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () => resolve({ data: null, error: new Error('Database error') }),
            100
          )
        })
    )

    const { result } = renderHook(
      () => useChat(mockConversationId, mockCurrentUserId),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.sendMessage({
        content: 'fail',
        conversationId: mockConversationId,
      })
    })

    // 1. Observe optimistic
    await waitFor(() => expect(result.current.messages).toHaveLength(1))
    expect(result.current.messages[0]).toMatchObject({
      content: 'fail',
      optimistic: true,
    })

    // 2. Observe revert
    await waitFor(() => expect(result.current.messages).toHaveLength(0), {
      timeout: 2000,
    })
  })

  it('sends typing status via channel', () => {
    mockSupabase.order.mockResolvedValueOnce({ data: [], error: null })
    const { result } = renderHook(
      () => useChat(mockConversationId, mockCurrentUserId),
      {
        wrapper: createWrapper(),
      }
    )

    const channelMock = mockSupabase.channel()
    act(() => {
      result.current.sendTypingStatus(true)
    })

    expect(channelMock.send).toHaveBeenCalledWith({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: mockCurrentUserId, typing: true },
    })
  })
})
