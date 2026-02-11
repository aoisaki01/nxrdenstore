'use client';

import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { auth } from '@/lib/auth';
import { ref, push, onValue, set, remove, update } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { RefreshCw, LogOut, Package, Database, Wallet, CheckCircle, XCircle, Search, Save, Bell, DollarSign, Edit2, Trash2, Plus, Eye, EyeOff, Upload, Settings, X } from 'lucide-react';

const SEED_DATA = [
    { name: '1,000 RBX', price: 155000, priceDisplay: 'Rp 155.000', category: 'Premium' },
    { name: '1,550 RBX', price: 216000, priceDisplay: 'Rp 216.000', category: 'Premium' },
];

export default function AdminDashboard() {
    // Data State
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stockAccounts, setStockAccounts] = useState([]);
    
    // Config State
    const [rates, setRates] = useState({ rate5Days: 95, rateGamepass: 120 });
    const [exchangeRate, setExchangeRate] = useState(16000); // IDR to USD
    const [popupConfig, setPopupConfig] = useState({ enabled: true, title: '', message: '' });
    const [contactInfo, setContactInfo] = useState({
        whatsapp: '087882924651',
        instagram: 'instagram.com/nxrden.store',
        email: 'noxzzl04@gmail.com',
        telegram: 'directionalblur'
    });
    
    // Stock Management State
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [stockForm, setStockForm] = useState({ email: '', balance: '', rowIndex: null });
    const [isStockSubmitting, setIsStockSubmitting] = useState(false);

    // UI State
    const [view, setView] = useState('orders'); // Default to orders
    const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Regular', image: null });
    const [newStock, setNewStock] = useState({ email: '', balance: '' });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [revealedPasswords, setRevealedPasswords] = useState({});
    
    // Order Processing State
    const [processingOrder, setProcessingOrder] = useState(null);
    const [selectedStockId, setSelectedStockId] = useState('');
    const [manualExchangeRate, setManualExchangeRate] = useState(16000);

    useEffect(() => {
        const refs = [
            { ref: ref(database, 'products'), setter: (data) => setProducts(Object.entries(data || {}).map(([Key, Val]) => ({ id: Key, ...Val }))) },
            { ref: ref(database, 'orders'), setter: (data) => setOrders(Object.entries(data || {}).map(([Key, Val]) => ({ id: Key, ...Val })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))) },
            // Removed stock_accounts ref, fetching from API below
            { ref: ref(database, 'config/rates'), setter: (data) => { if (data) setRates(data); } },
            { ref: ref(database, 'config/exchangeRate'), setter: (data) => { if (data) { setExchangeRate(data); setManualExchangeRate(data); } } },
            { ref: ref(database, 'config/popup'), setter: (data) => { if (data) setPopupConfig(data); } },
            { ref: ref(database, 'config/contacts'), setter: (data) => { if (data) setContactInfo(data); } }
        ];

        const unsubs = refs.map(({ ref, setter }) => onValue(ref, (snap) => setter(snap.val())));
        
        // Fetch Stock from Google Sheets API
        const fetchStock = async () => {
             try {
                 const res = await fetch('/api/stock');
                 const data = await res.json();
                 if (Array.isArray(data)) setStockAccounts(data);
             } catch (e) { console.error("Failed to fetch stock:", e); }
        };
        fetchStock();
        // Poll every 30s to keep fresh
        const interval = setInterval(fetchStock, 30000);

        return () => { unsubs.forEach(unsub => unsub()); clearInterval(interval); }
    }, []);

    // --- PRODUCTS ---
    const handleFileChange = (e) => { if (e.target.files[0]) setNewItem({ ...newItem, image: e.target.files[0] }); };
    
    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = editingId ? (products.find(p => p.id === editingId)?.imageUrl || '') : '';
            if (newItem.image) {
                const formData = new FormData();
                formData.append('file', newItem.image);
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                if (!res.ok) throw new Error('Upload failed');
                imageUrl = (await res.json()).url;
            }
            const productData = {
                name: newItem.name, price: Number(newItem.price), 
                priceDisplay: `Rp ${Number(newItem.price).toLocaleString('id-ID')}`,
                category: newItem.category, 
                customLabel: newItem.category === 'Other' ? (newItem.customLabel || 'Notes') : 'Roblox Username',
                imageUrl, updatedAt: new Date().toISOString()
            };
            
            if (editingId) { await update(ref(database, `products/${editingId}`), productData); }
            else { await push(ref(database, 'products'), { ...productData, createdAt: new Date().toISOString() }); }
            
            setEditingId(null); setNewItem({ name: '', price: '', category: 'Regular', customLabel: '', image: null });
            alert(editingId ? 'Product Updated!' : 'Product Added!');
        } catch (error) { alert('Error: ' + error.message); } finally { setUploading(false); }
    };

    const handleDeleteProduct = async (id) => { if (confirm('Delete this product?')) remove(ref(database, `products/${id}`)); };
    const handleEditProduct = (p) => { 
        setEditingId(p.id); 
        setNewItem({ name: p.name, price: p.price, category: p.category, customLabel: p.customLabel || '', image: null }); 
        setView('products'); 
    };

    // --- STOCK MANAGEMENT ---
    const handleAddStock = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await update(ref(database, `stock_accounts/${editingId}`), { 
                    email: newStock.email, 
                    balance: Number(newStock.balance), 
                    updatedAt: new Date().toISOString() 
                });
                setEditingId(null);
            } else {
                await push(ref(database, 'stock_accounts'), { 
                    email: newStock.email, 
                    balance: Number(newStock.balance), 
                    updatedAt: new Date().toISOString() 
                });
            }
            setNewStock({ email: '', balance: '' });
        } catch (e) { alert('Error: ' + e.message); }
    };

    const handleEditStock = (acc) => {
        setEditingId(acc.id);
        setNewStock({ email: acc.email, balance: acc.balance });
    };

    const handleDeleteStock = async (id) => { if (confirm('Remove this stock account?')) remove(ref(database, `stock_accounts/${id}`)); };

    // --- ORDER PROCESSING ---
    const initiateProcessOrder = (order) => {
        setProcessingOrder(order);
        setManualExchangeRate(exchangeRate);
        setSelectedStockId('');
    };

    const [confirmPassword, setConfirmPassword] = useState('');

    const confirmProcessOrder = async () => {
        if (!selectedStockId) { alert("Please select a stock account!"); return; }
        
        const stockAcc = stockAccounts.find(s => s.id === selectedStockId);
        const usdCost = processingOrder.price / manualExchangeRate;
        
        if (stockAcc.balance < usdCost) {
            if (!confirm(`Warning: Account balance ($${stockAcc.balance.toFixed(2)}) is less than cost ($${usdCost.toFixed(2)}). Continue anyway?`)) return;
        }

        if (confirmPassword !== "car123los.") { alert("Wrong password"); return; }

        try {
            // 1. Deduct balance via Google Sheets API
            const newBalance = stockAcc.balance - usdCost;
            
            // Call API to update sheet
            const res = await fetch('/api/stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rowIndex: stockAcc.rowIndex, newBalance }),
            });
            
            if (!res.ok) throw new Error('Failed to update Google Sheet');

            // Update local state immediately for UI responsiveness
            setStockAccounts(prev => prev.map(acc => acc.id === selectedStockId ? { ...acc, balance: newBalance } : acc));

            // 2. Mark order as completed in Firebase
            await update(ref(database, `orders/${processingOrder.id}`), { 
                status: 'completed', 
                processedAt: new Date().toISOString(),
                processedByAccount: stockAcc.email,
                usdCost: usdCost,
                exchangeRateUsed: manualExchangeRate
            });

            setProcessingOrder(null);
            setConfirmPassword('');
            alert("Order processed! Stock deducted from Google Sheet.");
        } catch (e) { alert("Error processing: " + e.message); }
    };

    // --- SETTINGS (RATES & POPUP) ---
    const handleUpdateRates = async (e) => {
        e.preventDefault();
        await set(ref(database, 'config/rates'), { rate5Days: Number(rates.rate5Days), rateGamepass: Number(rates.rateGamepass) });
        await set(ref(database, 'config/exchangeRate'), Number(exchangeRate));
        alert('Rates Updated!');
    };

    const handleUpdatePopup = async (e) => {
        e.preventDefault();
        await set(ref(database, 'config/popup'), popupConfig);
        alert('Popup Settings Saved!');
    };

    // --- STOCK HANDLERS ---
    const handleOpenStockModal = (account = null) => {
        if (account) {
            setStockForm({ email: account.email, balance: account.balance, rowIndex: account.rowIndex });
        } else {
            setStockForm({ email: '', balance: '', rowIndex: null });
        }
        setIsStockModalOpen(true);
    };

    const handleSaveStock = async (e) => {
        e.preventDefault();
        setIsStockSubmitting(true);
        try {
            const payload = stockForm.rowIndex 
                ? { rowIndex: stockForm.rowIndex, newBalance: Number(stockForm.balance) }
                : { email: stockForm.email, balance: Number(stockForm.balance) };

            const res = await fetch('/api/stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save stock');
            
            alert('Stock saved!');
            setIsStockModalOpen(false);
            // Refresh
            const updated = await (await fetch('/api/stock')).json();
            setStockAccounts(updated);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsStockSubmitting(false);
        }
    };

    const handleSaveContactInfo = async (e) => {
        e.preventDefault();
        try {
            await set(ref(database, 'config/contacts'), contactInfo);
            alert('Contact Info Updated!');
        } catch (error) {
            alert('Error updating contact info: ' + error.message);
        }
    };

    const togglePasswordReveal = (orderId) => setRevealedPasswords(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    const formatTime = (ts) => ts ? new Date(ts).toLocaleString() : '-';
    const pendingCount = orders.filter(o => o.status === 'pending').length;

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Nav */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-purple-100 shadow-sm gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
                    <p className="text-slate-500 text-sm">Store Management System</p>
                </div>
                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <div className="bg-violet-50 rounded-lg p-1 flex flex-wrap gap-1">
                        {[
                            { id: 'orders', icon: Package, label: 'Orders' },
                            { id: 'stock', icon: Wallet, label: 'Stock' },
                            { id: 'products', icon: Database, label: 'Products' },
                            { id: 'rates', icon: DollarSign, label: 'Rates' },
                            { id: 'popup', icon: Bell, label: 'Popup' }
                        ].map((tab) => (
                            <button key={tab.id} onClick={() => setView(tab.id)}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${view === tab.id ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}>
                                <tab.icon size={16} /> 
                                {tab.label}
                                {tab.id === 'orders' && pendingCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{pendingCount}</span>}
                            </button>
                        ))}
                    </div>
                     <button onClick={() => signOut(auth)} className="text-red-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"><LogOut size={20} /></button>
                </div>
            </div>

            {/* --- ORDERS VIEW --- */}
            {view === 'orders' && (
                <div className="bg-white border border-purple-100 p-6 rounded-2xl shadow-sm overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Package size={20} className="text-violet-600" /> Order Queue
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-violet-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Order</th>
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Creds</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-purple-50">
                                {orders.length === 0 ? <tr><td colSpan="6" className="p-6 text-center text-slate-500">No orders yet.</td></tr> : 
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-purple-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-mono text-xs text-violet-500 pb-1">{order.orderCode || order.id.slice(0,8)}</div>
                                            <div className="text-xs text-slate-400">{formatTime(order.createdAt)}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-900">{order.productName}</div>
                                            <div className="text-xs text-slate-500">{order.category}</div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-violet-600">Rp {order.price?.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400 w-12">User:</span>
                                                    <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded select-all">{order.username}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400 w-12">Pass:</span>
                                                    <span className="font-mono text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded select-all">
                                                        {revealedPasswords[order.id] ? order.password : '••••••'}
                                                    </span>
                                                    <button onClick={() => togglePasswordReveal(order.id)} className="text-slate-400 hover:text-violet-600"><Eye size={12} /></button>
                                                </div>
                                                {order.backupCode && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-slate-400 w-12">Backup:</span>
                                                        <span className="font-mono text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded select-all">{order.backupCode}</span>
                                                    </div>

                                                )}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400 w-12">WA:</span>
                                                    <span className="font-mono text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded select-all">{order.whatsapp || '-'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {order.status?.toUpperCase() || 'PENDING'}
                                            </span>
                                            {order.processedByAccount && <div className="text-[10px] text-slate-400 mt-1">via: {order.processedByAccount}</div>}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {order.status !== 'completed' && (
                                                <button onClick={() => initiateProcessOrder(order)} 
                                                    className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm hover:shadow-md">
                                                    Process
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- PROCESS ORDER MODAL --- */}
            {processingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Wallet className="text-violet-600" /> Fulfill Order
                            </h3>
                            <button onClick={() => setProcessingOrder(null)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Order Details</div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-slate-900">{processingOrder.productName}</span>
                                    <span className="font-mono font-bold text-violet-700">Rp {processingOrder.price.toLocaleString()}</span>
                                </div>
                                <div className="text-xs text-slate-500">WA: {processingOrder.whatsapp}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">1. Select Stock Account</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {stockAccounts.sort((a,b) => b.balance - a.balance).map(acc => (
                                        <button key={acc.id} onClick={() => setSelectedStockId(acc.id)}
                                            className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${selectedStockId === acc.id ? 'bg-violet-600 border-violet-600 text-white shadow-md' : 'bg-white border-slate-200 hover:border-violet-300 text-slate-600'}`}>
                                            <div className="flex flex-col items-start">
                                                <span className="text-sm font-semibold">{acc.email}</span>
                                                <span className="text-[10px] opacity-80">Last used: {formatTime(acc.lastUsedAt)}</span>
                                            </div>
                                            <div className="font-mono font-bold text-lg">${acc.balance.toFixed(2)}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Exchange Rate (IDR/USD)</label>
                                    <input type="number" value={manualExchangeRate} onChange={e => setManualExchangeRate(Number(e.target.value))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono text-sm focus:border-violet-500 outline-none" />
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-center items-end">
                                    <label className="text-xs text-slate-500 mb-1">Calculated Cost (USD)</label>
                                    <div className="relative w-full">
                                        <span className="absolute left-2 top-1.5 text-red-500 font-bold">$</span>
                                        <input 
                                            type="number" 
                                            step="0.01" 
                                            value={(processingOrder.price / manualExchangeRate).toFixed(2)} 
                                            onChange={(e) => {
                                                const newCost = Number(e.target.value);
                                                if (newCost > 0) {
                                                    setManualExchangeRate(processingOrder.price / newCost);
                                                }
                                            }}
                                            className="w-full bg-transparent text-right font-mono font-bold text-red-500 text-lg outline-none border-b border-dotted border-red-300 focus:border-red-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Confirm Password</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-violet-500 outline-none" placeholder="Enter admin password" />
                            </div>

                            <button onClick={confirmProcessOrder}
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-violet-200 transition-all mt-4 flex items-center justify-center gap-2">
                                <CheckCircle size={20} /> Convert & Deduct Balance
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- STOCK VIEW --- */}
            {view === 'stock' && (
                <div className="max-w-4xl mx-auto bg-white border border-purple-100 p-6 rounded-2xl shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Stock Accounts (Google Sheets)</h3>
                            <p className="text-sm text-slate-500">Synced with Sheet: 1wsBjBN1...</p>
                        </div>
                        <a href="https://docs.google.com/spreadsheets/d/1wsBjBN1-U5lE8sxf3w2Bz9-i73D9j4xo8UHPsNQoesM/edit" target="_blank" rel="noreferrer"
                           className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition text-xs">
                            <Database size={14} /> Open Sheet
                        </a>
                        <button onClick={() => handleOpenStockModal()} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-bold transition text-xs">
                            <Plus size={14} /> Add Account
                        </button>
                     </div>
                     
                     <div className="space-y-3">
                        {stockAccounts.map(acc => (
                            <div key={acc.id} className="flex justify-between items-center p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition bg-slate-50/50">
                                <div>
                                    <div className="font-semibold text-slate-800">{acc.email}</div>
                                    <div className="text-xs text-slate-400">Row: {acc.rowIndex}</div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <div>
                                        <div className="text-xs text-slate-400">Balance USD</div>
                                        <div className={`font-mono text-lg font-bold ${acc.balance < 5 ? 'text-red-500' : 'text-green-600'}`}>
                                            ${Number(acc.balance).toFixed(2)}
                                        </div>
                                    </div>
                                    <button onClick={() => handleOpenStockModal(acc)} className="p-2 text-violet-600 hover:bg-violet-100 rounded-lg">
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {stockAccounts.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                <RefreshCw size={32} className="mx-auto mb-3 animate-spin opacity-50" />
                                <p>Syncing with Google Sheets...</p>
                            </div>
                        )}
                     </div>

                     {/* Stock Modal */}
                     {isStockModalOpen && (
                        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl w-full max-w-md p-6">
                                <h3 className="text-lg font-bold mb-4">{stockForm.rowIndex ? 'Edit Balance' : 'Add New Account'}</h3>
                                <form onSubmit={handleSaveStock} className="space-y-4">
                                    {!stockForm.rowIndex && (
                                        <div>
                                            <label className="text-xs font-bold text-slate-500">Email (Outlook/Login)</label>
                                            <input required type="email" value={stockForm.email} onChange={e => setStockForm({...stockForm, email: e.target.value})} 
                                                className="w-full border rounded-lg p-3 mt-1" placeholder="email@outlook.com" />
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500">Balance (USD)</label>
                                        <input required type="number" step="0.01" value={stockForm.balance} onChange={e => setStockForm({...stockForm, balance: e.target.value})} 
                                            className="w-full border rounded-lg p-3 mt-1" placeholder="0.00" />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setIsStockModalOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancel</button>
                                        <button disabled={isStockSubmitting} className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-bold">{isStockSubmitting ? 'Saving...' : 'Save'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                     )}
                </div>
            )}
            
            {/* --- PRODUCTS VIEW --- */}
            {view === 'products' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white border border-purple-100 p-6 rounded-2xl shadow-sm h-fit">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h3>
                        <form onSubmit={handleSubmitProduct} className="space-y-4">
                            <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full border rounded-lg p-2.5" required />
                            <input placeholder="Price (IDR)" type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full border rounded-lg p-2.5" required />
                            <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full border rounded-lg p-2.5">
                                <option value="Regular">Regular</option><option value="Premium">Premium</option><option value="Other">Other</option>
                            </select>
                            {newItem.category === 'Other' && <input placeholder="Label (e.g. WhatsApp)" value={newItem.customLabel} onChange={e => setNewItem({...newItem, customLabel: e.target.value})} className="w-full border rounded-lg p-2.5" />}
                            <input type="file" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                            <button disabled={uploading} className="w-full bg-violet-600 text-white py-2 rounded-lg font-bold hover:bg-violet-700 transition">{uploading ? '...' : (editingId ? 'Save' : 'Add')}</button>
                            {editingId && <button type="button" onClick={() => { setEditingId(null); setNewItem({ name: '', price: '', category: 'Regular', image: null }); }} className="w-full bg-slate-100 py-2 rounded-lg mt-2">Cancel</button>}
                        </form>
                    </div>
                    <div className="md:col-span-2 bg-white border border-purple-100 p-6 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map(p => (
                            <div key={p.id} className="flex justify-between p-4 border rounded-xl items-center">
                                <div>
                                    <div className="font-bold">{p.name}</div>
                                    <div className="text-violet-600 text-sm">{p.priceDisplay}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditProduct(p)} className="p-2 bg-slate-50 rounded-lg hover:bg-violet-50 text-violet-600"><Edit2 size={16}/></button>
                                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-slate-50 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- RATES --- */}
            {view === 'rates' && (
                <div className="max-w-2xl mx-auto bg-white border border-purple-100 p-8 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><DollarSign size={24} className="text-violet-600" /> Rates Configuration</h3>
                    <div className="space-y-6">
                        <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                             <label className="block text-sm font-bold text-blue-800 mb-2">Exchange Rate (IDR to USD)</label>
                             <div className="flex items-center gap-3">
                                 <span className="text-slate-500">1 USD = Rp</span>
                                 <input type="number" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 font-mono font-bold text-blue-900" />
                             </div>
                             <p className="text-xs text-blue-600 mt-2">Used to calculate costs when fulfilling orders.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-slate-500">5 Days Rate</label><input value={rates.rate5Days} onChange={e => setRates({...rates, rate5Days: e.target.value})} className="w-full border rounded-lg p-2 mt-1" /></div>
                            <div><label className="text-xs font-bold text-slate-500">Gamepass Rate</label><input value={rates.rateGamepass} onChange={e => setRates({...rates, rateGamepass: e.target.value})} className="w-full border rounded-lg p-2 mt-1" /></div>
                        </div>
                        <button onClick={handleUpdateRates} className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700">Save Rates</button>
                    </div>
                </div>
            )}

            {/* --- POPUP --- */}
            {view === 'popup' && (
                <div className="max-w-xl mx-auto bg-white border border-purple-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Notification Popup</h3>
                    <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg mb-4">
                        <span className="font-semibold">Enable Popup</span>
                        <button onClick={() => setPopupConfig({...popupConfig, enabled: !popupConfig.enabled})} className={`w-10 h-6 rounded-full relative transition ${popupConfig.enabled ? 'bg-violet-600' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${popupConfig.enabled ? 'left-5' : 'left-1'}`}></div>
                        </button>
                    </div>
                    <input placeholder="Title" value={popupConfig.title} onChange={e => setPopupConfig({...popupConfig, title: e.target.value})} className="w-full border rounded-lg p-2.5 mb-3" />
                    <textarea placeholder="Message" value={popupConfig.message} onChange={e => setPopupConfig({...popupConfig, message: e.target.value})} className="w-full border rounded-lg p-2.5 mb-3 h-24" />
                    <button onClick={handleUpdatePopup} className="w-full bg-violet-600 text-white font-bold py-2.5 rounded-lg">Save Popup</button>
                </div>
            )}
            {/* --- CONTACT VIEW --- */}
            {view === 'contact' && (
                <div className="max-w-2xl">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                             Contact Settings
                        </h3>
                        <form onSubmit={handleSaveContactInfo} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500">WhatsApp (Number only, e.g. 08...)</label>
                                <input type="text" value={contactInfo.whatsapp} onChange={e => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                                    className="w-full border rounded-lg p-3 mt-1" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Instagram (Link or Username)</label>
                                <input type="text" value={contactInfo.instagram} onChange={e => setContactInfo({...contactInfo, instagram: e.target.value})}
                                    className="w-full border rounded-lg p-3 mt-1" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Email</label>
                                <input type="text" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
                                    className="w-full border rounded-lg p-3 mt-1" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Telegram (Username)</label>
                                <input type="text" value={contactInfo.telegram} onChange={e => setContactInfo({...contactInfo, telegram: e.target.value})}
                                    className="w-full border rounded-lg p-3 mt-1" />
                            </div>
                            <button className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition">
                                Save Contact Info
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
