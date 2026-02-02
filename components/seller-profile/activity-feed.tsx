'use client'

import { MessageSquare, Heart, Info, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
            type: 'sale',
            title: 'Items Sold',
            description: 'Your "Acoustic Guitar" was purchased by @marek_s',
            time: '45m ago',
            isUnread: true,
        },
        {
            id: '3',
            type: 'like',
            title: 'Listing Favorited',
            description: 'Your item "MacBook M3" was saved by 5 users',
            time: '1h ago',
            isUnread: false,
        },
        {
            id: '4',
            type: 'system',
            title: 'Listing Expiring',
            description: 'Your "Vintage Watch" listing expires in 2 days',
            time: '3h ago',
            isUnread: false,
        },
    ]

    return (
        <div className="space-y-1">
            {activities.map((item, idx) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                        "group relative flex items-start gap-4 p-3 rounded-xl transition-all duration-200",
                        "hover:bg-accent/50 border border-transparent hover:border-border/50",
                        item.isUnread && "bg-primary/[0.03]"
                    )}
                >
                    <div className={cn(
                        "mt-1 p-2 rounded-lg shrink-0",
                        item.type === 'message' && "bg-primary/10 text-primary",
                        item.type === 'like' && "bg-pink-500/10 text-pink-500",
                        item.type === 'system' && "bg-amber-500/10 text-amber-500",
                        item.type === 'sale' && "bg-success/10 text-success"
                    )}>
                        {item.type === 'message' && <MessageSquare className="h-4 w-4" />}
                        {item.type === 'like' && <Heart className="h-4 w-4" />}
                        {item.type === 'system' && <Info className="h-4 w-4" />}
                        {item.type === 'sale' && <DollarSign className="h-4 w-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h4 className={cn(
                                "text-xs font-bold truncate tracking-tight transition-colors",
                                item.isUnread ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {item.title}
                            </h4>
                            <span className="text-[10px] font-bold text-muted-foreground/50 whitespace-nowrap uppercase tracking-widest ml-2">
                                {item.time}
                            </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/80 leading-relaxed mt-0.5 line-clamp-1">
                            {item.description}
                        </p>
                    </div>

                    {item.isUnread && (
                        <div className="absolute right-2 top-3 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                </motion.div>
            ))}
        </div>
    )
}

