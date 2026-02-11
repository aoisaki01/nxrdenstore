import Navbar from '@/components/Navbar';

export default function Privacy() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">Legal</p>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
                <p className="text-slate-500 text-sm mb-10">Last updated: February 2026</p>

                <div className="space-y-8 text-sm text-slate-500 leading-relaxed">
                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">1. Information We Collect</h2>
                        <p className="mb-3">When you use NXRDEN Store, we collect the following information:</p>
                        <ul className="list-disc ml-5 space-y-1.5">
                            <li><strong className="text-slate-900">Account Credentials</strong> — Roblox username and password, required for order delivery</li>
                            <li><strong className="text-slate-900">Backup Codes</strong> — Optional 2FA backup codes, only if you provide them</li>
                            <li><strong className="text-slate-900">Transaction Data</strong> — Order details, amounts, timestamps, and payment status</li>
                            <li><strong className="text-slate-900">Usage Data</strong> — Browser type, device information, and page interactions (collected automatically)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">2. How We Use Your Information</h2>
                        <p className="mb-3">Your information is used for:</p>
                        <ul className="list-disc ml-5 space-y-1.5">
                            <li>Processing and delivering your orders</li>
                            <li>Verifying payment and preventing fraud</li>
                            <li>Providing customer support</li>
                            <li>Improving our service and user experience</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">3. Account Security</h2>
                        <p className="mb-3">
                            We take the security of your Roblox credentials seriously:
                        </p>
                        <ul className="list-disc ml-5 space-y-1.5">
                            <li>Credentials are transmitted over encrypted connections (HTTPS/TLS)</li>
                            <li>Account data is stored temporarily and only for order processing</li>
                            <li>We do not share your credentials with any third party</li>
                            <li>Access to stored credentials is restricted to authorized systems only</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">4. Payment Information</h2>
                        <p>
                            We do not store credit card numbers, bank account details, or e-wallet credentials. All payments are processed through the QRIS (Quick Response Code Indonesian Standard) payment infrastructure, which is managed by authorized Indonesian payment service providers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">5. Data Storage & Retention</h2>
                        <ul className="list-disc ml-5 space-y-1.5">
                            <li>Order records are retained for up to 12 months for support purposes</li>
                            <li>Account credentials are deleted within 48 hours after order completion</li>
                            <li>Service data is stored on Firebase (Google Cloud infrastructure)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">6. Third-Party Services</h2>
                        <p className="mb-3">We use the following third-party services:</p>
                        <ul className="list-disc ml-5 space-y-1.5">
                            <li><strong className="text-slate-900">Firebase</strong> — Database and hosting (Google LLC)</li>
                            <li><strong className="text-slate-900">Cloudinary</strong> — Image storage and optimization</li>
                            <li><strong className="text-slate-900">Vercel</strong> — Application hosting and deployment</li>
                        </ul>
                        <p className="mt-3">Each of these services maintains their own privacy policies and security standards.</p>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">7. Your Rights</h2>
                        <p className="mb-3">You have the right to:</p>
                        <ul className="list-disc ml-5 space-y-1.5">
                            <li>Request access to your personal data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt out of non-essential data collection</li>
                            <li>Contact us with any privacy concerns</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-slate-900 mb-3">8. Contact</h2>
                        <p>
                            For privacy-related inquiries, contact us at <a href="mailto:zaidaan1337@gmail.com" className="text-violet-600 hover:underline">zaidaan1337@gmail.com</a> or through our <a href="/contact" className="text-violet-600 hover:underline">Contact page</a>.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
