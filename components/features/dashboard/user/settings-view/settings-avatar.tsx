import { User, Loader2, Camera } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { SettingsAvatarProps } from './types'

export function SettingsAvatar({
  avatarUrl,
  isUploading,
  onUpload,
}: SettingsAvatarProps) {
  const { t } = useTranslation()

  return (
    <div className="border-border/40 flex flex-col items-center gap-6 border-b pb-6 sm:flex-row sm:items-start">
      <div className="group relative">
        <div className="border-muted/30 bg-muted relative h-28 w-28 overflow-hidden rounded-full border-4 shadow-sm">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="text-muted-foreground bg-secondary/50 flex h-full w-full items-center justify-center">
              <User className="h-10 w-10 opacity-50" />
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
        <Button
          type="button"
          size="icon"
          onClick={() => document.getElementById('avatar-input')?.click()}
          className="bg-primary text-primary-foreground absolute right-0 bottom-0 h-8 w-8 rounded-lg p-0 shadow-md transition-transform hover:scale-105"
          title={t('profile:uploadAvatar')}
          disabled={isUploading}
        >
          <Camera className="h-4 w-4" />
        </Button>
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
      </div>

      <div className="mt-2 flex-1 space-y-1 text-center sm:text-left">
        <h3 className="text-lg font-bold">{t('profile:profilePicture')}</h3>
        <p className="text-muted-foreground text-balanced max-w-xs text-sm">
          {t('profile:uploadDescription')}
        </p>
      </div>
    </div>
  )
}
