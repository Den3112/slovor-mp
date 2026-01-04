// Analytics Utility
// Unified event tracking for user actions

type EventName =
    | 'listing_view'
    | 'listing_created'
    | 'listing_contact_click'
    | 'search_performed'
    | 'filter_applied'
    | 'message_sent'
    | 'report_submitted'
    | 'review_submitted'
    | 'favorite_toggle'

interface EventPayload {
    listing_id?: string
    category?: string
    type?: string
    query?: string
    filters?: Record<string, unknown>
    [key: string]: unknown
}

/**
 * Track an analytics event.
 * In development: logs to console.
 * In production: can be extended to send to GA4, Plausible, etc.
 */
export function trackEvent(name: EventName, payload?: EventPayload) {
    const isServer = typeof window === 'undefined'
    const timestamp = new Date().toISOString()

    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(
            `[Analytics]${isServer ? '[SSR]' : ''} ${name}`,
            payload ? JSON.stringify(payload) : ''
        )
    }

    // Future: Send to external analytics service
    // Example Google Analytics 4:
    // if (typeof window !== 'undefined' && window.gtag) {
    //   window.gtag('event', name, payload)
    // }

    // Example Plausible:
    // if (typeof window !== 'undefined' && window.plausible) {
    //   window.plausible(name, { props: payload })
    // }

    // Store in sessionStorage for debugging (dev only)
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        try {
            const events = JSON.parse(sessionStorage.getItem('__analytics_events') || '[]')
            events.push({ name, payload, timestamp })
            // Keep only last 50 events
            if (events.length > 50) events.shift()
            sessionStorage.setItem('__analytics_events', JSON.stringify(events))
        } catch {
            // Ignore storage errors
        }
    }
}

/**
 * Get stored events for debugging (dev only)
 */
export function getTrackedEvents(): Array<{ name: string; payload?: EventPayload; timestamp: string }> {
    if (typeof window === 'undefined') return []
    try {
        return JSON.parse(sessionStorage.getItem('__analytics_events') || '[]')
    } catch {
        return []
    }
}

/**
 * Clear stored events (dev only)
 */
export function clearTrackedEvents() {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('__analytics_events')
    }
}
