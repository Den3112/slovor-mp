import { CreateListingForm } from '@/components/listing/create-listing-form'
import { Container } from '@/components/ui/container'

export default function PostAdPage() {
  return (
    <main className="min-h-screen pb-24">
      <Container className="pt-32 md:pt-40">
        <CreateListingForm />
      </Container>
    </main>
  )
}
