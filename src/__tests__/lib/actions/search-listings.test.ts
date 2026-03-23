import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchListings } from '@/lib/actions/search-listings'

// Mock Supabase Server client
const { mockFrom } = vi.hoisted(() => {
  const chain: any = {
    select: vi.fn(),
    eq: vi.fn(),
    ilike: vi.fn(),
    limit: vi.fn(),
    then: vi.fn(),
  }
  chain.select.mockReturnValue(chain)
  chain.eq.mockReturnValue(chain)
  chain.ilike.mockReturnValue(chain)
  chain.limit.mockReturnValue(chain)
  chain.then.mockImplementation((cb: any) => cb({ data: [], error: null }))

  return {
    mockFrom: vi.fn(() => chain),
  }
})

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      from: mockFrom,
    })
  ),
}))

describe('searchListings action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset default implementation
    const chain = mockFrom() as any
    chain.then.mockImplementation((cb: any) => cb({ data: [], error: null }))
  })

  it('should return empty if query is too short', async () => {
    const result = await searchListings('a')
    expect(result.data).toEqual([])
    
    // We expect mockFrom to be called exactly 1 time in beforeEach, but not again in the test
    expect(mockFrom).toHaveBeenCalledTimes(1)
  })

  it('should return data successfully', async () => {
    const mockData = [
      { id: '1', title: 'Test Car', price: 100, currency: 'EUR', images: [] }
    ]
    const chain = mockFrom() as any
    chain.then.mockImplementation((cb: any) => cb({ data: mockData, error: null }))

    const result = await searchListings('test')
    
    expect(result.data).toEqual(mockData)
    expect(mockFrom).toHaveBeenCalledWith('listings')
    expect(chain.ilike).toHaveBeenCalledWith('title', '%test%')
  })

  it('should handle database error', async () => {
    const chain = mockFrom() as any
    chain.then.mockImplementation((cb: any) => cb({ data: null, error: { message: 'DB Error' } }))

    const result = await searchListings('test')
    
    expect(result.data).toBeNull()
    expect(result.error).toBe('Failed to search listings')
  })

  it('should handle exceptions', async () => {
    mockFrom.mockImplementationOnce(() => {
      throw new Error('Crash')
    })

    const result = await searchListings('test')
    
    expect(result.data).toBeNull()
    expect(result.error).toBe('Unexpected error occurred')
  })
})
