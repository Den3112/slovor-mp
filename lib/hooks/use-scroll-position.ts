'use client'

import { useState, useEffect } from 'react'

interface ScrollPosition {
  scrollY: number
  scrollX: number
  isScrolled: boolean
  isScrollingDown: boolean
  isScrollingUp: boolean
}

/**
 * Hook for tracking scroll position and direction
 * @param threshold - Minimum scroll value to consider "scrolled" (default: 10)
 */
export function useScrollPosition(threshold = 10): ScrollPosition {
  const [scrollState, setScrollState] = useState<ScrollPosition>({
    scrollY: 0,
    scrollX: 0,
    isScrolled: false,
    isScrollingDown: false,
    isScrollingUp: false,
  })

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const currentScrollX = window.scrollX

          setScrollState({
            scrollY: currentScrollY,
            scrollX: currentScrollX,
            isScrolled: currentScrollY > threshold,
            isScrollingDown: currentScrollY > lastScrollY,
            isScrollingUp: currentScrollY < lastScrollY,
          })

          lastScrollY = currentScrollY
          ticking = false
        })

        ticking = true
      }
    }

    // Initial state
    setScrollState({
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      isScrolled: window.scrollY > threshold,
      isScrollingDown: false,
      isScrollingUp: false,
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrollState
}
