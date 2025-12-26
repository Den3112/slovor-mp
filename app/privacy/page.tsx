export default function PrivacyPage() {
    return (
        <div className="py-20 lg:py-32 relative">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 font-heading">Privacy Policy</h1>
                <div className="prose prose-invert text-zinc-400 space-y-6">
                    <p>Last updated: December 26, 2025</p>
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2">1. Information Collection</h2>
                        <p>We collect information you provide directly to us when you create an account, post a listing, or communicate with us.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2">2. Data Usage</h2>
                        <p>Your data is used to provide and improve our services, and to ensure the safety of our marketplace members.</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
