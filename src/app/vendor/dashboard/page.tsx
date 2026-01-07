'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ShoppingBag, Star, Package, Clock, TrendingUp, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function VendorDashboard() {
    const [stats, setStats] = useState({
        todayEarnings: '0.00',
        ordersToFulfill: 0,
        rating: '4.5',
        activeProducts: 0
    });
    const [activeOrders, setActiveOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isLiveUpdating, setIsLiveUpdating] = useState(true);
    const [serviceType, setServiceType] = useState('food');
    const [packages, setPackages] = useState<any[]>([]);
    const [activePackages, setActivePackages] = useState<any[]>([]);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            const vendorId = user.vendor_id;
            const sType = user.service_type || 'food';
            setServiceType(sType);

            if (vendorId) {
                if (sType === 'logistics') {
                    fetchPackages();
                    fetchActivePackages();
                } else {
                    fetchStats(vendorId);
                    fetchOrders(vendorId);
                }

                const interval = setInterval(() => {
                    if (sType === 'logistics') {
                        fetchPackages();
                        fetchActivePackages();
                    } else {
                        fetchStats(vendorId);
                        fetchOrders(vendorId);
                    }
                    setLastUpdate(new Date());
                }, 5000);

                return () => clearInterval(interval);
            }
        }
        // Set initial date on client only
        setLastUpdate(new Date());
    }, []);

    const fetchStats = async (vendorId: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/vendor/${vendorId}/stats`);
            const result = await res.json();
            if (result.status === 'success') {
                setStats(result.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchPackages = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/packages/available');
            const result = await res.json();
            if (result.status === 'success') {
                setPackages(result.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivePackages = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/packages/all_active');
            const result = await res.json();
            if (result.status === 'success') {
                setActivePackages(result.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchOrders = async (vendorId: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/orders?vendorId=${vendorId}`);
            const result = await res.json();
            if (result.status === 'success') {
                // Show latest 5 active orders
                const relevant = result.data
                    .filter((o: any) => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status))
                    .slice(0, 5);
                setActiveOrders(relevant);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (serviceType === 'logistics') {
        return (
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Logistics Hub</h1>
                            <p className="text-slate-400 mt-2">Package Dispatch & Monitoring</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Last updated: {lastUpdate?.toLocaleTimeString() || 'Connecting...'}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xl group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500"><Package size={24} /></div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-1">{packages.length}</h3>
                                <p className="text-sm text-slate-500">Pending Packages</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xl group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500"><TrendingUp size={24} /></div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-1">{activePackages.length}</h3>
                                <p className="text-sm text-slate-500">Active Fleets</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Tracking Table */}
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Live Delivery Tracking</h2>
                        <span className="text-xs bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full font-bold animate-pulse">LIVE</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr className="text-slate-500 text-xs font-bold uppercase">
                                    <th className="text-left px-6 py-4">ID</th>
                                    <th className="text-left px-6 py-4">Partner</th>
                                    <th className="text-left px-6 py-4">Route</th>
                                    <th className="text-left px-6 py-4">Status</th>
                                    <th className="text-left px-6 py-4">ETA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activePackages.map((pkg) => (
                                    <tr key={pkg.id} className="border-b border-slate-100/50 hover:bg-slate-50/50">
                                        <td className="px-6 py-5 font-mono text-xs text-slate-500">#{pkg.id.slice(0, 6)}</td>
                                        <td className="px-6 py-5 font-bold text-slate-800">{pkg.partner_name || 'Unassigned'}</td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-400">FROM</span> {pkg.pickup_location.split(',')[0]}
                                                <span className="text-slate-300">→</span>
                                                <span className="text-xs text-slate-400">TO</span> {pkg.dropoff_location.split(',')[0]}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${pkg.status === 'in_transit' ? 'bg-blue-500/10 text-blue-600' :
                                                    pkg.status === 'picked_up' ? 'bg-amber-500/10 text-amber-600' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {pkg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-mono text-slate-500">--</td>
                                    </tr>
                                ))}
                                {activePackages.length === 0 && (
                                    <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-sm">No active deliveries tracking</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900">Available Packages</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr className="text-slate-500 text-xs font-bold uppercase">
                                    <th className="text-left px-6 py-4">Pickup</th>
                                    <th className="text-left px-6 py-4">Dropoff</th>
                                    <th className="text-left px-6 py-4">Details</th>
                                    <th className="text-left px-6 py-4">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {packages.map((pkg) => (
                                    <tr key={pkg.id} className="border-b border-slate-100/50 hover:bg-slate-50/50">
                                        <td className="px-6 py-5 font-semibold text-slate-800">{pkg.pickup_location}</td>
                                        <td className="px-6 py-5 text-slate-600">{pkg.dropoff_location}</td>
                                        <td className="px-6 py-5 text-slate-500 text-sm">{pkg.package_details}</td>
                                        <td className="px-6 py-5 font-bold text-emerald-600">₹{pkg.price}</td>
                                    </tr>
                                ))}
                                {packages.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-10 text-slate-500">No packages available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        { label: 'Today\'s Earnings', value: `₹${stats.todayEarnings}`, icon: DollarSign, bg: 'bg-emerald-500/10', color: 'text-emerald-500', trend: '+12%' },
        { label: 'Orders to Fulfill', value: stats.ordersToFulfill, icon: ShoppingBag, bg: 'bg-blue-500/10', color: 'text-blue-500', trend: stats.ordersToFulfill > 0 ? 'Active' : 'Idle' },
        { label: 'Store Rating', value: stats.rating, icon: Star, bg: 'bg-amber-500/10', color: 'text-amber-500', trend: '⭐' },
        { label: 'Active Products', value: stats.activeProducts, icon: Package, bg: 'bg-purple-500/10', color: 'text-purple-500', trend: 'Live' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'preparing': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">Store Dashboard</h1>
                        <p className="text-slate-400 mt-2">Real-time performance metrics</p>
                    </div>

                    {/* Live Update Indicator */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full border border-emerald-500/20"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold">LIVE UPDATING</span>
                    </motion.div>
                </div>
                <p className="text-xs text-slate-500 mt-1">Last updated: {lastUpdate?.toLocaleTimeString() || 'Connecting...'}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all shadow-xl shadow-amber-500/10 group relative overflow-hidden"
                    >
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className={stat.color} size={24} />
                                </div>
                                <span className="text-xs text-slate-500 font-medium">{stat.trend}</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-1">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={stat.value}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {stat.value}
                                    </motion.span>
                                </AnimatePresence>
                            </h3>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Active Queue with Live Updates */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50"
            >
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            Active Queue
                            {activeOrders.length > 0 && (
                                <span className="flex items-center gap-2 text-xs bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full border border-amber-500/20">
                                    <Circle size={8} className="fill-amber-400" />
                                    {activeOrders.length} Active
                                </span>
                            )}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Pending and current preparations</p>
                    </div>
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE UPDATING
                    </motion.div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr className="text-slate-500 text-xs font-bold uppercase">
                                <th className="text-left px-6 py-4">ORDER ID</th>
                                <th className="text-left px-6 py-4">CUSTOMER</th>
                                <th className="text-left px-6 py-4">TOTAL</th>
                                <th className="text-left px-6 py-4">STATUS</th>
                                <th className="text-left px-6 py-4">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20">
                                        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
                                        <p className="text-slate-500">Loading orders...</p>
                                    </td>
                                </tr>
                            ) : activeOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20">
                                        <ShoppingBag size={48} className="mx-auto text-slate-700 mb-4" />
                                        <p className="text-slate-500">No active orders in the queue.</p>
                                        <p className="text-slate-600 text-xs mt-2">New orders will appear here in real-time</p>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {activeOrders.map((order, i) => (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-mono text-amber-600">#{order.id.slice(0, 8)}</p>
                                            </td>
                                            <td className="py-5">
                                                <p className="text-sm font-semibold text-slate-800">{order.customer_name || 'Guest User'}</p>
                                            </td>
                                            <td className="py-5 text-slate-700 font-bold">₹{parseFloat(order.total_amount).toFixed(2)}</td>
                                            <td className="py-5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-5">
                                                <button className="text-amber-600 hover:text-amber-500 text-xs font-medium transition-colors">
                                                    View Details →
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
