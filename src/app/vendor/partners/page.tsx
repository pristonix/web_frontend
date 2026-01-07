'use client';

import { Truck, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function DeliveryPartnersPage() {
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPartners();
        const interval = setInterval(loadPartners, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const loadPartners = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/partners');
            const result = await res.json();
            if (result.status === 'success') {
                setPartners(result.data);
            }
        } catch (err) {
            console.error('Failed to load partners:', err);
        } finally {
            setLoading(false);
        }
    };

    const onlineCount = partners.filter(p => p.status === 'Online').length;
    const busyCount = partners.filter(p => p.status === 'Busy').length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Delivery Partners</h1>
                <p className="text-slate-400 text-sm">Monitor your delivery fleet</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Circle size={16} className="text-emerald-500 fill-emerald-500" />
                        </div>
                        <span className="text-slate-400 text-sm">Online</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{onlineCount}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <Circle size={16} className="text-amber-500 fill-amber-500" />
                        </div>
                        <span className="text-slate-400 text-sm">Busy</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{busyCount}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Truck size={16} className="text-purple-500" />
                        </div>
                        <span className="text-slate-400 text-sm">Total Fleet</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{partners.length}</p>
                </div>
            </div>

            {/* Partners List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="font-bold text-white text-lg">Active Partners</h2>
                    <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE UPDATING
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-slate-500 text-xs font-bold border-b border-slate-800">
                                <th className="text-left p-4">STATUS</th>
                                <th className="text-left p-4">PARTNER NAME</th>
                                <th className="text-left p-4">CONTACT</th>
                                <th className="text-left p-4">CURRENT ORDER</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center text-slate-500">
                                        <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                                        Loading partners...
                                    </td>
                                </tr>
                            ) : partners.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center text-slate-500">
                                        No delivery partners registered
                                    </td>
                                </tr>
                            ) : (
                                partners.map((partner) => (
                                    <motion.tr
                                        key={partner.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Circle
                                                    size={10}
                                                    className={`${partner.status === 'Online'
                                                        ? 'text-emerald-500 fill-emerald-500'
                                                        : partner.status === 'Busy'
                                                            ? 'text-amber-500 fill-amber-500'
                                                            : 'text-slate-600 fill-slate-600'
                                                        }`}
                                                />
                                                <span
                                                    className={`text-xs font-bold ${partner.status === 'Online'
                                                        ? 'text-emerald-400'
                                                        : partner.status === 'Busy'
                                                            ? 'text-amber-400'
                                                            : 'text-slate-500'
                                                        }`}
                                                >
                                                    {partner.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-white font-semibold">{partner.name}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-slate-400 text-sm">{partner.phone || 'N/A'}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-slate-400 text-sm">
                                                {partner.currentOrder || '—'}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                        <Truck size={24} className="text-purple-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-2">Automatic Assignment</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            When an order is marked as "Ready", the system automatically assigns it to the nearest available online partner.
                            Partners marked as "Busy" or "Offline" won't receive new assignments.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
