'use client'

import Image from 'next/image'
import { User, Loader2 } from 'lucide-react'

interface AvatarSectionProps {
    avatarUrl: string
    isUploading: boolean
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function AvatarSection({
    avatarUrl,
    isUploading,
    onUpload,
}: AvatarSectionProps) {
    return (
        <div className="border-border/40 flex flex-col items-center gap-8 border-b pb-8 sm:flex-row sm:items-start">
            <div className="group relative">
                <div className="border-background bg-muted relative h-32 w-32 overflow-hidden rounded-full border-4 shadow-2xl transition-transform group-hover:scale-105">
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt="Avatar"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="text-muted-foreground bg-primary/5 flex h-full w-full items-center justify-center">
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
                    className="bg-primary text-primary-foreground absolute right-0 bottom-0 rounded-full p-2.5 shadow-lg transition-transform hover:scale-110"
                >
                    <div className="h-4 w-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-full w-full"
                        >
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.5l-.5 4a2 2 0 0 0 2 2l4-.5a2 2 0 0 0 .5-.5l11.832-11.832z" />
                        </svg>
                    </div>
                </button>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
                <h3 className="text-xl font-bold">Profile Picture</h3>
                <p className="text-muted-foreground mx-auto max-w-sm text-sm sm:mx-0">
                    Upload a high-quality photo to build trust with other users.
                    <br />
                    Supported formats: JPG, PNG, GIF. Max 5MB.
                </p>
                <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onUpload}
                />
            </div>
        </div>
    )
}
