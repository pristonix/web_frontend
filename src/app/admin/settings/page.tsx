'use client';

import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
                <p className="text-slate-400 text-sm">Configure global application parameters.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">General Configuration</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Platform Name</label>
                        <input type="text" defaultValue="Pristonix" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Support Email</label>
                        <input type="email" defaultValue="support@pristonix.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-400">Algorithm Mode</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500">
                        <option>Balanced (Cost vs Time)</option>
                        <option>Speed First</option>
                        <option>Cost Saver</option>
                    </select>
                    <p className="text-xs text-slate-500">Determines how delivery partners are assigned to orders.</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Commission & Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Platform Fee (%)</label>
                        <input type="number" defaultValue="15" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Delivery Base Fee ($)</label>
                        <input type="number" defaultValue="2.50" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors">
                    <Save size={18} /> Save Changes
                </button>
            </div>
        </div>
    );
}
