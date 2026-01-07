'use client';

import { motion } from 'framer-motion';
import { UserCheck, Phone, MapPin, Truck } from 'lucide-react';

const mockPartners = [
    { id: 1, name: 'John Doe', status: 'Online', verified: true, currentOrder: null, location: 'Downtown' },
    { id: 2, name: 'Mike Ross', status: 'Busy', verified: true, currentOrder: '#ORD-123', location: 'Uptown' },
    { id: 3, name: 'Sarah Lee', status: 'Offline', verified: false, currentOrder: null, location: 'N/A' },
];

export default function PartnersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Delivery Partners</h1>
                    <p className="text-slate-400 text-sm">Manage fleet and assignments.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm text-slate-300">12 Online</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPartners.map((partner, i) => (
                    <motion.div
                        key={partner.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {partner.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        {partner.name}
                                        {partner.verified && <UserCheck size={14} className="text-blue-400" />}
                                    </h3>
                                    <p className="text-xs text-slate-500">ID: DP-{partner.id}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${partner.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400' :
                                    partner.status === 'Busy' ? 'bg-amber-500/10 text-amber-400' :
                                        'bg-slate-800 text-slate-500'
                                }`}>
                                {partner.status}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <Phone size={14} /> +1 (555) 000-00{partner.id}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} /> {partner.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck size={14} /> {partner.currentOrder ? `In delivery: ${partner.currentOrder}` : 'No active delivery'}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
                            <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-medium transition-colors">
                                View Profile
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
