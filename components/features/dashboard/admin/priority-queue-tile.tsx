'use client'

import { AlertCircle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PriorityQueueTile() {
  const priorities = [
    {
      id: 1,
      type: 'report',
      label: 'User Reports',
      count: 3,
      icon: ShieldAlert,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
    {
      id: 2,
      type: 'moderation',
      label: 'Pending Listings',
      count: 12,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      id: 3,
      type: 'verification',
      label: 'ID Verification',
      count: 5,
      icon: CheckCircle2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ]

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-bold tracking-tight uppercase opacity-60">
              Priority Queue
            </h3>
          </div>
          <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">
            Action Required
          </span>
        </div>

        <div className="space-y-3">
          {priorities.map((item) => (
            <div
              key={item.id}
              className="bg-background/40 hover:bg-background/60 border-border/20 flex items-center justify-between rounded-xl border p-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`${item.bg} flex h-8 w-8 items-center justify-center rounded-lg`}
                >
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-sm font-bold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="mt-4 w-full border-rose-500/20 font-bold hover:bg-rose-500/5 hover:text-rose-500"
      >
        Resolve All Issues
      </Button>
    </div>
  )
}
