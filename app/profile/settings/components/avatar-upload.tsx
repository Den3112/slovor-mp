'use client'

import { useState } from 'react'
import Image from 'next/image'
import { User, Loader2 } from 'lucide-react'
import { storageApi } from '@/lib/api'
import { toast } from 'sonner'
import { useAuth } from '@/components/providers/auth-provider'

interface SettingsAvatarUploadProps {
    avatarUrl: string
    onAvatarChange: (newUrl: string) => void
}

export function SettingsAvatarUpload({ avatarUrl, onAvatarChange }: SettingsAvatarUploadProps) {
    const { user } = useAuth()
    const [isUploading, setIsUploading] = useState(false)

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        setIsUploading(true)
        const toastId = toast.loading('Uploading avatar...')

        // Upload logic reusing storageApi
        // Use 'avatars' bucket
        const res = await storageApi.uploadImage(file, user.id, 'avatars')

        if (res.data) {
            onAvatarChange(res.data.url)
            toast.success('Avatar uploaded successfully', { id: toastId })
        } else if (res.error) {
            toast.error('Upload failed', {
                description: res.error,
                id: toastId
            })
        }

        setIsUploading(false)
    }

    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-8 border-b border-border/40">
            <div className="relative group">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-muted shadow-2xl transition-transform group-hover:scale-105">
                    {avatarUrl ? (
                        <Image src={avatarUrl} alt="Avatar" fill className="object-cover" unoptimized />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-primary/5">
                            <User className="h-12 w-12 opacity-20" />
                        </div>
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => document.getElementById('avatar-input')?.click()}
                    className="absolute bottom-0 right-0 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
                >
                    <div className="h-4 w-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.5l-.5 4a2 2 0 0 0 2 2l4-.5a2 2 0 0 0 .5-.5l11.832-11.832z" /></svg>
                    </div>
                </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
                <h3 className="text-xl font-bold">Profile Picture</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto sm:mx-0">
                    Upload a high-quality photo to build trust with other users.
                    <br />Supported formats: JPG, PNG, GIF. Max 5MB.
                </p>
                <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                />
            </div>
        </div>
    )
}
