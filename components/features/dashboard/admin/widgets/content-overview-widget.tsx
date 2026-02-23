import { useEffect, useState } from 'react'
import {
  Layers,
  FileText,
  Image as ImageIcon,
  Video,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { HubWidget } from '@/components/features/dashboard/shared/hub-widget'
import { useTranslation } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { listingsApi } from '@/lib/api/listings'
import { formatDistanceToNow } from 'date-fns'
import { ru, cs, sk, enUS } from 'date-fns/locale'

export function ContentOverviewWidget() {
  const { t, locale } = useTranslation(['admin'])
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      const { data } = await listingsApi.getAdminAll()
      if (data) {
        // Map listings to items format
        const mapped = data.slice(0, 5).map((listing) => ({
          id: listing.id,
          title: listing.title,
          type: (listing.status === 'active'
            ? 'listing'
            : listing.status) as string,
          author: listing.user?.display_name || 'User',
          date: formatDistanceToNow(new Date(listing.created_at), {
            addSuffix: true,
            locale:
              locale === 'ru'
                ? ru
                : locale === 'sk'
                  ? sk
                  : locale === 'cs'
                    ? cs
                    : enUS,
          }),
        }))
        setItems(mapped)
      }
      setIsLoading(false)
    }
    fetchContent()
  }, [locale])

  const getIcon = (type: string) => {
    switch (type) {
      case 'listing':
        return <Layers className="h-4 w-4 text-emerald-500" />
      case 'blog':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'video':
        return <Video className="h-4 w-4 text-rose-500" />
      case 'image':
        return <ImageIcon className="h-4 w-4 text-amber-500" />
      default:
        return <Layers className="h-4 w-4" />
    }
  }

  return (
    <HubWidget
      title={t('admin:content') || 'RECENT CONTENT'}
      icon={Layers}
      colSpan={4}
      rowSpan={2}
      noPadding
      action={{
        label: t('admin:fullContentHub'),
        icon: ArrowRight,
        onClick: () => {},
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="text-primary h-6 w-6 animate-spin" />
        </div>
      ) : items.length > 0 ? (
        <div className="divide-border/40 divide-y">
          {items.map((item) => (
            <div
              key={item.id}
              className="hover:bg-muted/5 group flex items-center justify-between p-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-muted/20 border-border/20 rounded-xl border p-2">
                  {getIcon(item.type)}
                </div>
                <div className="space-y-0.5">
                  <span className="text-foreground block max-w-[150px] truncate text-sm font-bold">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                      {item.author}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-border/40 h-4 px-1 py-0 text-[9px] uppercase"
                    >
                      {item.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground block text-[10px] font-medium tracking-wide uppercase">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground p-8 text-center text-sm">
          {t('admin:noRecentContent')}
        </div>
      )}
    </HubWidget>
  )
}
