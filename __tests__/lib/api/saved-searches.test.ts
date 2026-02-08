import { describe, it, expect, vi, beforeEach } from 'vitest'
import { savedSearchesApi } from '@/lib/api/saved-searches'
import { supabase } from '@/lib/supabase/client'

describe('savedSearchesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock auth.getUser
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'user1' } },
      error: null,
    } as any)
  })

  describe('getAll', () => {
    it('fetches saved searches', async () => {
      const mockData = [{ id: '1', name: 'Test' }]
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await savedSearchesApi.getAll()
      expect(response.data).toEqual(mockData)
    })

    it('returns error if not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null,
      } as any)
      const response = await savedSearchesApi.getAll()
      expect(response.error).toBe('Not authenticated')
    })

    it('handles database errors', async () => {
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'DB Error' } })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await savedSearchesApi.getAll()
      expect(response.error).toBe('DB Error')
    })
  })

  describe('create', () => {
    it('creates a saved search', async () => {
      const mockSearch = { name: 'Test' }
      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '1', ...mockSearch }, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })

      vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any)

      const response = await savedSearchesApi.create(mockSearch)
      expect(response.data?.id).toBe('1')
    })

    it('returns error if not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null,
      } as any)
      const response = await savedSearchesApi.create({ name: 'Test' })
      expect(response.error).toBe('Not authenticated')
    })

    it('handles database errors', async () => {
      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'Insert Error' } })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })
      vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any)

      const response = await savedSearchesApi.create({ name: 'Test' })
      expect(response.error).toBe('Insert Error')
    })
  })

  describe('update', () => {
    it('updates a saved search', async () => {
      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '1' }, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const eqMock = vi.fn().mockReturnValue({ select: selectMock })
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockReturnValue({ update: updateMock } as any)

      const response = await savedSearchesApi.update('1', { name: 'Updated' })
      expect(response.data?.id).toBe('1')
    })

    it('handles database errors', async () => {
      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'Update Error' } })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const eqMock = vi.fn().mockReturnValue({ select: selectMock })
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
      vi.mocked(supabase.from).mockReturnValue({ update: updateMock } as any)

      const response = await savedSearchesApi.update('1', { name: 'Updated' })
      expect(response.error).toBe('Update Error')
    })
  })

  describe('delete', () => {
    it('deletes a saved search', async () => {
      const eqMock = vi.fn().mockResolvedValue({ error: null })
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockReturnValue({ delete: deleteMock } as any)

      const response = await savedSearchesApi.delete('1')
      expect(response.data).toBe(true)
    })

    it('handles database errors', async () => {
      const eqMock = vi
        .fn()
        .mockResolvedValue({ error: { message: 'Delete Error' } })
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
      vi.mocked(supabase.from).mockReturnValue({ delete: deleteMock } as any)

      const response = await savedSearchesApi.delete('1')
      expect(response.error).toBe('Delete Error')
    })
  })

  describe('saveCurrentSearch', () => {
    it('calls create with correct arguments', async () => {
      const createSpy = vi
        .spyOn(savedSearchesApi, 'create')
        .mockResolvedValue({ data: {} as any, error: null })

      await savedSearchesApi.saveCurrentSearch('My Search', {
        query: 'laptop',
        category: 'cat1',
        location: 'Bratislava',
        minPrice: 100,
        maxPrice: 500,
      })

      expect(createSpy).toHaveBeenCalledWith({
        name: 'My Search',
        query: 'laptop',
        category_id: 'cat1',
        location: 'Bratislava',
        min_price: 100,
        max_price: 500,
      })
    })
  })
})
