'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useTranslation } from '@/shared/lib/i18n'

/**
 * Hook to track online/offline status and provide visual feedback via toasts.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const { t } = useTranslation(['common'])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success(t('common:onlineMode'), {
        description: t('common:onlineModeDesc'),
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.error(t('common:offlineMode'), {
        description: t('common:offlineModeDesc'),
        duration: Infinity,
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [t])

  return isOnline
}
