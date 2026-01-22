import { describe, it, expect, vi, afterEach } from 'vitest'
import { logError, logWarn, logInfo } from '@/lib/utils/logger'

describe('logger utility', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { })
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('logs error correctly', () => {
        logError('test-ctx', 'some error')
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('[ERROR][test-ctx]'),
            'some error'
        )
    })

    it('logs warning correctly', () => {
        logWarn('test-ctx', 'some warning')
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringContaining('[WARN][test-ctx]'),
            'some warning'
        )
    })

    it('logs info correctly in development', () => {
        // Since we are running tests, process.env.NODE_ENV is usually 'test' or 'development'
        logInfo('test-ctx', 'some info')
        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('[INFO][test-ctx]'),
            'some info'
        )
    })
})
