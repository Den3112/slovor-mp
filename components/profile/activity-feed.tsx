import { MessageSquare, Heart, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityItem {
    id: string
    type: 'message' | 'like' | 'system' | 'sale'
    title: string
    description: string
    time: string
    isUnread: boolean
}

export function ActivityFeed() {
    const activities: ActivityItem[] = [
        {
            id: '1',
            type: 'message',
            title: 'New Message',
            description: 'Peter sent you a question about iPhone 15',
            time: '2m ago',
            isUnread: true,
        },
        {
            id: '2',
            type: 'like',
            title: 'Listing Favorited',
            description: 'Your item "MacBook M3" was saved by 5 users',
            time: '1h ago',
            isUnread: false,
        },
        {
            id: '3',
            type: 'system',
            title: 'Listing Expiring',
            description: 'Your "Vintage Watch" listing expires in 2 days',
            time: '3h ago',
            isUnread: false,
        },
    ]

    return (
        <div className="space-y-4">
            {activities.map((item) => (
                <div
                    key={item.id}
                    className={cn(
                        "group relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 border border-transparent",
                        item.isUnread ? "bg-primary/5 border-primary/10" : "hover:bg-white/5"
                    )}
                >
                    <div className={cn(
                        "mt-1 p-2 rounded-xl shadow-inner",
                        item.type === 'message' && "bg-blue-500/10 text-blue-500",
                        item.type === 'like' && "bg-rose-500/10 text-rose-500",
                        item.type === 'system' && "bg-amber-500/10 text-amber-500"
                    )}>
                        {item.type === 'message' && <MessageSquare className="h-4 w-4" />}
                        {item.type === 'like' && <Heart className="h-4 w-4" />}
                        {item.type === 'system' && <Info className="h-4 w-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                            <h4 className={cn(
                                "text-sm font-bold truncate transition-colors",
                                item.isUnread ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {item.title}
                            </h4>
                            <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                                {item.time}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground/70 truncate">
                            {item.description}
                        </p>
                    </div>

                    {item.isUnread && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                    )}
                </div>
            ))}
        </div>
    )
}
