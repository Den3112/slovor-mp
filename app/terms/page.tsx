export default function TermsPage() {
    return (
        <div className="py-20 lg:py-32 relative">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 font-heading">Terms of Service</h1>
                <div className="prose prose-invert text-zinc-400 space-y-6">
                    <p>Last updated: December 26, 2025</p>
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2">1. Acceptance of Terms</h2>
                        <p>By accessing and using Slovor Marketplace, you agree to be bound by these Terms of Service.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2">2. Use of Platform</h2>
                        <p>You agree to use our platform for lawful purposes only and in a way that does not infringe the rights of others.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2">3. Listings</h2>
                        <p>Users are responsible for the content of their listings. We reserve the right to remove any content that violates our policies.</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
