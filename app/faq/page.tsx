export default function FAQPage() {
    const faqs = [
        { q: "Is Slovor free to use?", a: "Yes, posting basic ads on Slovor is free for individuals." },
        { q: "How do I contact a seller?", a: "You can use the contact details provided in the listing or our messaging system." },
        { q: "Is my personal data safe?", a: "We prioritize security and use industry-standard encryption to protect your data." }
    ]

    return (
        <div className="py-20 lg:py-32 relative">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl font-bold mb-12 font-heading">Frequently Asked Questions</h1>
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                            <p className="text-zinc-400">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
