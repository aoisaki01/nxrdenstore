'use client';

import { useState, useEffect } from 'react';
import { Calculator, Zap, Gamepad2 } from 'lucide-react';
import { database } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

export default function RobuxCalculator({ onBuy }) {
    const [mode, setMode] = useState('5days');
    const [inputType, setInputType] = useState('robux'); // 'robux' or 'usd'
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState(0);
    const [rates, setRates] = useState({ rate5Days: 95, rateGamepass: 120 });
    const [exchangeRate, setExchangeRate] = useState(16000);

    useEffect(() => {
        const ratesRef = ref(database, 'config/rates');
        const exRef = ref(database, 'config/exchangeRate');
        
        const unsubRates = onValue(ratesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setRates({ rate5Days: Number(data.rate5Days) || 95, rateGamepass: Number(data.rateGamepass) || 120 });
        });
        
        const unsubEx = onValue(exRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setExchangeRate(Number(data));
        });

        return () => { unsubRates(); unsubEx(); };
    }, []);

    useEffect(() => {
        const val = parseFloat(amount) || 0;
        const ratePerRobux = mode === '5days' ? rates.rate5Days : rates.rateGamepass;
        
        if (inputType === 'robux') {
            setPrice(val * ratePerRobux);
        } else {
            // Input is USD
            // Price IDR = USD * ExchangeRate
            setPrice(Math.ceil(val * exchangeRate));
        }
    }, [amount, mode, rates, inputType, exchangeRate]);

    const handleBuy = () => {
        if (!amount || price <= 0) return;
        
        let name = '';
        if (inputType === 'robux') {
            name = `${amount} Robux (${mode === '5days' ? '5 Days' : 'Gamepass'})`;
        } else {
            // Estimate Robux for display
            const ratePerRobux = mode === '5days' ? rates.rate5Days : rates.rateGamepass;
            const estimatedRobux = Math.floor(price / ratePerRobux);
            name = `$${amount} USD / ~${estimatedRobux} Robux (${mode === '5days' ? '5 Days' : 'Gamepass'})`;
        }

        onBuy({
            id: `custom_${mode}_${inputType}_${amount}`,
            name: name,
            price: price,
            priceDisplay: `Rp ${price.toLocaleString('id-ID')}`,
            category: 'Custom Order'
        });
    };

    return (
        <section className="mb-12">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Custom Order</h2>

            <div className="bg-white border border-zinc-100 rounded-2xl p-5 max-w-lg">
                {/* Mode tabs */}
                <div className="flex gap-2 mb-5">
                    <button onClick={() => setMode('5days')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === '5days' ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/25' : 'bg-zinc-50 text-slate-500 hover:bg-zinc-100'}`}>
                        <Zap size={14} /> 5 Days
                    </button>
                    <button onClick={() => setMode('gamepass')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === 'gamepass' ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/25' : 'bg-zinc-50 text-slate-500 hover:bg-zinc-100'}`}>
                        <Gamepad2 size={14} /> Gamepass
                    </button>
                </div>

                {/* Input Type Toggle */}
                <div className="flex justify-end mb-2">
                    <button onClick={() => { setInputType(prev => prev === 'robux' ? 'usd' : 'robux'); setAmount(''); }} 
                        className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1">
                        Switch to {inputType === 'robux' ? 'USD Input ($)' : 'Robux Input'}
                    </button>
                </div>

                {/* Input */}
                <div className="mb-4">
                    <label className="block text-xs text-slate-500 mb-1.5 font-medium">
                        {inputType === 'robux' ? 'Amount (Robux)' : 'Amount (USD)'}
                    </label>
                    <div className="relative">
                        {inputType === 'usd' && <span className="absolute left-4 top-3 text-slate-500">$</span>}
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={inputType === 'robux' ? "e.g. 500" : "e.g. 10"}
                            className={`w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 text-slate-900 font-mono text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-zinc-400 ${inputType === 'usd' ? 'pl-8 pr-4' : 'px-4'}`}
                        />
                    </div>
                     <p className="text-[11px] text-slate-500 mt-1.5">
                        {inputType === 'robux' 
                            ? `Rate: Rp ${mode === '5days' ? rates.rate5Days : rates.rateGamepass} per Robux`
                            : `Rate: 1 USD = Rp ${exchangeRate.toLocaleString('id-ID')}`
                        }
                    </p>
                </div>

                {/* Total + Button */}
                <div className="flex items-center justify-between bg-violet-50 rounded-xl px-4 py-3 mb-4">
                    <span className="text-xs text-slate-500">Total</span>
                    <span className="text-lg font-bold text-violet-600 font-mono">
                        Rp {price.toLocaleString('id-ID')}
                    </span>
                </div>

                <button
                    onClick={handleBuy}
                    disabled={!amount || price <= 0}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm shadow-violet-600/25"
                >
                    <Calculator size={14} />
                    Order Now
                </button>
            </div>
        </section>
    );
}
