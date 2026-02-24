import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnalyticsChart } from '@/components/seller-profile/analytics-chart'
import { useTranslation } from '@/lib/i18n'
import { PerformanceChartProps } from './types'

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function PerformanceCard({ data }: PerformanceChartProps) {
  const { t } = useTranslation(['dashboard'])

  return (
    <motion.div variants={item} className="h-full space-y-4">
      <Card className="bg-card border-border flex h-full flex-col overflow-hidden rounded-2xl border shadow-md transition-all duration-500">
        <CardHeader className="bg-muted/30 border-border/40 border-b px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary/40 text-[10px] font-black tracking-[0.3em] uppercase">
                {t('dashboard:performance')}
              </CardTitle>
              <p className="text-foreground mt-1 text-lg font-black tracking-tight">
                {t('dashboard:viewsOverTime')}
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-primary/10 bg-primary/5 px-4 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase"
            >
              {t('dashboard:last7Days')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-8 pt-10">
          <AnalyticsChart data={data} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
