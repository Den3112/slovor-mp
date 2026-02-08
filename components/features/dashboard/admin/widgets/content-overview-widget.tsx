'use client'

import { Layers, FileText, Image as ImageIcon, Video, ArrowRight } from 'lucide-react'
import { HubWidget } from '@/components/features/dashboard/shared/hub-widget'
import { useTranslation } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'

export function ContentOverviewWidget() {
    const { t } = useTranslation(['admin'])

    const items = [
        { id: 1, title: 'Summer Campaign', type: 'blog', author: 'Sarah', date: '2h ago' },
        { id: 2, title: 'Product Showcase', type: 'video', author: 'Mike', date: '5h ago' },
        { id: 3, title: 'New Logo Assets', type: 'image', author: 'Designer', date: '1d ago' },
    ]

    const getIcon = (type: string) => {
        switch (type) {
            case 'blog': return <FileText className="h-4 w-4 text-blue-500" />
            case 'video': return <Video className="h-4 w-4 text-rose-500" />
            case 'image': return <ImageIcon className="h-4 w-4 text-amber-500" />
            default: return <Layers className="h-4 w-4" />
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
                label: 'Manage',
                icon: ArrowRight,
                onClick: () => { }
            }}
        >
            <div className="divide-y divide-border/40">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="bg-muted/20 p-2 rounded-lg border border-border/20">
                                {getIcon(item.type)}
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-sm font-bold text-foreground block max-w-[150px] truncate">
                                    {item.title}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                                        {item.author}
                                    </span>
                                    <Badge variant="outline" className="text-[9px] h-4 px-1 py-0 uppercase border-border/40">
                                        {item.type}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide block">
                                {item.date}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </HubWidget>
    )
}
