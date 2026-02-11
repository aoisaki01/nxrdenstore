import Navbar from '@/components/Navbar';

export default function FAQ() {
    const faqs = [
        {
            q: 'How long does delivery take?',
            a: 'Our system is automated. Once payment is verified, Robux is typically delivered within 1-5 minutes. For the 5 Days method, delivery happens within the Roblox pending period.'
        },
        {
            q: 'What payment methods do you accept?',
            a: 'We accept all QRIS-compatible payments — GoPay, OVO, Dana, ShopeePay, LinkAja, BCA Mobile, and most Indonesian banking apps.'
        },
        {
            q: 'Is it safe to provide my Roblox credentials?',
            a: 'Your credentials are encrypted during transmission and used only for Robux delivery. We never store passwords permanently and delete them within 48 hours of order completion.'
        },
        {
            q: 'What is the difference between 5 Days and Gamepass?',
            a: '5 Days is cheaper but takes 5 days due to Roblox pending period. Gamepass is instant but has a higher rate because of the 30% Roblox marketplace fee.'
        },
        {
            q: 'My order has been pending for a while. What should I do?',
            a: 'If your order hasn\'t been delivered within 10 minutes (for Gamepass) or has issues, please contact our support via WhatsApp or Discord with your Order ID.'
        },
        {
            q: 'Can I get a refund?',
            a: 'Refunds are available if delivery fails on our end or if the incorrect amount is delivered. Since digital goods cannot be returned, all completed deliveries are final.'
        },
        {
            q: 'What is a backup code?',
            a: 'If you have 2-Step Verification (2FA) enabled on your Roblox account, you may need to provide a backup code so we can log in to deliver your Robux. This field is optional.'
        },
        {
            q: 'Do you support other games besides Roblox?',
            a: 'Yes! Check the "Other" category on our store for additional digital products and services.'
        }
    ];

    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">Help</p>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Frequently Asked Questions</h1>
                <p className="text-slate-500 mb-10">
                    Quick answers to common questions about our service.
                </p>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="pb-6 border-b border-zinc-100 last:border-0">
                            <h3 className="text-sm font-semibold text-slate-900 mb-2">{faq.q}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 p-5 bg-white border border-zinc-100 rounded-2xl">
                    <p className="text-sm text-slate-500">
                        Still have questions? <a href="/contact" className="text-violet-600 font-medium hover:underline">Contact our support team</a> — we're happy to help.
                    </p>
                </div>
            </div>
        </main>
    );
}
