import { User, Loader2, Camera } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { SettingsAvatarProps } from './types';

export function SettingsAvatar({ avatarUrl, isUploading, onUpload }: SettingsAvatarProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start pb-6 border-b border-border/40">
            <div className="relative group">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-muted/30 bg-muted shadow-sm relative">
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt="Avatar"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary/50">
                            <User className="h-10 w-10 opacity-50" />
                        </div>
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => document.getElementById('avatar-input')?.click()}
                    className="absolute bottom-0 right-0 p-2 rounded-xl bg-primary text-primary-foreground shadow-md hover:scale-105 transition-transform"
                    title={t('profile:uploadAvatar')}
                    disabled={isUploading}
                >
                    <Camera className="h-4 w-4" />
                </button>
                <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onUpload}
                />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1 mt-2">
                <h3 className="font-bold text-lg">{t('profile:profilePicture')}</h3>
                <p className="text-sm text-muted-foreground text-balanced max-w-xs">{t('profile:uploadDescription')}</p>
            </div>
        </div>
    );
}
