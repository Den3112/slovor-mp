'use client'

import { useSyncExternalStore, useCallback } from 'react'
import { createClient } from '@/shared/lib/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const STORAGE_KEY = 'slovor_favorites'

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback)
  window.addEventListener('favorites-updated', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('favorites-updated', callback)
  }
}

const getSnapshot = () => {
  if (typeof window === 'undefined') return '[]'
  return localStorage.getItem(STORAGE_KEY) || '[]'
}

const getServerSnapshot = () => '[]'

export function useFavorites(userId?: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  // Subscribe to local storage for guest favorites
  const localFavoritesRaw = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const localFavorites = JSON.parse(localFavoritesRaw) as string[]

  // Fetch from Supabase if user is logged in
  const { data: dbFavorites = [] } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', userId)

      if (error) throw error
      return (data as any[]).map((f: { listing_id: string }) => f.listing_id)
    },
    enabled: !!userId,
  })

  // Sync logic
  const favorites = userId ? dbFavorites : localFavorites

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const isFavorite = favorites.includes(listingId)

      if (userId) {
        if (isFavorite) {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('listing_id', listingId)
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('favorites')
            .insert({ user_id: userId, listing_id: listingId })
          if (error) throw error
        }
        const newLocal = isFavorite
          ? localFavorites.filter((id) => id !== listingId)
          : [...localFavorites, listingId]

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocal))
        window.dispatchEvent(new Event('favorites-updated'))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] })
    },
    onError: () => {
      toast.error('Nepodarilo sa aktualizovať obľúbené')
    },
  })

  const isFavorite = useCallback(
    (listingId: string) => favorites.includes(listingId),
    [favorites]
  )

  return {
    favorites,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isFavorite,
    isLoading: toggleFavoriteMutation.isPending,
  }
}

export { useFavorites as useFavorite }
