type LogLevel = 'info' | 'warn' | 'error'

function log(level: LogLevel, context: string, errorOrMessage: unknown) {
  // В dev режиме логируем подробнее, в prod можно будет подцепить внешний сервис
  const isServer = typeof window === 'undefined'
  const prefix = `[${level.toUpperCase()}][${context}]${isServer ? '[server]' : '[client]'}:`

  if (level === 'error') {
    // eslint-disable-next-line no-console
    console.error(prefix, errorOrMessage)
  } else if (level === 'warn') {
    // eslint-disable-next-line no-console
    console.warn(prefix, errorOrMessage)
  } else {
    // eslint-disable-next-line no-console
    console.log(prefix, errorOrMessage)
  }
}

export function logError(context: string, error: unknown) {
  log('error', context, error)
}

export function logWarn(context: string, message: unknown) {
  log('warn', context, message)
}

export function logInfo(context: string, message: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    log('info', context, message)
  }
}
