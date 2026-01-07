'use client';

import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/api';


export default function VendorCatalogPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        image_url: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);
            const vendorId = user.vendor_id || user.id;
            const res = await fetcher(`/products?vendorId=${vendorId}`);
            if (res.status === 'success') {
                setProducts(res.data);
            }
        } catch (err) {
            console.error('Failed to load products:', err);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', category: '', description: '', image_url: '' });
        setShowModal(true);
    };

    const openEditModal = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            category: product.category,
            description: product.description || '',
            image_url: product.image_url || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);
            const vendorId = user.vendor_id || user.id;

            const payload = {
                vendor_id: vendorId,
                name: formData.name,
                price: parseFloat(formData.price),
                category: formData.category,
                description: formData.description,
                image_url: formData.image_url
            };

            let res;
            if (editingProduct) {
                // Update existing product
                res = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create new product
                res = await fetch('http://localhost:5000/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            const result = await res.json();

            if (result.status === 'success') {
                setShowModal(false);
                setFormData({ name: '', price: '', category: '', description: '', image_url: '' });
                setEditingProduct(null);
                loadProducts();
            } else {
                alert(`Failed to ${editingProduct ? 'update' : 'add'} product`);
            }
        } catch (err) {
            console.error(err);
            alert(`Error ${editingProduct ? 'updating' : 'adding'} product`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (result.status === 'success') {
                loadProducts();
            } else {
                alert('Failed to delete product');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting product');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Product Catalog</h1>
                    <p className="text-slate-400 text-sm">Manage your menu and inventory.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus size={18} /> Add Item
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading && <p className="text-slate-500 col-span-3 text-center py-10">Loading catalog...</p>}
                {!loading && products.length === 0 && (
                    <div className="col-span-3 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500 mb-2">No items found.</p>
                        <button
                            onClick={openAddModal}
                            className="text-amber-400 text-sm hover:underline"
                        >
                            Add your first item
                        </button>
                    </div>
                )}
                {products.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white border border-slate-100 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-colors"
                    >
                        <div className="h-32 bg-slate-100 relative overflow-hidden">
                            {item.image_url ? (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling!.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <div className={`absolute inset-0 flex items-center justify-center text-slate-600 font-medium text-4xl ${item.image_url ? 'hidden' : ''}`}>
                                {item.name[0]}
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-900">{item.name}</h3>
                                <span className="text-amber-400 font-bold">₹{parseFloat(item.price).toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-4">{item.category} • {item.description && item.description.slice(0, 30)}...</p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Edit size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(item.id)}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add/Edit Product Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => {
                            setShowModal(false);
                            setEditingProduct(null);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white border border-slate-100 rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {editingProduct ? 'Edit Item' : 'Add New Item'}
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1">
                                        {editingProduct ? 'Update menu item details' : 'Create a new menu item'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingProduct(null);
                                    }}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-slate-700 text-sm font-medium mb-2 block">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none transition-colors"
                                        placeholder="e.g. Margherita Pizza"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-slate-700 text-sm font-medium mb-2 block">Price (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none transition-colors"
                                            placeholder="12.99"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-slate-700 text-sm font-medium mb-2 block">Category</label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none transition-colors"
                                        >
                                            <option value="">Select</option>
                                            <option value="Pizza">Pizza</option>
                                            <option value="Burgers">Burgers</option>
                                            <option value="Tacos">Tacos</option>
                                            <option value="Pasta">Pasta</option>
                                            <option value="Salads">Salads</option>
                                            <option value="Drinks">Drinks</option>
                                            <option value="Desserts">Desserts</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-slate-700 text-sm font-medium mb-2 block flex items-center gap-2">
                                        <ImageIcon size={16} />
                                        Image URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none transition-colors"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Paste a link to your product image</p>
                                </div>

                                <div>
                                    <label className="text-slate-700 text-sm font-medium mb-2 block">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                                        placeholder="Describe your dish..."
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingProduct(null);
                                        }}
                                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 rounded-xl font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Item' : 'Add Item')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
