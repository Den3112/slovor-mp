import { MainLayout } from '@/components/layout/main-layout'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
