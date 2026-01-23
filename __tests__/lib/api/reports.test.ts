import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reportsApi, type ReportReason } from '@/lib/api/reports'
import { supabase } from '@/lib/supabase/client'

describe('reportsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('creates a new report successfully', async () => {
      const reportData = {
        reporter_id: 'user1',
        reported_listing_id: 'listing1',
        reason: 'spam' as ReportReason,
        description: 'test',
      }
      const mockReport = { id: '1', ...reportData, status: 'open' }

      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: mockReport, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })

      vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any)

      const response = await reportsApi.create(reportData)
      expect(response.error).toBeNull()
      expect(response.data).toEqual(mockReport)
    })

    it('fails if neither listing nor user reported', async () => {
      const response = await reportsApi.create({
        reporter_id: 'user1',
        reason: 'spam',
      })
      expect(response.error).toBe('Must report either a listing or a user')
    })

    it('fails if reporting self', async () => {
      const response = await reportsApi.create({
        reporter_id: 'user1',
        reported_user_id: 'user1',
        reason: 'spam',
      })
      expect(response.error).toBe('You cannot report yourself')
    })
  })

  describe('list', () => {
    it('fetches reports with filters', async () => {
      const rangeMock = vi
        .fn()
        .mockResolvedValue({ data: [], count: 0, error: null })
      const limitMock = vi.fn().mockReturnValue({ range: rangeMock })
      const eqMock = vi.fn().mockReturnValue({ limit: limitMock })
      const orderMock = vi.fn().mockReturnValue({ eq: eqMock })
      const selectMock = vi.fn().mockReturnValue({ order: orderMock })

      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      await reportsApi.list({ status: 'open', limit: 10, offset: 0 })

      expect(selectMock).toHaveBeenCalledWith('*', { count: 'exact' })
      expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(eqMock).toHaveBeenCalledWith('status', 'open')
      expect(limitMock).toHaveBeenCalledWith(10)
      expect(rangeMock).toHaveBeenCalledWith(0, 9)
    })

    it('fetches without params', async () => {
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: [], count: 0, error: null })
      const selectMock = vi.fn().mockReturnValue({ order: orderMock })
      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      await reportsApi.list()
      expect(orderMock).toHaveBeenCalled()
    })
  })

  describe('updateStatus', () => {
    it('updates status', async () => {
      const mockReport = { id: '1', status: 'resolved' }
      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: mockReport, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const eqMock = vi.fn().mockReturnValue({ select: selectMock })
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockReturnValue({ update: updateMock } as any)

      const response = await reportsApi.updateStatus('1', 'resolved')
      expect(response.data?.status).toBe('resolved')
      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'resolved' })
      )
    })
  })

  describe('hasReported', () => {
    it('returns true if report exists', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '1' }, error: null })
      const eqMock2 = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock1 })

      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await reportsApi.hasReported('u1', 'l1')
      expect(response.data).toBe(true)
    })

    it('returns false if report does not exist', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: null })
      const eqMock2 = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock1 })

      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await reportsApi.hasReported('u1', 'l1')
      expect(response.data).toBe(false)
    })
  })
})
