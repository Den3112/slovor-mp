import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ErrorState } from '@/components/ui/error-state'
import { SellerProfileView } from '@/components/profile/SellerProfileView'

interface Props {
    params: Promise<{
        id: string
    }>
}

export default async function SellerProfilePage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch seller profile
    const { data: seller, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (profileError) {
        return <ErrorState message={profileError.message} />
    }

    if (!seller) {
        notFound()
    }

    // Fetch seller's active listings
    const { data: rawListings } = await supabase
        .from('listings')
        .select(`
            *,
            seller:profiles(*),
            category:categories(*)
        `)
        .eq('user_id', id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    const listings = rawListings || []

    return <SellerProfileView seller={seller} listings={listings as any} />
}
