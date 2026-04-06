'use client'

import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/**
 * Hook to detect if the component has mounted on the client.
 * Uses useSyncExternalStore to reliably detect client-side rendering
 * without triggering "set-state-in-effect" warnings or extra renders.
 */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}
