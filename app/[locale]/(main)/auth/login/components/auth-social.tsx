'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface AuthSocialProps {
  onGoogleLogin: () => void
  googleLoading: boolean
  loading: boolean
}

export function AuthSocial({
  onGoogleLogin,
  googleLoading,
  loading,
}: AuthSocialProps) {
  const { t } = useTranslation('auth')
  return (
    <div className="mb-8 space-y-4">
      <Button
        type="button"
        variant="outline"
        className="group border-border bg-card hover:bg-muted h-14 w-full rounded-xl text-base font-bold transition-all hover:scale-[1.02] hover:border-indigo-500/30 active:scale-95"
        onClick={onGoogleLogin}
        disabled={googleLoading || loading}
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <svg
            className="mr-2 h-5 w-5 opacity-80 transition-opacity group-hover:opacity-100"
            viewBox="0 0 24 24"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        {t('googleSignIn')}
      </Button>

      <div className="relative py-1 md:py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-[10px] tracking-widest uppercase">
          <span className="bg-background text-muted-foreground px-2">
            {t('orContinueWith')}
          </span>
        </div>
      </div>
    </div>
  )
}
