'use client'

import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { History } from 'lucide-react'
import { Container } from '@/components/ui/container'

export function RecentlyViewed() {
    const { items } = useRecentlyViewed()

    if (items.length === 0) return null

    return (
        <section className="py-12 border-t-2 border-primary/10 bg-zinc-950 group">
            <Container>
                <div className="flex items-center gap-4 mb-8">
                    <History className="h-6 w-6 text-primary" />
                    <h2 className="font-heading text-3xl font-black italic tracking-tight text-white">
                        Recently Viewed
                    </h2>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent snap-x">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={`/listings/${item.id}`}
                            className="flex-none w-[220px] snap-start group/item"
                        >
                            <div className="border-2 border-primary/10 bg-zinc-900 transition-all hover:border-primary hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)] h-full">
                                <div className="relative aspect-square border-b-2 border-primary/10 overflow-hidden">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-zinc-950 text-zinc-800 text-[10px] font-black uppercase tracking-widest">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 space-y-2">
                                    <h3 className="font-heading text-lg font-bold italic truncate text-white group-hover/item:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="font-sans text-sm font-black text-primary uppercase tracking-widest">
                                        {formatPrice(item.price, item.currency)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    )
}
