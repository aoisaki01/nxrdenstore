'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { database } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

export default function NotificationPopup() {
    const [config, setConfig] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Check if already dismissed this session
        if (sessionStorage.getItem('nxrden_popup_dismissed')) return;

        const popupRef = ref(database, 'config/popup');
        const unsub = onValue(popupRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.enabled && (data.title || data.message)) {
                setConfig(data);
                setVisible(true);
            }
        });

        return () => unsub();
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        sessionStorage.setItem('nxrden_popup_dismissed', 'true');
    };

    if (!config) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    onClick={handleDismiss}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-violet-500/10 border border-violet-100 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition"
                        >
                            <X size={20} />
                        </button>

                        {/* Purple accent bar */}
                        <div className="w-12 h-1 bg-violet-600 rounded-full mb-4"></div>

                        {/* Content */}
                        {config.title && (
                            <h3 className="text-xl font-bold text-slate-900 mb-2 pr-8">{config.title}</h3>
                        )}
                        {config.message && (
                            <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{config.message}</p>
                        )}

                        {/* Dismiss button */}
                        <button
                            onClick={handleDismiss}
                            className="mt-6 w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-sm shadow-violet-600/25"
                        >
                            Got it!
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
