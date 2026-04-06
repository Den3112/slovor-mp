import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logError, logWarn, logInfo } from '@/shared/lib/utils/logger'

describe('logger utility', () => {
  const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NODE_ENV', 'development')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should log errors with correct prefix in development', () => {
    logError('err.context', new Error('test error'))
    expect(errorSpy).toHaveBeenCalledWith(
      '[ERROR][err.context][client]:',
      'test error'
    )
  })

  it('should log warnings in development', () => {
    logWarn('warn.context', 'be careful')
    expect(warnSpy).toHaveBeenCalledWith(
      '[WARN][warn.context][client]:',
      'be careful'
    )
  })

  it('should log info in development', () => {
    logInfo('info.context', 'some info')
    expect(infoSpy).toHaveBeenCalledWith(
      '[INFO][info.context][client]:',
      'some info'
    )
  })

  it('should log structured JSON in production environment', () => {
    vi.stubEnv('NODE_ENV', 'production')

    // Use logError since logInfo skips production in the current implementation
    logError('prod.err', 'prod error')

    expect(errorSpy).toHaveBeenCalled()
    const callArgs = errorSpy.mock.calls[0]?.[0]
    if (typeof callArgs !== 'string') {
      throw new Error('Expected first argument of console.error to be a string')
    }
    const payload = JSON.parse(callArgs)
    expect(payload.level).toBe('error')
    expect(payload.context).toBe('prod.err')
    expect(payload.message).toBe('prod error')
    expect(payload.env).toBe('production')
  })

  it('should NOT log info in production environment', () => {
    vi.stubEnv('NODE_ENV', 'production')
    logInfo('info.prod', 'should be hidden')
    expect(infoSpy).not.toHaveBeenCalled()
  })
})
