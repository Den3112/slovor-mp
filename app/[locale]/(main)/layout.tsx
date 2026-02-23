import { Header } from '@/components/layout/header'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { PullToRefresh } from '@/components/ui/pull-to-refresh'

const Footer = dynamic(() =>
  import('@/components/layout/footer').then((mod) => mod.Footer)
)
const BottomTabBar = dynamic(() =>
  import('@/components/layout/bottom-tab-bar').then((mod) => mod.BottomTabBar)
)

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Suspense
        fallback={<div className="bg-background border-border h-16 border-b" />}
      >
        <Header />
      </Suspense>
      <main className="flex-1 pb-16 md:pb-0">
        <PullToRefresh>{children}</PullToRefresh>
      </main>
      <BottomTabBar />
      <Footer />
    </div>
  )
}
