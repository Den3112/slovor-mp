'use client'

import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { History } from 'lucide-react'
import { Container } from '@/components/ui/container'

export function RecentlyViewed() {
    const { items } = useRecentlyViewed()

    if (items.length === 0) return null

    return (
        <section className="py-12 bg-muted/30 border-t border-border/50">
            <Container>
                <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                    <History className="h-5 w-5" />
                    <h2 className="text-xl font-bold">Recently Viewed</h2>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={`/listings/${item.id}`}
                            className="flex-none w-[200px] snap-start group"
                        >
                            <Card className="h-full overflow-hidden border-border/50 bg-card transition-all hover:shadow-md hover:border-primary/20">
                                <div className="relative aspect-square bg-muted">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-3">
                                    <h3 className="font-semibold truncate text-sm mb-1 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm font-bold text-primary">
                                        {formatPrice(item.price, item.currency)}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    )
}
