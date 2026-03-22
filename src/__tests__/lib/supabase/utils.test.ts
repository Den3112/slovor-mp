import { describe, it, expect, vi } from 'vitest'
import { withRetry } from '@/lib/supabase/utils'

describe('withRetry', () => {
  it('should return successfully if the operation succeeds immediately', async () => {
    const operation = vi.fn().mockResolvedValue('success')
    const result = await withRetry(operation)
    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(1)
  })

  it('should retry on retryable errors and eventually succeed', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce({ code: '503', message: 'Service Unavailable' })
      .mockResolvedValueOnce('success')

    const result = await withRetry(operation, { initialDelay: 10 })
    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(2)
  })

  it('should fail after max retries if errors persist', async () => {
    const operation = vi.fn().mockRejectedValue({ code: '503', message: 'Persistent Failure' })
    
    await expect(withRetry(operation, { maxRetries: 2, initialDelay: 10 }))
      .rejects.toThrow('Persistent Failure')
    
    expect(operation).toHaveBeenCalledTimes(3)
  })

  it('should not retry on non-retryable errors', async () => {
    const operation = vi.fn().mockRejectedValue({ code: '400', message: 'Bad Request' })
    
    await expect(withRetry(operation, { initialDelay: 10 }))
      .rejects.toThrow('Bad Request')
    
    expect(operation).toHaveBeenCalledTimes(1)
  })

  it('should respect custom retryable errors', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce({ code: 'CUSTOM_ERR', message: 'Custom stuff' })
      .mockResolvedValueOnce('success')

    const result = await withRetry(operation, { 
      retryableErrors: ['CUSTOM_ERR'],
      initialDelay: 10 
    })
    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(2)
  })
})
