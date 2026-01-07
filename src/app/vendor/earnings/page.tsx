'use client';

import { TrendingUp, DollarSign, Calendar, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function VendorEarningsPage() {
    const [earnings, setEarnings] = useState({
        total: '0.00',
        thisWeek: '0.00',
        pending: '0.00',
        thisMonth: '0.00'
    });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEarningsData();
        const interval = setInterval(loadEarningsData, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadEarningsData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);
            const vendorId = user.vendor_id;

            if (vendorId) {
                // Fetch completed orders for this vendor
                const ordersRes = await fetch(`http://localhost:5000/api/orders?vendorId=${vendorId}`);
                const ordersData = await ordersRes.json();

                if (ordersData.status === 'success') {
                    const completedOrders = ordersData.data.filter((o: any) => o.status === 'delivered');

                    // Calculate total earnings
                    const total = completedOrders.reduce((sum: number, order: any) =>
                        sum + parseFloat(order.total_amount), 0
                    );

                    // Calculate this week's earnings
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    const thisWeek = completedOrders
                        .filter((o: any) => new Date(o.created_at) >= oneWeekAgo)
                        .reduce((sum: number, order: any) => sum + parseFloat(order.total_amount), 0);

                    // Calculate this month's earnings
                    const startOfMonth = new Date();
                    startOfMonth.setDate(1);
                    const thisMonth = completedOrders
                        .filter((o: any) => new Date(o.created_at) >= startOfMonth)
                        .reduce((sum: number, order: any) => sum + parseFloat(order.total_amount), 0);

                    setEarnings({
                        total: total.toFixed(2),
                        thisWeek: thisWeek.toFixed(2),
                        pending: '0.00', // Can be calculated based on business logic
                        thisMonth: thisMonth.toFixed(2)
                    });

                    // Set recent transactions (last 10 completed orders)
                    const recentTransactions = completedOrders
                        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .slice(0, 10)
                        .map((order: any) => ({
                            id: order.id,
                            date: new Date(order.created_at).toLocaleDateString(),
                            description: `Order #${order.id.slice(0, 8)} - ${order.customer_name || 'Customer'}`,
                            amount: parseFloat(order.total_amount),
                            status: 'Completed'
                        }));

                    setTransactions(recentTransactions);
                }
            }
        } catch (e) {
            console.error('Failed to load earnings:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Financials</h1>
                <p className="text-slate-500 text-sm">Track your revenue and earnings</p>
            </div>

            {/* Total Earnings Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-emerald-100 text-sm mb-2">Total Earnings (All Time)</p>
                        <h2 className="text-4xl font-bold mb-1">₹{earnings.total}</h2>
                        <p className="text-sm opacity-80 flex items-center gap-1">
                            + ₹{earnings.thisWeek} this week <TrendingUp size={14} />
                        </p>
                    </div>
                    <div className="p-4 bg-white/20 rounded-2xl">
                        <DollarSign size={32} />
                    </div>
                </div>
                <div className="flex gap-4 mt-6">
                    <div className="flex-1 bg-white/10 rounded-xl p-4">
                        <p className="text-xs opacity-80 mb-1">Pending Payout</p>
                        <p className="font-bold">₹{earnings.pending}</p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-xl p-4">
                        <p className="text-xs opacity-80 mb-1">This Month</p>
                        <p className="font-bold">₹{earnings.thisMonth}</p>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-slate-900 text-lg">Recent Transactions</h2>
                        <button className="text-amber-600 hover:text-amber-500 text-sm font-medium flex items-center gap-2 transition-colors">
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-slate-500 text-xs border-b border-slate-100 bg-slate-50/50">
                                <th className="text-left px-6 py-4 font-bold">DATE</th>
                                <th className="text-left px-6 py-4 font-bold">DESCRIPTION</th>
                                <th className="text-left px-6 py-4 font-bold">AMOUNT</th>
                                <th className="text-left px-6 py-4 font-bold">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                    <td className="px-6 py-4 text-slate-400 text-sm">—</td>
                                    <td className="px-6 py-4 text-white">No transactions yet</td>
                                    <td className="px-6 py-4 text-slate-400">₹0.00</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-800 text-slate-500 rounded-full text-xs">—</span>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500 text-sm">{tx.date}</td>
                                        <td className="px-6 py-4 text-slate-900 font-semibold">{tx.description}</td>
                                        <td className="px-6 py-4 text-emerald-600 font-semibold">+₹{tx.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs border border-emerald-500/20 font-bold">
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {transactions.length === 0 && !loading && (
                    <div className="p-6 bg-slate-900/50 text-center">
                        <p className="text-slate-500 text-sm">Complete deliveries to see earnings</p>
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                        <Calendar size={24} className="text-amber-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-2">Payout Schedule</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Earnings are calculated based on completed orders. Payouts are processed weekly, and you'll receive your earnings every Monday for the previous week's deliveries.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
