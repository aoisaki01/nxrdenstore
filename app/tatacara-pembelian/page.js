import Navbar from '@/components/Navbar';

export default function TatacaraPembelian() {
    const steps = [
        {
            num: '01',
            title: 'Choose your product',
            desc: 'Browse our catalog and pick the Robux amount or digital product you want. Use the Custom Order calculator for a specific amount.'
        },
        {
            num: '02',
            title: 'Enter your account details',
            desc: 'Provide your Roblox username and password. If you have 2FA enabled, include your backup code. All data is encrypted.'
        },
        {
            num: '03',
            title: 'Pay via QRIS',
            desc: 'Scan the QR code using any QRIS-supported app — GoPay, OVO, Dana, ShopeePay, or your mobile banking app.'
        },
        {
            num: '04',
            title: 'Receive your Robux',
            desc: 'After payment confirmation, our system automatically processes your order. Robux is delivered within minutes.'
        },
    ];

    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">Guide</p>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">How to Buy</h1>
                <p className="text-slate-500 mb-12">
                    Follow these simple steps to purchase Robux from NXRDEN Store.
                </p>

                <div className="space-y-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-5">
                            <div className="shrink-0">
                                <span className="text-2xl font-bold text-violet-300">{step.num}</span>
                            </div>
                            <div className="pt-1">
                                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{step.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-14 flex gap-3">
                    <a href="/" className="inline-flex items-center bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-violet-600/25">
                        Start Shopping
                    </a>
                    <a href="/faq" className="inline-flex items-center bg-zinc-100 hover:bg-zinc-200 text-slate-900 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
                        Read FAQ
                    </a>
                </div>
            </div>
        </main>
    );
}
