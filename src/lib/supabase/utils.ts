import { logError } from '@/lib/utils/logger'

/**
 * Options for the withRetry utility
 */
interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  backoffFactor?: number
  retryableErrors?: string[]
}

/**
 * Wraps a Supabase query or any async function with retry logic.
 * Defaults to exponential backoff.
 */
export async function withRetry<T>(
  operation: () => Promise<T> | PromiseLike<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 500,
    backoffFactor = 2,
    retryableErrors = ['503', '502', '429', 'PGRST116', 'PGRST108'],
  } = options

  let lastError: any
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      const errorMessage = error.message || String(error)
      const errorCode = error.code || ''

      // Check if the error is retryable
      const isRetryable = retryableErrors.some(
        (code) => errorCode.includes(code) || errorMessage.includes(code)
      )

      if (!isRetryable || attempt === maxRetries) {
        if (attempt === maxRetries) {
          logError('withRetry.maxRetriesReached', {
            attempt,
            errorCode,
            errorMessage,
          })
        }
        throw error
      }

      logError('withRetry.attemptFailed', {
        attempt: attempt + 1,
        errorCode,
        errorMessage,
        nextDelay: delay,
      })

      await new Promise((resolve) => setTimeout(resolve, delay))
      delay *= backoffFactor
    }
  }

  throw lastError
}
