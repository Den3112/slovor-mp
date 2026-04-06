import { MainLayout } from '@/widgets/main-layout'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
