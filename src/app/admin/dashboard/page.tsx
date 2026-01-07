'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, DollarSign, Activity } from 'lucide-react';

const stats = [
    { label: 'Total Revenue', value: '$124,592', change: '+12.5%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Orders', value: '1,452', change: '+8.2%', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Vendors', value: '89', change: '+2.4%', icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Growth', value: '23%', change: '+4.1%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-500/10' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">Dashboard Overview</h1>
                <p className="text-slate-400 mt-2">Welcome back, here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-amber-500/30 transition-colors shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-slate-400">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg">Revenue Metrics</h3>
                        <select className="bg-slate-50 border-none text-sm rounded-lg px-3 py-1 outline-none text-slate-700">
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                className="w-full bg-amber-500/20 rounded-t-lg relative hover:bg-amber-500/30 transition-colors group"
                            >
                                <div className="absolute bottom-0 w-full bg-amber-500 rounded-t-lg" style={{ height: '30%' }}></div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500 px-2">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg">Recent Activity</h3>
                        <Activity size={18} className="text-slate-400" />
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-amber-500" />
                                <div>
                                    <p className="text-sm text-slate-800">New order #123{i} received</p>
                                    <p className="text-xs text-slate-500 mt-1">2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
