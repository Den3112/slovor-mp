import { describe, it, expect, vi, beforeEach } from 'vitest'
import { savedSearchesApi } from '@/lib/api/saved-searches'
import { supabase } from '@/lib/supabase/client'

describe('savedSearchesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('fetches saved searches for authenticated user', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: { id: 'u1' } },
        error: null,
      } as any)

      const mockData = [{ id: '1', name: 'My Search' }]
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await savedSearchesApi.getAll()

      expect(response.error).toBeNull()
      expect(response.data).toEqual(mockData)
      expect(eqMock).toHaveBeenCalledWith('user_id', 'u1')
    })

    it('returns error if not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null,
      } as any)
      const response = await savedSearchesApi.getAll()
      expect(response.error).toBe('Not authenticated')
    })
  })

  describe('create', () => {
    it('creates saved search', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: { id: 'u1' } },
        error: null,
      } as any)

      const input = { name: 'New Search' }
      const mockData = { id: '1', ...input }

      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })

      vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any)

      const response = await savedSearchesApi.create(input)
      expect(response.data).toEqual(mockData)
      expect(insertMock).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: 'u1', name: 'New Search' })
      )
    })
  })

  describe('update', () => {
    it('updates saved search', async () => {
      const updates = { name: 'Updated' }
      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '1', ...updates }, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const eqMock = vi.fn().mockReturnValue({ select: selectMock })
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockReturnValue({ update: updateMock } as any)

      const response = await savedSearchesApi.update('1', updates)
      expect(response.data?.name).toBe('Updated')
    })
  })

  describe('delete', () => {
    it('deletes saved search', async () => {
      const eqMock = vi.fn().mockResolvedValue({ error: null })
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockReturnValue({ delete: deleteMock } as any)

      const response = await savedSearchesApi.delete('1')
      expect(response.data).toBe(true)
    })
  })

  describe('saveCurrentSearch', () => {
    it('calls create with formatted input', async () => {
      const createSpy = vi
        .spyOn(savedSearchesApi, 'create')
        .mockResolvedValue({ data: {}, error: null } as any)

      await savedSearchesApi.saveCurrentSearch('Name', {
        query: 'q',
        minPrice: 10,
      })

      expect(createSpy).toHaveBeenCalledWith({
        name: 'Name',
        query: 'q',
        min_price: 10,
        location: undefined,
        category_id: undefined,
        max_price: undefined,
      })
    })
  })
})
