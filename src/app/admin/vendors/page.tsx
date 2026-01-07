'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, MoreVertical, Plus, Store, Star, ChefHat, CheckCircle2, Trash2, X, Truck, UtensilsCrossed } from 'lucide-react';
import { fetcher, patchData, postData } from '@/lib/api';

interface Vendor {
    id: string;
    business_name: string;
    cuisine_type?: string;
    logo_url?: string;
    status: 'pending' | 'active' | 'suspended' | 'rejected';
    rating: string | null;
    description?: string;
    user_id: string;
    service_type?: string;
}

export default function VendorsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        pending: 0,
        avgRating: '0.0'
    });

    // Add Vendor Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        password: '',
        businessName: '',
        serviceType: 'food',
        logoUrl: '',
        themeColor: '#f59e0b'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadVendors();
        const interval = setInterval(loadVendors, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadVendors = async () => {
        try {
            const res = await fetcher('/vendors');
            if (res.status === 'success') {
                const vendorsData = res.data || [];
                setVendors(vendorsData);

                // Calculate stats
                const active = vendorsData.filter((v: Vendor) => v.status === 'active').length;
                const pending = vendorsData.filter((v: Vendor) => v.status === 'pending').length;
                const ratings = vendorsData
                    .filter((v: Vendor) => v.rating != null)
                    .map((v: Vendor) => parseFloat(v.rating || '0'));
                const avgRating = ratings.length > 0
                    ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
                    : '0.0';

                setStats({
                    total: vendorsData.length,
                    active,
                    pending,
                    avgRating
                });
            }
        } catch (err) {
            console.error('Failed to load vendors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm('Approve this vendor?')) return;
        try {
            await patchData(`/vendors/${id}/status`, { status: 'active' });
            loadVendors(); // Refresh list
        } catch (err) {
            console.error('Failed to approve vendor:', err);
            alert('Failed to approve vendor');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;
        try {
            // Direct fetch since we didn't add deleteData to api lib yet
            const res = await fetch(`http://localhost:5000/api/vendors/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.status === 'success') {
                loadVendors();
            } else {
                alert('Failed to delete vendor');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting vendor');
        }
    };

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Create User & Vendor via Signup Endpoint
            await postData('/auth/signup', {
                fullName: formData.fullName,
                phone: formData.phone,
                password: formData.password,
                businessName: formData.businessName,
                role: 'vendor',
                serviceType: formData.serviceType,
                logoUrl: formData.logoUrl,
                themeColor: formData.themeColor
            });
            setIsModalOpen(false);
            setFormData({ fullName: '', phone: '', password: '', businessName: '', serviceType: 'food', logoUrl: '', themeColor: '#f59e0b' });
            loadVendors();
            alert('Vendor added successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to add vendor. Phone number may be in use.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredVendors = vendors.filter(v =>
        v.business_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendor Management</h1>
                    <p className="text-slate-500 text-sm">Oversee registered vendors and approval requests.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-colors shadow-lg shadow-amber-500/20"
                >
                    <Plus size={18} /> Add Vendor
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Store size={20} className="text-amber-500" />
                        <span className="text-slate-500 text-sm font-medium">Total Vendors</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{stats.total}</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-500 text-sm font-medium">Active</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{stats.active}</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-slate-500 text-sm font-medium">Pending</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{stats.pending}</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Star size={20} className="text-amber-400 fill-amber-400" />
                        <span className="text-slate-500 text-sm font-medium">Avg Rating</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{stats.avgRating} ⭐</p>
                </div>
            </div>

            {/* Vendors Table */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-500 font-medium">Loading vendors...</p>
                    </div>
                ) : filteredVendors.length === 0 ? (
                    <div className="p-20 text-center">
                        <Store size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">No vendors found</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Vendor Name</th>
                                <th className="px-6 py-4">Service Type</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredVendors.map((vendor, i) => (
                                <motion.tr
                                    key={vendor.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                                {vendor.logo_url ? (
                                                    <img src={vendor.logo_url} alt={vendor.business_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ChefHat size={20} className="text-slate-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{vendor.business_name}</p>
                                                {vendor.description && (
                                                    <p className="text-xs text-slate-500">{vendor.description.slice(0, 30)}...</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {vendor.service_type === 'logistics' ? <Truck size={14} /> : <UtensilsCrossed size={14} />}
                                            <span className="capitalize text-slate-700 font-medium">
                                                {vendor.service_type || 'Food'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Star size={14} className="text-amber-400 fill-amber-400" />
                                            <span className="text-slate-900 font-bold">
                                                {vendor.rating ? parseFloat(vendor.rating).toFixed(1) : 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 text-xs font-bold w-fit px-2 py-1 rounded-full ${vendor.status === 'active'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : vendor.status === 'pending'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${vendor.status === 'active' ? 'bg-emerald-500' : vendor.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                                                }`} />
                                            {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {vendor.status === 'pending' && (
                                                <button
                                                    onClick={() => handleApprove(vendor.id)}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                                                >
                                                    <CheckCircle2 size={12} /> Approve
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(vendor.id, vendor.business_name)}
                                                className="bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 p-2 rounded-lg transition-colors border border-slate-200"
                                                title="Delete Vendor"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Vendor Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Add New Vendor</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name (Owner)</label>
                                    <input
                                        name="fullName"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleDataChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Business Name</label>
                                    <input
                                        name="businessName"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        placeholder="Fast Track Logistics"
                                        value={formData.businessName}
                                        onChange={handleDataChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone (Login)</label>
                                        <input
                                            name="phone"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                            placeholder="9876543210"
                                            value={formData.phone}
                                            onChange={handleDataChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                            placeholder="******"
                                            value={formData.password}
                                            onChange={handleDataChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Logo URL</label>
                                        <input
                                            name="logoUrl"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                            placeholder="https://..."
                                            value={formData.logoUrl}
                                            onChange={handleDataChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Brand Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                name="themeColor"
                                                type="color"
                                                className="w-12 h-12 p-1 rounded-xl cursor-pointer border border-slate-200"
                                                value={formData.themeColor}
                                                onChange={handleDataChange}
                                            />
                                            <span className="text-sm font-medium text-slate-500">{formData.themeColor}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, serviceType: 'food' })}
                                            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.serviceType === 'food'
                                                ? 'bg-amber-500/10 border-amber-500/50 text-amber-700 font-bold'
                                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            <UtensilsCrossed size={16} /> Food
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, serviceType: 'logistics' })}
                                            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.serviceType === 'logistics'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-700 font-bold'
                                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            <Truck size={16} /> Logistics
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-4 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                                >
                                    {submitting ? 'Adding...' : 'Create Vendor Account'}
                                </button>

                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
