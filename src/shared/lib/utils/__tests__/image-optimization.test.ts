/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { optimizeImages } from '@/shared/lib/utils/image-optimization'

describe('image-optimization', () => {
  // Mocking Canvas and URL since we are in a JSDOM environment
  beforeEach(() => {
    // Mock HTMLCanvasElement
    const mockCanvas: any = {
      getContext: vi.fn(() => ({
        drawImage: vi.fn(),
      })),
      toBlob: vi.fn((callback) => callback(new Blob(['compressed']))),
      width: 0,
      height: 0,
    }

    vi.stubGlobal('HTMLCanvasElement', { prototype: mockCanvas })
    // Mock Image constructor
    class MockImage extends EventTarget {
      width = 0
      height = 0
      onload: any = null
      onerror: any = null
      _src = ''

      set src(val: string) {
        this._src = val
        this.width = 2000
        this.height = 1000
        // Trigger load event and onload callback
        setTimeout(() => {
          this.dispatchEvent(new Event('load'))
          if (this.onload) this.onload()
        }, 0)
      }
      get src() {
        return this._src
      }
    }

    vi.stubGlobal('Image', MockImage)

    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string) => {
        if (tagName === 'canvas') return mockCanvas as any
        return {} as any
      }
    )

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    })
  })

  it('optimizes multiple images', async () => {
    const files = [
      new File(['f1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['f2'], 'test2.png', { type: 'image/png' }),
    ]

    const optimized = await optimizeImages(files)

    expect(optimized).toHaveLength(2)
    expect(optimized[0]).toBeInstanceOf(File)
    expect(optimized[0]?.name).toBe('test1.jpg')
    expect(optimized[1]?.name).toBe('test2.png')
  })

  it('returns empty array for empty input', async () => {
    const optimized = await optimizeImages([])
    expect(optimized).toHaveLength(0)
  })
})
