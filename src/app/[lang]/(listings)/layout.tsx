import { MainLayout } from '@/widgets/main-layout'

export default async function ListingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
