'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetcher, patchData } from '@/lib/api';

const STATUS_COLUMNS = [
    { label: 'Pending', key: 'pending', next: 'preparing' },
    { label: 'Preparation', key: 'preparing', next: 'ready' },
    { label: 'Ready', key: 'ready', next: 'out_for_delivery' },
];

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadOrders();

        // Poll for new orders every 10 seconds
        const interval = setInterval(loadOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadOrders = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);

            const vendorId = user.vendor_id || user.id;
            const res = await fetcher(`/orders?vendorId=${vendorId}`);
            if (res.status === 'success') {
                setOrders(res.data);
            }
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNextStatus = async (orderId: string, nextStatus: string) => {
        try {
            // We'll need a backend route for this. Assuming PATCH /api/orders/:id exists or we can use a generic update.
            // For now, let's assume /api/orders/:id status update works.
            // Let's check routes/orders.ts first. (I'll add it if missing)
            await patchData(`/orders/${orderId}`, { status: nextStatus });
            loadOrders();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    if (!mounted) return null; // Prevent hydration mismatch

    const getOrdersByStatus = (status: string) => {
        return orders.filter(o => o.status === status);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Active Orders</h1>
                    <p className="text-slate-500 text-sm">Manage incoming and ongoing orders.</p>
                </div>
                <button
                    onClick={loadOrders}
                    className="text-xs bg-white hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200"
                >
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {STATUS_COLUMNS.map((col) => {
                    const colOrders = getOrdersByStatus(col.key);
                    return (
                        <div key={col.key} className="bg-slate-50 rounded-xl p-4 border border-slate-200 min-h-[500px]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-700">{col.label}</h3>
                                <span className="bg-slate-200 text-xs px-2 py-1 rounded-full text-slate-600">
                                    {colOrders.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {colOrders.length === 0 && !loading && (
                                    <p className="text-center text-slate-400 text-xs py-10 italic">No orders in {col.label.toLowerCase()}</p>
                                )}
                                {colOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white border border-slate-100 p-3 rounded-lg hover:border-amber-400 shadow-sm transition-colors"
                                    >
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xs font-mono text-amber-600">#{order.id.slice(0, 8)}</span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-medium text-slate-900 mb-1">
                                            {order.customer_name || 'Guest User'}
                                        </h4>
                                        <p className="text-xs text-slate-500 mb-2">
                                            Total: ₹{parseFloat(order.total_amount).toFixed(2)}
                                        </p>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleNextStatus(order.id, col.next)}
                                                className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded transition-colors"
                                            >
                                                Next &gt;
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
