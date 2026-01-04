'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/providers/auth-provider'
import { messagesApi, type Conversation } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { Container } from '@/components/ui/container'
import { EmptyState } from '@/components/ui/empty-state'
import { MessageSquare, User, ChevronRight } from 'lucide-react'

export default function MessagesPage() {
    const { t } = useTranslation()
    const { user, isLoading: authLoading } = useAuth()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        const loadConversations = async () => {
            setIsLoading(true)
            const { data } = await messagesApi.getConversationsForUser(user.id)
            if (data) {
                setConversations(data)
            }
            setIsLoading(false)
        }

        loadConversations()
    }, [user])

    if (authLoading) {
        return (
            <Container className="py-20 pt-32">
                <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            </Container>
        )
    }

    if (!user) {
        return (
            <Container className="py-20 pt-32">
                <div className="mx-auto max-w-md text-center">
                    <MessageSquare className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                    <h1 className="mb-2 text-2xl font-bold">{t.messages.title}</h1>
                    <p className="mb-6 text-muted-foreground">
                        {t.auth.signIn} to view your messages
                    </p>
                    <Link
                        href="/auth/login"
                        className="inline-block rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground"
                    >
                        {t.auth.signIn}
                    </Link>
                </div>
            </Container>
        )
    }

    return (
        <div className="min-h-screen pb-20 pt-24 md:pt-32">
            <Container>
                <div className="mb-8">
                    <h1 className="text-3xl font-black">{t.messages.title}</h1>
                    <p className="text-muted-foreground">{t.messages.conversations}</p>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse rounded-2xl bg-muted/30 p-4">
                                <div className="flex gap-4">
                                    <div className="h-14 w-14 rounded-full bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 rounded bg-muted" />
                                        <div className="h-3 w-48 rounded bg-muted" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : conversations.length === 0 ? (
                    <EmptyState
                        icon="💬"
                        title={t.messages.noConversations}
                        description={t.messages.startConversation}
                    />
                ) : (
                    <div className="space-y-3">
                        {conversations.map((conv) => {
                            const otherUser = conv.buyer_id === user.id ? conv.seller : conv.buyer
                            const listingImage = conv.listing?.images?.[0]

                            return (
                                <Link
                                    key={conv.id}
                                    href={`/messages/${conv.id}`}
                                    className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg"
                                >
                                    {/* Avatar */}
                                    <div className="relative h-14 w-14 shrink-0">
                                        {otherUser?.avatar_url ? (
                                            <Image
                                                src={otherUser.avatar_url}
                                                alt=""
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                                                <User className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold">
                                                {otherUser?.display_name || 'User'}
                                            </h3>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(conv.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {conv.listing && (
                                            <p className="truncate text-sm text-muted-foreground">
                                                {conv.listing.title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Listing Thumbnail */}
                                    {listingImage && (
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                                            <Image
                                                src={listingImage}
                                                alt=""
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                                </Link>
                            )
                        })}
                    </div>
                )}
            </Container>
        </div>
    )
}
