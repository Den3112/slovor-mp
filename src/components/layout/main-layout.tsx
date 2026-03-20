import { Header } from './header'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { PullToRefresh } from '@/components/ui/pull-to-refresh'

const Footer = dynamic<{ lang?: string }>(() =>
  import('./footer').then((mod) => mod.Footer)
)
const BottomTabBar = dynamic<{ lang?: string }>(() =>
  import('./bottom-tab-bar').then((mod) => mod.BottomTabBar)
)

interface MainLayoutProps {
  children: React.ReactNode
  lang?: string
  showFooter?: boolean
  showBottomTab?: boolean
  showHeader?: boolean
}

export function MainLayout({
  children,
  lang,
  showFooter = true,
  showBottomTab = true,
  showHeader = true,
}: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {showHeader && (
        <Suspense
          fallback={
            <div className="bg-background border-border h-16 border-b" />
          }
        >
          <Header lang={lang} />
        </Suspense>
      )}
      <main className="flex-1 pb-16 md:pb-0">
        <PullToRefresh>{children}</PullToRefresh>
      </main>
      {showBottomTab && <BottomTabBar lang={lang} />}
      {showFooter && <Footer lang={lang} />}
    </div>
  )
}
