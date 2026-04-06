import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useImageUpload } from '../use-image-upload'

describe('useImageUpload', () => {
  let mockCanvas: any
  let originalCreateElement: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url')
    global.URL.revokeObjectURL = vi.fn()

    // Mock FileReader
    // @ts-ignore
    global.FileReader = class {
      readAsDataURL() {
        setTimeout(() => {
          // @ts-ignore
          if (this.onload)
            this.onload({ target: { result: 'data:image/png;base64,xxxx' } })
        }, 0)
      }
    }

    // Mock Image
    // @ts-ignore
    global.Image = class {
      constructor() {
        setTimeout(() => {
          // @ts-ignore
          if (this.onload) this.onload()
        }, 0)
      }
      set src(_value: string) {}
      width = 100
      height = 100
    }

    // Mock Canvas
    const mockContext = {
      drawImage: vi.fn(),
    }
    mockCanvas = {
      getContext: vi.fn(() => mockContext),
      toBlob: vi.fn((callback) =>
        callback(new Blob(['compressed'], { type: 'image/webp' }))
      ),
      width: 100,
      height: 100,
    }

    originalCreateElement = document.createElement
    document.createElement = vi.fn().mockImplementation((tagName) => {
      if (tagName === 'canvas') return mockCanvas as any
      return originalCreateElement.call(document, tagName)
    })
  })

  afterEach(() => {
    document.createElement = originalCreateElement
  })

  it('initializes with empty images', () => {
    const { result } = renderHook(() => useImageUpload())
    expect(result.current.images).toHaveLength(0)
  })

  it('validates file type', async () => {
    const { result } = renderHook(() => useImageUpload())
    const invalidFile = new File(['foo'], 'foo.txt', { type: 'text/plain' })

    await act(async () => {
      await result.current.uploadImages([invalidFile])
    })

    expect(result.current.images[0]!.status).toBe('error')
    expect(result.current.images[0]!.error).toContain('Nepodporovaný formát')
  })

  it('validates file size', async () => {
    const { result } = renderHook(() => useImageUpload())
    const largeFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)],
      'large.jpg',
      { type: 'image/jpeg' }
    )

    await act(async () => {
      await result.current.uploadImages([largeFile])
    })

    expect(result.current.images[0]!.status).toBe('error')
    expect(result.current.images[0]!.error).toContain('príliš veľký')
  })

  it('processes valid images', async () => {
    const { result } = renderHook(() => useImageUpload())
    const validFile = new File(['valid'], 'valid.jpg', { type: 'image/jpeg' })

    await act(async () => {
      await result.current.uploadImages([validFile])
    })

    await waitFor(
      () => expect(result.current.images[0]!.status).toBe('completed'),
      { timeout: 3000 }
    )
    expect(result.current.images[0]!.isPrimary).toBe(true)
  })

  it('limits max files', async () => {
    const { result } = renderHook(() => useImageUpload())
    const files = Array(16).fill(
      new File(['img'], 'img.jpg', { type: 'image/jpeg' })
    )

    let uploadResult: any
    await act(async () => {
      uploadResult = await result.current.uploadImages(files)
    })

    expect(uploadResult.errors).toHaveLength(1)
    expect(uploadResult.errors[0]).toContain('Maximálny počet')
  })

  it('removes image and updates primary', async () => {
    const { result } = renderHook(() => useImageUpload())
    const files = [
      new File(['1'], '1.jpg', { type: 'image/jpeg' }),
      new File(['2'], '2.jpg', { type: 'image/jpeg' }),
    ]

    await act(async () => {
      await result.current.uploadImages(files)
    })

    await waitFor(() => expect(result.current.images).toHaveLength(2))
    expect(result.current.images[0]!.isPrimary).toBe(true)

    act(() => {
      result.current.removeImage(result.current.images[0]!.id)
    })

    expect(result.current.images).toHaveLength(1)
    expect(result.current.images[0]!.isPrimary).toBe(true)
  })

  it('reorders images', async () => {
    const { result } = renderHook(() => useImageUpload())
    const files = [
      new File(['1'], '1.jpg', { type: 'image/jpeg' }),
      new File(['2'], '2.jpg', { type: 'image/jpeg' }),
    ]

    await act(async () => {
      await result.current.uploadImages(files)
    })

    await waitFor(() => expect(result.current.images).toHaveLength(2))
    const firstId = result.current.images[0]!.id

    act(() => {
      result.current.reorderImages(0, 1)
    })

    expect(result.current.images[1]!.id).toBe(firstId)
    expect(result.current.images[1]!.orderIndex).toBe(1)
  })

  it('sets primary manually', async () => {
    const { result } = renderHook(() => useImageUpload())
    const files = [
      new File(['1'], '1.jpg', { type: 'image/jpeg' }),
      new File(['2'], '2.jpg', { type: 'image/jpeg' }),
    ]

    await act(async () => {
      await result.current.uploadImages(files)
    })

    await waitFor(() => expect(result.current.images).toHaveLength(2), {
      timeout: 3000,
    })

    act(() => {
      result.current.setPrimary(result.current.images[1]!.id)
    })

    expect(result.current.images[1]!.isPrimary).toBe(true)
    expect(result.current.images[0]!.isPrimary).toBe(false)
  })

  it('handles image processing errors', async () => {
    const { result } = renderHook(() => useImageUpload())
    const validFile = new File(['error'], 'error.jpg', { type: 'image/jpeg' })

    // Force error in Canvas toBlob
    const mockCanvas = document.createElement('canvas')
    // @ts-ignore
    mockCanvas.toBlob = (callback: any) => callback(null) // Should trigger 'Blob creation failed' reject

    await act(async () => {
      await result.current.uploadImages([validFile])
    })

    await waitFor(
      () => expect(result.current.images[0]!.status).toBe('error'),
      { timeout: 3000 }
    )
    expect(result.current.images[0]!.error).toBe(
      'Chyba pri spracovaní obrázka.'
    )
  })
})
