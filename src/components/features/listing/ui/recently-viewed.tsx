'use client'

import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { History } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { useParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'

export function RecentlyViewed() {
  const { items } = useRecentlyViewed()
  const { t } = useTranslation(['listing'])
  const params = useParams()
  const lang = (params?.lang as string) || 'en'

  if (items.length === 0) return null

  return (
    <section className="bg-muted/30 border-border/50 border-t py-8">
      <Container>
        <div className="text-muted-foreground mb-6 flex items-center gap-2">
          <History className="h-5 w-5" />
          <h2 className="text-xl font-bold">{t('listing:recentlyViewed')}</h2>
        </div>

        <div className="scrollbar-hide -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/${lang}/listings/${item.id}`}
              className="group w-[200px] flex-none snap-start"
            >
              <Card className="border-border/50 bg-card hover:border-primary/20 h-full overflow-hidden transition-all hover:shadow-md">
                <div className="bg-muted relative aspect-square">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="200px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                      {t('listing:noImage')}
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="group-hover:text-primary mb-1 truncate text-sm font-semibold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-primary text-sm font-bold">
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
