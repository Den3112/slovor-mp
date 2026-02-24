import Link from 'next/link'
import { Plus, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ActivityFeed } from '@/components/seller-profile/activity-feed'
import { useTranslation } from '@/lib/i18n'

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function QuickActionsAndActivity() {
  const { t, locale } = useTranslation(['common', 'dashboard', 'createListing'])

  return (
    <motion.div variants={item} className="h-full space-y-6">
      {/* Quick Actions */}
      <Card className="bg-card overflow-hidden rounded-2xl border border-border shadow-md transition-all duration-500">
        <CardHeader className="bg-muted/30 flex-row items-center justify-between space-y-0 border-b border-border/40 px-8 py-5">
          <CardTitle className="text-primary/40 text-[10px] font-black tracking-[0.3em] uppercase">
            {t('dashboard:quickActions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 p-4">
          <Button
            variant="outline"
            className="border-border hover:bg-primary hover:text-white group/btn h-14 justify-start gap-4 rounded-xl bg-primary/5 px-5 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 active:scale-95"
            asChild
          >
            <Link href={`/${locale}/post`}>
              <div className="bg-primary shadow-primary/20 flex h-8 w-8 items-center justify-center rounded-xl shadow-md transition-all group-hover/btn:scale-110 group-hover/btn:bg-white group-hover/btn:text-primary">
                <Plus className="h-4 w-4" />
              </div>
              {t('createListing:publish')}
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-border hover:bg-success hover:text-white group/btn h-14 justify-start gap-4 rounded-xl bg-success/5 px-5 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 active:scale-95"
            asChild
          >
            <Link href={`/${locale}/dashboard/promote`}>
              <div className="bg-success shadow-success/20 flex h-8 w-8 items-center justify-center rounded-xl shadow-md transition-all group-hover/btn:scale-110 group-hover/btn:bg-white group-hover/btn:text-success">
                <TrendingUp className="h-4 w-4" />
              </div>
              {t('dashboard:promoteListings')}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card flex flex-col overflow-hidden rounded-2xl border border-border shadow-md transition-all duration-500">
        <CardHeader className="bg-muted/30 flex-row items-center justify-between space-y-0 border-b border-border/40 px-8 py-5">
          <CardTitle className="text-primary/40 text-[10px] font-black tracking-[0.3em] uppercase">
            {t('dashboard:activityFeed')}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-primary/10 hover:text-primary h-8 rounded-xl px-4 text-[9px] font-black tracking-[0.2em] uppercase transition-all"
          >
            <Link href={`/${locale}/dashboard/messages`}>
              {t('common:viewAll')}
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="scrollbar-hide max-h-[480px] flex-1 overflow-auto p-6">
          <ActivityFeed />
        </CardContent>
      </Card>
    </motion.div>
  )
}
