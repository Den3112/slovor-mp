'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect if the component has mounted on the client.
 * Useful for avoiding hydration mismatches when using browser-only APIs.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
