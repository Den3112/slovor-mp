import { MainLayout } from '@/widgets/main-layout'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout showFooter={false}>{children}</MainLayout>
}
