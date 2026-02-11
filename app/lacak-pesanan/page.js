'use client';

import { useState } from 'react';
import { database } from '@/lib/firebase'; // Adjust path if needed
import { ref, query, orderByChild, equalTo, get, limitToLast } from 'firebase/database';
import { Search, Package, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar'; // Adjust path
import Footer from '@/components/Footer'; // Adjust path

export default function TrackOrderPage() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);
        setOrders(null);
        setSearched(false);

        try {
            const ordersRef = ref(database, 'orders');
            // Using limitToLast to fetch recent orders and filter client-side 
            // to avoid "Index not defined" error without manual rule changes.
            const q = query(ordersRef, limitToLast(100));
            const snapshot = await get(q);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const allOrders = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                
                const filteredOrders = allOrders.filter(order => 
                    order.username && order.username.toLowerCase() === username.trim().toLowerCase()
                ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                setOrders(filteredOrders);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'text-green-600 bg-green-50 border-green-100';
            case 'processing': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-amber-600 bg-amber-50 border-amber-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return <CheckCircle size={16} />;
            case 'processing': return <Loader2 size={16} className="animate-spin" />;
            case 'cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
            <Navbar />
            
            <main className="pt-32 pb-20 px-4 md:px-0">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            Lacak Pesanan
                        </h1>
                        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                            Masukkan Roblox Username kamu untuk mengecek status pesanan terbaru.
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 mb-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 opacity-50"></div>
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Roblox Username (e.g. Player123)"
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium placeholder:text-slate-400"
                            />
                            <button 
                                type="submit" 
                                disabled={loading || !username.trim()}
                                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-violet-600/20 active:scale-95"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                                <span className="hidden sm:inline">Cek Status</span>
                            </button>
                        </form>
                    </div>

                    {/* Results */}
                    {searched && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {orders && orders.length > 0 ? (
                                <>
                                    <div className="flex items-center gap-2 mb-4 px-2">
                                        <Package size={18} className="text-violet-600" />
                                        <span className="font-bold text-slate-700">Riwayat Pesanan untuk "{username}"</span>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                                                <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-violet-700 transition-colors">
                                                                {order.productName || order.name}
                                                            </h3>
                                                            {order.category && (
                                                                <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                                                                    {order.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-slate-500 font-mono flex items-center gap-2">
                                                            <span>{new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>
                                                            <span className="text-slate-300">•</span>
                                                            <span>ID: {order.orderCode || order.id.slice(0,8)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold text-sm h-fit w-fit ${getStatusColor(order.status || 'pending')}`}>
                                                        {getStatusIcon(order.status || 'pending')}
                                                        <span className="uppercase">
                                                            {order.status === 'pending' ? 'Masuk' : 
                                                             order.status === 'processing' ? 'Diproses' : 
                                                             order.status === 'completed' ? 'Selesai' : 
                                                             order.status === 'cancelled' ? 'Dibatalkan' : order.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm">
                                                    <div className="flex justify-between md:justify-start md:gap-8">
                                                        <span className="text-slate-500 w-20">User:</span>
                                                        <span className="font-mono font-medium text-slate-900">{order.username}</span>
                                                    </div>
                                                    <div className="flex justify-between md:justify-start md:gap-8">
                                                        <span className="text-slate-500 w-20">Pass:</span>
                                                        <span className="font-mono font-medium text-slate-900">••••••</span>
                                                    </div>
                                                    <div className="flex justify-between md:justify-start md:gap-8">
                                                        <span className="text-slate-500 w-20">Backup:</span>
                                                        <span className="font-mono font-medium text-slate-900">{order.backupCode || '-'}</span>
                                                    </div>
                                                    <div className="flex justify-between md:justify-start md:gap-8">
                                                        <span className="text-slate-500 w-20">WA:</span>
                                                        <span className="font-mono font-medium text-slate-900">{order.whatsapp ? order.whatsapp.slice(0, 4) + '****' + order.whatsapp.slice(-3) : '-'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <Package size={48} className="mx-auto text-slate-300 mb-4" />
                                    <h3 className="font-bold text-slate-900 mb-1">Tidak ada pesanan ditemukan</h3>
                                    <p className="text-slate-500 text-sm">Pastikan username yang kamu masukkan benar.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
