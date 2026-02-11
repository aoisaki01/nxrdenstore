import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-zinc-100 mt-auto">
            <div className="max-w-6xl mx-auto px-5 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <p className="font-bold text-violet-600 text-sm">NXRDEN</p>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-[200px]">
                            Premium Robux marketplace. Fast, secure, and automated.
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Store</p>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href="/#custom" className="hover:text-violet-600 transition-colors">Custom Order</Link></li>
                            <li><Link href="/#premium" className="hover:text-violet-600 transition-colors">Premium</Link></li>
                            <li><Link href="/#regular" className="hover:text-violet-600 transition-colors">Regular</Link></li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Help</p>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href="/tatacara-pembelian" className="hover:text-violet-600 transition-colors">How to Buy</Link></li>
                            <li><Link href="/faq" className="hover:text-violet-600 transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-violet-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Legal</p>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href="/terms" className="hover:text-violet-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-100 mt-8 pt-6 text-xs text-slate-400 text-center">
                    © {new Date().getFullYear()} NXRDEN Store · PASIFIXC
                </div>
            </div>
        </footer>
    );
}
