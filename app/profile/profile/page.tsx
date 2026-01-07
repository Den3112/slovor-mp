
import { createClient } from '@/lib/supabase/server'
import { SellerProfileView } from '@/components/profile/SellerProfileView'
import { redirect } from 'next/navigation'

export default async function DashboardProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch own profile
    const { data: seller, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profileError || !seller) {
        // Fallback or handle error - for now redirect to settings to complete profile
        redirect('/profile/settings')
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Public Profile</h1>
                    <p className="text-muted-foreground">This is how you appear to buyers.</p>
                </div>
                {/* External Link */}
                <a
                    href={`/seller/${user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                >
                    View Public Storefront
                </a>
            </div>
            <SellerProfileView seller={seller} listings={[]} variant="dashboard" />
        </div>
    )
}
