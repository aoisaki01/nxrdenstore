'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative py-20 md:py-28 overflow-hidden">
            {/* Purple gradient bg */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-100/60 via-white to-purple-50/40 -z-10" />

            <div className="max-w-6xl mx-auto px-5">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl"
                >
                    <p className="text-sm font-medium text-violet-600 mb-4 tracking-wide">NXRDEN STORE</p>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                        Top up Robux,<br />
                        <span className="text-violet-500 text-glow">instantly.</span>
                    </h1>

                    <p className="mt-5 text-base md:text-lg text-slate-500 max-w-lg leading-relaxed">
                        The fastest and most secure way to get Robux. Automated payments, instant delivery, 24/7 support.
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                        <a
                            href="#custom"
                            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all active:scale-[0.97] shadow-lg shadow-violet-600/25"
                        >
                            Browse Products <ArrowDown size={16} />
                        </a>
                        <a href="/tatacara-pembelian" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">
                            How it works →
                        </a>
                    </div>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mt-16 flex gap-10 md:gap-16"
                >
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-slate-900">24/7</p>
                        <p className="text-xs text-slate-500 mt-0.5">Support</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-slate-900">~1min</p>
                        <p className="text-xs text-slate-500 mt-0.5">Delivery Time</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-slate-900">QRIS</p>
                        <p className="text-xs text-slate-500 mt-0.5">Payment</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
