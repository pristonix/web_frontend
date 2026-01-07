'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Clock, Truck, DollarSign } from 'lucide-react';
import { fetcher } from '@/lib/api';

interface Order {
    id: string;
    vendor_id: string;
    customer_id: string;
    total_amount: string;
    status: string;
    created_at: string;
    customer_name?: string;
    vendor_name?: string;
}

export default function GlobalOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        revenue: '0.00'
    });

    useEffect(() => {
        loadOrders();
        const interval = setInterval(loadOrders, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const loadOrders = async () => {
        try {
            const res = await fetcher('/orders');
            if (res.status === 'success') {
                const ordersData = res.data || [];
                setOrders(ordersData);

                // Calculate stats
                const completed = ordersData.filter((o: Order) => o.status === 'delivered').length;
                const pending = ordersData.filter((o: Order) =>
                    ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
                ).length;
                const revenue = ordersData
                    .filter((o: Order) => o.status === 'delivered')
                    .reduce((sum: number, o: Order) => sum + parseFloat(o.total_amount), 0);

                setStats({
                    total: ordersData.length,
                    pending,
                    completed,
                    revenue: revenue.toFixed(2)
                });
            }
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'out_for_delivery':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'ready':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'preparing':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        if (status === 'out_for_delivery') return <Truck size={24} />;
        return <Package size={24} />;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Global Orders</h1>
                <p className="text-slate-400 text-sm">Real-time view of all activity across the platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Package size={20} className="text-purple-400" />
                        <span className="text-slate-400 text-sm">Total Orders</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock size={20} className="text-amber-400" />
                        <span className="text-slate-400 text-sm">Pending</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.pending}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Truck size={20} className="text-emerald-400" />
                        <span className="text-slate-400 text-sm">Completed</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.completed}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign size={20} className="text-blue-400" />
                        <span className="text-slate-400 text-sm">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-white">₹{stats.revenue}</p>
                </div>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="text-center py-10 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-xl">
                    <Package size={48} className="mx-auto text-slate-700 mb-4" />
                    <p className="text-slate-500">No orders yet</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order, i) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">
                                        Order #{order.id.slice(0, 8)}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {order.customer_name || 'Customer'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(order.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-white">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                                <span className={`text-xs px-2.5 py-1 rounded-full border font-bold uppercase ${getStatusColor(order.status)}`}>
                                    {order.status.replace('_', ' ')}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
