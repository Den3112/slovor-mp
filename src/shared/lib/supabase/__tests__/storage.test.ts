import { describe, it, expect, vi, beforeEach } from 'vitest'
import { storageApi } from '@/shared/lib/supabase/storage'
import { supabase } from '@/shared/lib/supabase/client'

describe('storageApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockFile = (name: string, type: string, size = 1000) => {
    return {
      name,
      type,
      size,
      arrayBuffer: vi.fn(),
    } as unknown as File
  }

  describe('uploadImage', () => {
    it('validates file type', async () => {
      const file = createMockFile('test.txt', 'text/plain')
      const response = await storageApi.uploadImage(supabase, file, 'user-1')
      expect(response.error).toContain('Invalid file type')
    })

    it('validates file size', async () => {
      const file = createMockFile('large.jpg', 'image/jpeg', 11 * 1024 * 1024) // 11MB
      const response = await storageApi.uploadImage(supabase, file, 'user-1')
      expect(response.error).toContain('File size')
    })

    it('uploads valid image successfully', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg')
      const uploadMock = vi
        .fn()
        .mockResolvedValue({ data: { path: 'path/to/img.jpg' }, error: null })
      const getUrlMock = vi
        .fn()
        .mockReturnValue({ data: { publicUrl: 'http://url/img.jpg' } })

      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: uploadMock,
        getPublicUrl: getUrlMock,
      } as any)

      const response = await storageApi.uploadImage(supabase, file, 'user-1')

      expect(response.error).toBeNull()
      expect(response.data?.url).toBe('http://url/img.jpg')
      expect(uploadMock).toHaveBeenCalledWith(
        expect.stringContaining('user-1/'),
        file,
        expect.any(Object)
      )
    })

    it('handles upload error', async () => {
      const file = createMockFile('test.png', 'image/png')
      const uploadMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'Upload Failed' } })

      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: uploadMock,
      } as any)

      const response = await storageApi.uploadImage(supabase, file, 'user-1')
      expect(response.error).toBe('Upload Failed')
    })
  })

  describe('uploadImages', () => {
    it('uploads multiple images', async () => {
      const files = [
        createMockFile('1.jpg', 'image/jpeg'),
        createMockFile('2.png', 'image/png'),
      ]

      const uploadSpy = vi
        .spyOn(storageApi, 'uploadImage')
        .mockResolvedValueOnce({ data: { url: 'url1' } as any, error: null })
        .mockResolvedValueOnce({ data: { url: 'url2' } as any, error: null })

      const progressSpy = vi.fn()

      const response = await storageApi.uploadImages(
        supabase,
        files,
        'user-1',
        progressSpy
      )

      expect(response.error).toBeNull()
      expect(response.data).toHaveLength(2)
      expect(uploadSpy).toHaveBeenCalledTimes(2)
      expect(progressSpy).toHaveBeenCalledTimes(4)
    })

    it('handles failure when no files uploaded', async () => {
      const files = [createMockFile('1.jpg', 'image/jpeg')]

      vi.spyOn(storageApi, 'uploadImage').mockResolvedValue({
        data: null,
        error: 'Fail',
      })

      const response = await storageApi.uploadImages(supabase, files, 'user-1')
      expect(response.error).toContain('Fail')
    })

    it('returns partial success logs warning', async () => {
      const files = [
        createMockFile('1.jpg', 'image/jpeg'),
        createMockFile('2.jpg', 'image/jpeg'),
      ]

      vi.spyOn(storageApi, 'uploadImage')
        .mockResolvedValueOnce({ data: { url: 'url1' } as any, error: null })
        .mockResolvedValueOnce({ data: null, error: 'Fail' })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const response = await storageApi.uploadImages(supabase, files, 'user-1')

      expect(response.error).toBeNull() // Partial success returns data
      expect(response.data).toHaveLength(1)
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('deleteImage', () => {
    it('deletes image', async () => {
      const removeMock = vi.fn().mockResolvedValue({ data: {}, error: null })
      vi.mocked(supabase.storage.from).mockReturnValue({
        remove: removeMock,
      } as any)

      const response = await storageApi.deleteImage(supabase, 'path/img.jpg')
      expect(response.error).toBeNull()
      expect(removeMock).toHaveBeenCalledWith(['path/img.jpg'])
    })

    it('handles delete error', async () => {
      const removeMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'Remove Failed' } })
      vi.mocked(supabase.storage.from).mockReturnValue({
        remove: removeMock,
      } as any)

      const response = await storageApi.deleteImage(supabase, 'path')
      expect(response.error).toBe('Remove Failed')
    })
  })

  describe('deleteImages', () => {
    it('deletes multiple images', async () => {
      const removeMock = vi.fn().mockResolvedValue({ data: {}, error: null })
      vi.mocked(supabase.storage.from).mockReturnValue({
        remove: removeMock,
      } as any)

      const response = await storageApi.deleteImages(supabase, ['p1', 'p2'])
      expect(response.error).toBeNull()
      expect(removeMock).toHaveBeenCalledWith(['p1', 'p2'])
    })
  })
})
