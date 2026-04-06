import { describe, it, expect, vi, beforeEach } from 'vitest'
import { adminApi } from '@/entities/admin/api'
import { createClient } from '@/shared/lib/supabase/client'
import { withRetry } from '@/shared/lib/supabase/utils'

// Mock dependencies
vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/shared/lib/supabase/utils', () => ({
  withRetry: vi.fn((fn) => fn()),
}))

vi.mock('@/shared/lib/utils/logger', () => ({
  logError: vi.fn(),
}))

describe('adminApi', () => {
  const mockSupabase = {
    from: vi.fn(() => ({
      select: vi.fn(),
      eq: vi.fn(),
      insert: vi.fn(),
      order: vi.fn(),
      limit: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(createClient as any).mockReturnValue(mockSupabase)
  })

  describe('getDashboardStats', () => {
    it('calculates dashboard stats from multiple parallel queries', async () => {
      // Mocking the Promise.all result inside withRetry
      const mockResponses = [
        { count: 100 }, // profiles
        { count: 500 }, // listings total
        { count: 400 }, // listings active
        { count: 50 }, // listings pending
        {
          data: [
            { amount: 10, type: 'promotion' },
            { amount: 20, type: 'subscription' },
            { amount: 5, type: 'other' },
          ],
          error: null,
        }, // transactions
        { count: 5 }, // reports pending
      ]

      ;(withRetry as any).mockResolvedValue(mockResponses)

      const result = await adminApi.getDashboardStats()

      expect(result.data).toEqual({
        totalUsers: 100,
        totalListings: 500,
        activeListings: 400,
        pendingModeration: 50,
        totalRevenue: 30, // 10 + 20
        totalTransactions: 3,
        recentReports: 5,
      })
    })

    it('handles errors in dashboard stats', async () => {
      ;(withRetry as any).mockImplementationOnce(() => {
        throw new Error('Stats Error')
      })
      const result = await adminApi.getDashboardStats()
      expect(result.error).toBe('Stats Error')
    })
  })

  describe('logAction', () => {
    it('successfully logs an admin action', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'admin-1' } },
      })

      const mockInsertChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
      ;(mockSupabase.from as any).mockReturnValue(mockInsertChain)

      const action = {
        target_id: 'l1',
        target_type: 'listing' as const,
        action_type: 'approve' as const,
        reason: 'ok',
      }

      const result = await adminApi.logAction(action)

      expect(result.error).toBeNull()
      expect(mockSupabase.from).toHaveBeenCalledWith('admin_actions')
      expect(mockInsertChain.insert).toHaveBeenCalledWith([
        {
          admin_id: 'admin-1',
          ...action,
        },
      ])
    })

    it('throws error if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      const result = await adminApi.logAction({
        target_id: '1',
        target_type: 'user',
        action_type: 'ban',
      })
      expect(result.error).toBe('Not authenticated')
    })
  })

  describe('getActivityLogs', () => {
    it('fetches ordered activity logs', async () => {
      const mockLogs = [{ id: 'log1' }, { id: 'log2' }]
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockLogs, error: null }),
      }
      ;(mockSupabase.from as any).mockReturnValue(mockChain)

      const result = await adminApi.getActivityLogs(10)

      expect(result.data).toEqual(mockLogs)
      expect(mockChain.limit).toHaveBeenCalledWith(10)
    })
  })
})
