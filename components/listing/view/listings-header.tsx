import { Search } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { SaveSearchButton } from '../save-search-button'
import { useTranslation } from '@/lib/i18n'
import { ListingsHeaderProps } from './types'
import { memo } from 'react'

export const ListingsHeader = memo(function ListingsHeader({
  searchQuery,
  totalCount,
  filters,
}: ListingsHeaderProps) {
  const { t } = useTranslation(['common', 'categories'])

  return (
    <div className="relative mb-8 overflow-hidden border-b border-white/5 pt-28 pb-12 md:mb-16 md:pt-40 md:pb-20">
      <div className="bg-mesh absolute inset-0 z-0 opacity-40" />

      {/* Aurora Background Glows - PRO MAX */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute top-0 -left-[10%] h-[500px] w-[500px] animate-pulse rounded-full blur-[100px]" />
        <div className="bg-primary/5 absolute -right-[10%] bottom-0 h-[500px] w-[500px] rounded-full blur-[100px]" />
      </div>

      <Container>
        <div className="relative z-10 flex flex-col gap-6 md:gap-10">
          <div className="glass-panel text-primary shadow-primary/10 border-primary/20 inline-flex w-fit items-center gap-2.5 rounded-full bg-white/50 px-5 py-2 text-[10px] font-black tracking-[0.25em] uppercase backdrop-blur-md">
            <Search className="h-3.5 w-3.5" />
            {t('common:explorer')}
          </div>

          <Breadcrumbs
            items={[
              {
                label: searchQuery
                  ? `${t('common:search')}: ${searchQuery}`
                  : t('common:allListings'),
              },
            ]}
          />

          <h1 className="font-heading text-foreground max-w-5xl text-5xl font-black tracking-tight uppercase md:text-8xl">
            {searchQuery ? searchQuery : t('common:allListings')}
          </h1>

          <div className="flex flex-wrap items-center gap-6">
            <p className="text-muted-foreground flex items-center gap-3 text-xl font-medium md:text-2xl">
              <span className="font-heading text-foreground font-black">
                {t('common:listings', { count: totalCount })}
              </span>
              {filters?.search && (
                <span className="text-muted-foreground/60">
                  {t('common:found')}
                </span>
              )}
            </p>
            <div className="bg-border/40 mx-2 hidden h-8 w-px md:block" />
            <SaveSearchButton
              filters={filters || {}}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </Container>
    </div>
  )
})

ListingsHeader.displayName = 'ListingsHeader'
