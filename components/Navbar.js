"use client";
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'Lacak Pesanan', href: '/lacak-pesanan' },
        { name: 'Products', href: '/#custom' },
        { name: 'How to Buy', href: '/tatacara-pembelian' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-zinc-100">
            <div className="max-w-6xl mx-auto px-5">
                <div className="flex items-center justify-between h-14">
                    <Link href="/" className="text-lg font-bold text-violet-600 tracking-tight">
                        NXRDEN
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {links.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm text-slate-500 hover:text-violet-600 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-slate-500 hover:text-violet-600 p-1.5"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white border-b border-zinc-100 px-5 py-3 space-y-1">
                    {links.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block text-sm text-slate-500 hover:text-violet-600 py-2 transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
