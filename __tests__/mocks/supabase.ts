// Enhanced Supabase mock for testing
import { vi } from 'vitest'

export const mockSupabaseClient = () => {
  let mockSingleResult: any = { data: null, error: null, count: null }

  const createMockChain = () => ({
    select: vi.fn(() => {
      if (mockSingleResult.count !== null) {
        // For count queries
        return {
          head: vi.fn(() => ({
            count: mockSingleResult.count,
            error: mockSingleResult.error,
          })),
        }
      }
      return mockChain
    }),
    insert: vi.fn(() => mockChain),
    update: vi.fn(() => mockChain),
    delete: vi.fn(() => mockChain),
    eq: vi.fn(() => mockChain),
    order: vi.fn(() => mockChain),
    limit: vi.fn(() => mockChain),
    single: vi.fn(() => mockSingleResult),
    range: vi.fn(() => mockChain),
    gte: vi.fn(() => mockChain),
    lte: vi.fn(() => mockChain),
    ilike: vi.fn(() => mockChain),
    or: vi.fn(() => mockChain),
    head: vi.fn(() => mockChain),
  })

  const mockChain = createMockChain()

  const setMockResult = (data: any, error: any = null, count: any = null) => {
    mockSingleResult = { data, error, count }
  }

  const getMockChain = () => mockChain

  return {
    supabase: {
      from: vi.fn(() => mockChain),
    },
    setMockResult,
    getMockChain,
  }
}
