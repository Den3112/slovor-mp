import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useFavorite } from '@/lib/hooks/use-favorite'
import { favoritesApi } from '@/lib/api'

vi.mock('@/lib/api', () => ({
    favoritesApi: {
        isFavorited: vi.fn(),
        toggle: vi.fn(),
    }
}))

describe('useFavorite', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Default window location mock
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true
        })
    })

    it('initializes and fetches favorite status', async () => {
        vi.mocked(favoritesApi.isFavorited).mockResolvedValue({ data: true, error: null })

        const { result } = renderHook(() => useFavorite({ listingId: '1', userId: 'u1' }))

        // Initial state
        expect(result.current.isFavorited).toBe(false)

        // Wait for effect
        await waitFor(() => {
            expect(result.current.isFavorited).toBe(true)
        })
        expect(favoritesApi.isFavorited).toHaveBeenCalledWith('1', 'u1')
    })

    it('does not fetch if no userId', async () => {
        renderHook(() => useFavorite({ listingId: '1' }))

        await waitFor(() => {
            expect(favoritesApi.isFavorited).not.toHaveBeenCalled()
        })
    })

    it('toggles favorite status', async () => {
        vi.mocked(favoritesApi.isFavorited).mockResolvedValue({ data: false, error: null })
        vi.mocked(favoritesApi.toggle).mockResolvedValue({ data: { isFavorited: true }, error: null })

        const { result } = renderHook(() => useFavorite({ listingId: '1', userId: 'u1' }))

        await act(async () => {
            await result.current.toggleFavorite()
        })

        expect(favoritesApi.toggle).toHaveBeenCalledWith('1', 'u1')
        expect(result.current.isFavorited).toBe(true)
    })

    it('redirects to login if toggling without user', async () => {
        const { result } = renderHook(() => useFavorite({ listingId: '1' })) // no userId

        await act(async () => {
            await result.current.toggleFavorite()
        })

        expect(window.location.href).toBe('/auth/login')
        expect(favoritesApi.toggle).not.toHaveBeenCalled()
    })
})
