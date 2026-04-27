import { CreateListingForm } from '@/features/create-listing'

export const metadata = {
  title: 'Post New Listing | Slovor Marketplace',
  description: 'Create and publish your listing on Slovor Marketplace.',
}

export default function PostPage() {
  return <CreateListingForm />
}
