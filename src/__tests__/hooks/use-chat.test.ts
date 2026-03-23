import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useChat } from '@/hooks/use-chat'
import * as ReactQuery from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { MessageInput } from '@/lib/validations/chat'

// Mock Supabase Client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}))

// Mock React Query
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: vi.fn(),
  }
})

describe('useChat', () => {
  const mockConversationId = '123'
  const mockUserId = 'user1'
  let mockSupabase: any
  let mockQueryClient: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup Supabase Mock
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((cb) => {
        if (cb) return Promise.resolve(cb({ data: {}, error: null }))
        return Promise.resolve({ data: {}, error: null })
      }),
      channel: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
      }),
      removeChannel: vi.fn(),
    }
    vi.mocked(createClient).mockReturnValue(mockSupabase)

    // Setup Query Client Mock
    mockQueryClient = {
      setQueryData: vi.fn(),
      cancelQueries: vi.fn(),
      getQueryData: vi.fn(),
    }
    vi.mocked(ReactQuery.useQueryClient).mockReturnValue(mockQueryClient)

    // Default Query Mock with argument capture
    vi.mocked(ReactQuery.useQuery).mockImplementation(() => ({
      data: [{ id: 'm1', content: 'hello' }],
      isLoading: false,
    } as any))

    // Default Mutation Mock
    vi.mocked(ReactQuery.useMutation).mockImplementation(({ mutationFn, onMutate, onError, onSuccess }: any) => {
      const mutate = async (variables: any) => {
        const context = await onMutate?.(variables);
        try {
          const result = await mutationFn(variables);
          onSuccess?.(result, variables, context);
          return result;
        } catch (error) {
          onError?.(error, variables, context);
          throw error;
        }
      };
      return {
        mutate,
        isPending: false,
      } as any
    })
  })

  it('should initialize and mark as read', async () => {
    const { result } = renderHook(() => useChat(mockConversationId, mockUserId))
    expect(result.current.messages).toEqual([{ id: 'm1', content: 'hello' }])
    
    await result.current.markAsRead()
    expect(mockSupabase.from).toHaveBeenCalledWith('messages')
  })

  it('should cover queryFn error handling', async () => {
    renderHook(() => useChat(mockConversationId, mockUserId))
    
    const useQueryMock = vi.mocked(ReactQuery.useQuery)
    const firstCall = useQueryMock.mock.calls[0]
    if (!firstCall) throw new Error('useQuery not called')
    const callArgs = firstCall[0] as any
    expect(callArgs.queryFn).toBeDefined()

    // Test error case
    mockSupabase.order.mockResolvedValue({ data: null, error: new Error('RPC error') })
    await expect(callArgs.queryFn()).rejects.toThrow('RPC error')
    
    // Test success case
    const mockData = [{ id: 1 }]
    mockSupabase.order.mockResolvedValue({ data: mockData, error: null })
    const data = await callArgs.queryFn()
    expect(data).toBe(mockData)
  })

  it('should handle real-time postgres_changes', () => {
    renderHook(() => useChat(mockConversationId, mockUserId))
    
    const channel = mockSupabase.channel()
    const postgresCall = channel.on.mock.calls.find((c: any) => c[0] === 'postgres_changes')
    const postgresCallback = postgresCall?.[2]
    
    act(() => {
      postgresCallback({ new: { id: 'm2', content: 'new', sender_id: 'user2' } })
    })
    
    expect(mockQueryClient.setQueryData).toHaveBeenCalled()
  })

  it('should handle typing events', () => {
    const { result } = renderHook(() => useChat(mockConversationId, mockUserId))
    const channel = mockSupabase.channel()
    const typingCall = channel.on.mock.calls.find((c: any) => c[0] === 'broadcast' && c[1]?.event === 'typing')
    const typingCallback = typingCall?.[2]
    
    act(() => {
      typingCallback({ payload: { userId: 'user2', typing: true } })
    })
    expect(result.current.otherUserTyping).toBe(true)
  })

  it('should handle sendMessage success and failure', async () => {
    const { result } = renderHook(() => useChat(mockConversationId, mockUserId))
    const input: MessageInput = { content: 'test', conversationId: mockConversationId }
    
    mockSupabase.single.mockResolvedValue({ data: { id: 'new-id', ...input }, error: null })
    await act(async () => {
        await result.current.sendMessage(input)
    })
    expect(mockSupabase.insert).toHaveBeenCalled()

    // Failure
    mockSupabase.single.mockResolvedValue({ data: null, error: new Error('fail') })
    await expect(result.current.sendMessage(input)).rejects.toThrow('fail')
  })

  it('should handle sendTypingStatus', () => {
    const { result } = renderHook(() => useChat(mockConversationId, mockUserId))
    result.current.sendTypingStatus(true)
    expect(mockSupabase.channel().send).toHaveBeenCalled()
  })

  it('should cleanup', () => {
    const { unmount } = renderHook(() => useChat(mockConversationId, mockUserId))
    unmount()
    expect(mockSupabase.removeChannel).toHaveBeenCalled()
  })
})
