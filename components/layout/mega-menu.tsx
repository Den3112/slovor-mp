'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { NAV_LINKS } from '@/lib/constants/nav-links'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const { t, locale } = useTranslation(['categories', 'home', 'common', 'nav'])

  // Select the main 8 categories for the mega menu grid
  const mainCategories = NAV_LINKS.categories.slice(0, 8)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="border-border bg-background absolute inset-x-0 top-16 z-50 border-b shadow-lg"
            onMouseLeave={onClose}
          >
            <Container className="py-12">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                {/* Categories Grid - 4 Columns */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:col-span-4">
                  {mainCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <div key={category.id} className="space-y-5">
                        <Link
                          href={`/${locale}/categories/${category.id}`}
                          onClick={onClose}
                          className="group flex items-center gap-3 transition-all"
                        >
                          <div
                            className={cn(
                              'flex h-11 w-11 items-center justify-center rounded-lg text-white shadow-md ring-1 ring-white/10 transition-transform group-hover:scale-110 group-hover:rotate-3',
                              category.color
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-sm leading-none font-bold tracking-tight uppercase">
                              {t(category.label)}
                            </h3>
                            <span className="text-muted-foreground/40 group-hover:text-primary mt-1 text-[10px] font-bold tracking-widest uppercase transition-colors">
                              Explore {t(category.label)}
                            </span>
                          </div>
                        </Link>

                        <ul className="space-y-2.5">
                          {category.popularSubcategories?.map((sub) => (
                            <li key={sub}>
                              <Link
                                href={`/${locale}/categories/${category.id}/${sub}`}
                                onClick={onClose}
                                className="text-muted-foreground/70 hover:text-primary flex items-center gap-2 text-xs font-bold transition-all hover:translate-x-1"
                              >
                                <span className="bg-border h-1 w-1 rounded-full" />
                                {t(sub)}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link
                              href={`/${locale}/categories/${category.id}`}
                              onClick={onClose}
                              className="text-primary/60 hover:text-primary mt-2 inline-block text-[10px] font-bold tracking-widest uppercase transition-colors"
                            >
                              {t('common:viewAll')} →
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )
                  })}
                </div>

                {/* Promotional Side Rail */}
                <div className="border-border/60 hidden space-y-8 border-l pl-10 lg:col-span-1 lg:block">
                  <div className="bg-muted/50 text-foreground border-border/50 group relative overflow-hidden rounded-2xl border p-6 shadow-xl dark:border-white/10 dark:bg-slate-950 dark:text-white">
                    <div className="relative z-10 space-y-4">
                      <Badge className="bg-primary/20 text-primary border-primary/20 h-5 rounded-sm text-[9px] font-bold tracking-widest uppercase">
                        {t('common:featured')}
                      </Badge>
                      <h4 className="text-base leading-tight font-bold tracking-tight">
                        {t('home:promo.title') || 'READY TO SELL FAST?'}
                      </h4>
                      <p className="text-muted-foreground text-xs leading-relaxed font-medium dark:text-slate-400">
                        {t('home:promo.subtitle') ||
                          'Upgrade to VIP and get 10x more views today.'}
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="bg-primary hover:bg-primary/90 h-9 w-full rounded-lg border-0 text-[9px] font-bold tracking-widest uppercase transition-transform group-hover:scale-[1.02]"
                      >
                        <Link href={`/${locale}/post`}>{t('nav:postAd')}</Link>
                      </Button>
                    </div>
                    {/* Glow effect */}
                    <div className="bg-primary/20 group-hover:bg-primary/30 absolute -right-10 -bottom-10 h-32 w-32 rounded-full blur-[50px] transition-colors" />
                  </div>

                  <div className="space-y-5">
                    <h5 className="text-muted-foreground/40 text-center text-[10px] font-bold tracking-widest uppercase">
                      {t('home:popularNow') || 'POPULAR REGIONS'}
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {['bratislava', 'kosice', 'zilina', 'nitra'].map(
                        (cityKey) => (
                          <Link
                            key={cityKey}
                            href={`/${locale}/listings?location=${cityKey}`}
                            onClick={onClose}
                            className="border-border/60 hover:border-primary/50 hover:bg-primary/5 rounded-lg border px-2 py-2 text-center text-[9px] font-bold tracking-widest uppercase transition-all"
                          >
                            {t(`home:regions.${cityKey}`)}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Action */}
              <div className="border-border/40 mt-12 flex items-center justify-between border-t pt-8">
                <div className="flex items-center gap-6">
                  <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    Total:{' '}
                    <span className="text-foreground">45,678 listings</span>{' '}
                    online
                  </p>
                </div>
                <Link
                  href={`/${locale}/categories`}
                  onClick={onClose}
                  className="group text-primary inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all hover:opacity-80"
                >
                  <LayoutGrid className="h-4 w-4" />
                  {t('home:megaMenu.viewAll') || 'VIEW ALL CATEGORIES'}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Container>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
