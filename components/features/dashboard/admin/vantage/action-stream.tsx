import { motion } from 'framer-motion'
import { History, ArrowRight, User, Terminal, Info } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface Action {
  id: string
  action: string
  user: string
  target: string
  timestamp: string
  status: 'success' | 'warning' | 'info'
}

export function ActionStream() {
  const { t } = useTranslation(['admin'])

  const actions: Action[] = [
    {
      id: '1',
      action: 'Category Updated',
      user: 'Admin Alex',
      target: 'Electronics',
      timestamp: '2m ago',
      status: 'success',
    },
    {
      id: '2',
      action: 'Security Audit',
      user: 'System',
      target: 'Global Permissions',
      timestamp: '15m ago',
      status: 'info',
    },
    {
      id: '3',
      action: 'Multiple Reports',
      user: 'Moderator Sarah',
      target: 'Listing #8812',
      timestamp: '1h ago',
      status: 'warning',
    },
    {
      id: '4',
      action: 'New API Key',
      user: 'Dev Team',
      target: 'Mobile App CI',
      timestamp: '3h ago',
      status: 'success',
    },
  ]

  return (
    <div className="bg-card border-border/50 flex flex-col overflow-hidden rounded-2xl border shadow-sm">
      <div className="border-border/10 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <History className="text-primary h-4 w-4" />
          <h3 className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('admin:operationalPulse') || 'Action Stream'}
          </h3>
        </div>
        <Terminal className="text-muted-foreground h-3.5 w-3.5 opacity-50" />
      </div>

      <div className="divide-border/5 divide-y">
        {actions.map((action, idx) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group hover:bg-muted/30 relative flex items-center gap-4 px-4 py-3 transition-colors"
          >
            <div
              className={cn(
                'flex h-2 w-2 rounded-full',
                action.status === 'success' &&
                  'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]',
                action.status === 'warning' &&
                  'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
                action.status === 'info' &&
                  'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
              )}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-foreground truncate text-xs font-bold tracking-wider uppercase">
                  {action.action}
                </span>
                <span className="text-muted-foreground/60 text-[10px]">
                  {action.timestamp}
                </span>
              </div>
              <div className="text-muted-foreground mt-1 flex items-center gap-2 overflow-hidden text-[10px]">
                <div className="flex shrink-0 items-center gap-1">
                  <User className="h-2.5 w-2.5" />
                  <span>{action.user}</span>
                </div>
                <ArrowRight className="h-2 w-2 shrink-0 opacity-30" />
                <span className="truncate italic">{action.target}</span>
              </div>
            </div>

            <button className="bg-muted text-muted-foreground/60 group-hover:bg-primary group-hover:text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100">
              <Info className="h-3 w-3" />
            </button>
          </motion.div>
        ))}
      </div>

      <button className="bg-muted/20 text-muted-foreground hover:bg-muted flex w-full items-center justify-center py-3 text-[10px] font-bold tracking-widest uppercase transition-all">
        Full Audit Log
      </button>
    </div>
  )
}
