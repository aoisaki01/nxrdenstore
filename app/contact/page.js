'use client';

import Navbar from '@/components/Navbar';
import { Mail, MessageCircle, Phone, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

export default function Contact() {
    const [contacts, setContacts] = useState({
        email: 'noxzzl04@gmail.com',
        whatsapp: '087882924651',
        instagram: 'instagram.com/nxrden.store',
        telegram: 'directionalblur'
    });

    useEffect(() => {
        const unsubscribe = onValue(ref(database, 'config/contacts'), (snapshot) => {
            if (snapshot.exists()) {
                setContacts(snapshot.val());
            }
        });
        return () => unsubscribe();
    }, []);

    const channels = [
        {
            icon: <Mail size={20} />,
            label: 'Email',
            value: contacts.email,
            href: `mailto:${contacts.email}`,
        },
        {
            icon: <Phone size={20} />,
            label: 'WhatsApp',
            value: contacts.whatsapp,
            href: `https://wa.me/${contacts.whatsapp.replace(/[^0-9]/g, '')}`,
        },
        {
            icon: <Instagram size={20} />,
            label: 'Instagram',
            value: contacts.instagram.replace('https://', '').replace('instagram.com/', '@'),
            href: contacts.instagram.startsWith('http') ? contacts.instagram : `https://${contacts.instagram}`,
        },
        {
            icon: <MessageCircle size={20} />,
            label: 'Telegram',
            value: contacts.telegram,
            href: `https://t.me/${contacts.telegram.replace('@', '')}`,
        },
    ];

    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">Support</p>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Contact Us</h1>
                <p className="text-slate-500 mb-10 leading-relaxed">
                    Need help with an order or have a question? Reach out through any of these channels and we'll get back to you as soon as possible.
                </p>

                <div className="space-y-3">
                    {channels.map((ch) => (
                        <a
                            key={ch.label}
                            href={ch.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-2xl hover:border-violet-200 hover:shadow-sm transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all">
                                {ch.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-500">{ch.label}</p>
                                <p className="text-sm font-medium text-slate-900 truncate">{ch.value}</p>
                            </div>
                            <span className="text-slate-400 text-xs">→</span>
                        </a>
                    ))}
                </div>

                <div className="mt-12 p-5 bg-white border border-zinc-100 rounded-2xl">
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">Response Time</h3>
                    <p className="text-sm text-slate-500">
                        We typically respond within <strong className="text-slate-900">1-2 hours</strong> during operating hours (08:00 - 22:00 WIB).
                        For urgent matters, please use WhatsApp.
                    </p>
                </div>
            </div>
        </main>
    );
}
