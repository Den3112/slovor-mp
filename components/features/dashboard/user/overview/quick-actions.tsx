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
    <motion.div variants={item} className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-border/40 bg-card overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
        <CardHeader className="border-border/10 bg-muted/5 flex-row items-center justify-between space-y-0 border-b px-6 py-4">
          <CardTitle className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('dashboard:quickActions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 p-3">
          <Button
            variant="outline"
            className="border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/30 group/btn h-11 justify-start gap-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all"
            asChild
          >
            <Link href={`/${locale}/post`}>
              <div className="from-primary/10 to-primary/5 text-primary group-hover/btn:bg-primary rounded-lg bg-linear-to-br p-1.5 transition-all group-hover/btn:text-white">
                <Plus className="h-3.5 w-3.5" />
              </div>
              {t('createListing:publish')}
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-border/60 hover:bg-success/5 hover:text-success hover:border-success/30 group/btn h-11 justify-start gap-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all"
            asChild
          >
            <Link href={`/${locale}/dashboard/promote`}>
              <div className="from-success/10 to-success/5 text-success group-hover/btn:bg-success rounded-lg bg-linear-to-br p-1.5 transition-all group-hover/btn:text-white">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              {t('dashboard:promoteListings')}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card flex h-full flex-col overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
        <CardHeader className="border-border/10 bg-muted/5 flex-row items-center justify-between space-y-0 border-b px-6 py-4">
          <CardTitle className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('dashboard:activityFeed')}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-primary/5 hover:text-primary h-8 px-2 text-[10px] font-bold tracking-widest uppercase"
          >
            <Link href={`/${locale}/messages`}>{t('common:viewAll')}</Link>
          </Button>
        </CardHeader>
        <CardContent className="max-h-[450px] flex-1 overflow-auto p-4">
          <ActivityFeed />
        </CardContent>
      </Card>
    </motion.div>
  )
}
