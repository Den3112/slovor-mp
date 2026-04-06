type LogLevel = 'info' | 'warn' | 'error'

interface LogPayload {
  timestamp: string
  level: LogLevel
  context: string
  message: unknown
  env: string
  isServer: boolean
}

function log(level: LogLevel, context: string, errorOrMessage: unknown) {
  const isServer = typeof window === 'undefined'
  const isProd = process.env.NODE_ENV === 'production'

  const payload: LogPayload = {
    timestamp: new Date().toISOString(),
    level,
    context,
    message:
      errorOrMessage instanceof Error ? errorOrMessage.message : errorOrMessage,
    env: process.env.NODE_ENV || 'development',
    isServer,
  }

  if (isProd) {
    // Structured JSON for production logging (ELK, Datadog, etc.)

    console[level](JSON.stringify(payload))
    return
  }

  // Readable format for development
  const prefix = `[${level.toUpperCase()}][${context}]${isServer ? '[server]' : '[client]'}:`
  const displayMessage =
    typeof errorOrMessage === 'object' && errorOrMessage !== null
      ? errorOrMessage instanceof Error
        ? errorOrMessage.message
        : JSON.stringify(errorOrMessage)
      : errorOrMessage

  console[level](prefix, displayMessage)
}

export function logError(context: string, error: unknown) {
  log('error', context, error)
}

export function logWarn(context: string, message: unknown) {
  log('warn', context, message)
}

export function logInfo(context: string, message: unknown) {
  // Always log info in production if structured, or only in dev if readable
  if (process.env.NODE_ENV !== 'production') {
    log('info', context, message)
  }
}
