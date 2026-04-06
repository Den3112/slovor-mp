import { useSyncExternalStore, useMemo } from 'react'

export function useMediaQuery(query: string): boolean {
  const subscribe = useMemo(() => {
    return (callback: () => void) => {
      const result = window.matchMedia(query)
      result.addEventListener('change', callback)
      return () => result.removeEventListener('change', callback)
    }
  }, [query])

  const getSnapshot = () => {
    return window.matchMedia(query).matches
  }

  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
