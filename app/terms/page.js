import Navbar from '@/components/Navbar';

export default function Terms() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">Legal</p>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Terms of Service</h1>
                <p className="text-slate-500 text-sm mb-10">Last updated: February 2026</p>

                <div className="space-y-8 text-sm text-slate-500 leading-relaxed">
                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using NXRDEN Store ("Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">2. Service Description</h2>
                        <p className="mb-3">
                            NXRDEN Store is a third-party marketplace for digital goods, including but not limited to Roblox currency (Robux) and game-related items. We facilitate the purchase and delivery of these digital goods through automated systems.
                        </p>
                        <p>
                            We are not affiliated with, endorsed by, or sponsored by Roblox Corporation. All trademarks and brand names belong to their respective owners.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">3. Account Information</h2>
                        <p className="mb-3">
                            To process orders, we require your Roblox account credentials (username and password). By providing this information, you:
                        </p>
                        <ul className="list-disc ml-5 space-y-1.5">
                            <li>Confirm you are the rightful owner of the account</li>
                            <li>Authorize us to access your account solely for the purpose of delivering the purchased goods</li>
                            <li>Understand that account credentials are encrypted during transmission and used only for order fulfillment</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">4. Purchases & Payment</h2>
                        <ul className="list-disc ml-5 space-y-1.5">
                            <li>All prices are listed in Indonesian Rupiah (IDR)</li>
                            <li>Payment is processed via QRIS (Quick Response Code Indonesian Standard)</li>
                            <li>Orders are processed automatically upon payment confirmation</li>
                            <li>Delivery typically completes within 1-5 minutes</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">5. Refund Policy</h2>
                        <p className="mb-3">
                            Due to the nature of digital goods, all sales are <strong className="text-slate-900">final</strong> once the goods have been delivered to your account. Refunds are only available in the following cases:
                        </p>
                        <ul className="list-disc ml-5 space-y-1.5">
                            <li>Delivery failure caused by our system</li>
                            <li>Incorrect amount delivered (verified by our team)</li>
                            <li>Payment confirmed but order not received within 24 hours</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">6. Prohibited Activities</h2>
                        <p className="mb-3">You agree not to:</p>
                        <ul className="list-disc ml-5 space-y-1.5">
                            <li>Use stolen payment methods or engage in fraudulent transactions</li>
                            <li>Provide false account information</li>
                            <li>Attempt to exploit, hack, or interfere with our systems</li>
                            <li>Resell goods purchased from our platform without authorization</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">7. Limitation of Liability</h2>
                        <p>
                            NXRDEN Store is not responsible for any account bans, suspensions, or actions taken by Roblox Corporation or any game developer as a result of purchasing third-party digital goods. Use our service at your own discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">8. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. Continued use of our Service after changes constitutes acceptance of the updated Terms. We recommend reviewing this page periodically.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">9. Contact</h2>
                        <p>
                            For questions about these Terms, contact us at <a href="mailto:zaidaan1337@gmail.com" className="text-violet-600 hover:underline">zaidaan1337@gmail.com</a> or through our <a href="/contact" className="text-violet-600 hover:underline">Contact page</a>.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
