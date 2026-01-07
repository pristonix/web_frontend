'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, DollarSign, LogOut, Store, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';

const vendorLinks = [
    { href: '/vendor/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/vendor/catalog', label: 'Menu Management', icon: UtensilsCrossed },
    { href: '/vendor/orders', label: 'Active Orders', icon: ShoppingBag },
    { href: '/vendor/earnings', label: 'Financials', icon: DollarSign },
];

export default function VendorSidebar() {
    const pathname = usePathname();
    const [vendorName, setVendorName] = useState('Food Delivery');
    const [links, setLinks] = useState(vendorLinks);
    const [logoUrl, setLogoUrl] = useState('/logo.png');
    const [themeColor, setThemeColor] = useState('#f59e0b');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.business_name) setVendorName(user.business_name);
            if (user.logo_url) setLogoUrl(user.logo_url);
            if (user.theme_color) setThemeColor(user.theme_color);

            if (user.service_type === 'logistics') {
                setLinks([
                    { href: '/vendor/dashboard', label: 'Overview', icon: LayoutDashboard },
                    { href: '/vendor/catalog', label: 'Delivery Terms', icon: Truck },
                    { href: '/vendor/orders', label: 'Active Dispatches', icon: ShoppingBag },
                    { href: '/vendor/earnings', label: 'Financials', icon: DollarSign },
                ]);
            }
        }
    }, []);

    return (
        <div className="h-screen w-72 bg-white border-r border-slate-200 text-slate-900 flex flex-col p-6 sticky top-0">
            <div className="flex items-center gap-4 px-2 mb-10">
                <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center" style={{ boxShadow: `0 10px 15px -3px ${themeColor}33` }}>
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="overflow-hidden">
                    <h1 className="font-black text-lg leading-tight truncate text-slate-900 uppercase tracking-wider">{vendorName}</h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Partner Portal</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    return (
                        <Link key={link.href} href={link.href}>
                            <div className={`relative px-4 py-4 rounded-2xl flex items-center gap-3.5 transition-all duration-300 group ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeVendorTab"
                                        className="absolute inset-0 bg-white border border-slate-100 rounded-2xl shadow-sm"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <div
                                    className={`relative z-10 p-2 rounded-lg transition-colors`}
                                    style={isActive ? { backgroundColor: `${themeColor}26`, color: themeColor } : {}}
                                >
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className="relative z-10 font-bold text-[13px] uppercase tracking-wide">{link.label}</span>
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="ml-auto relative z-10 w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: themeColor }}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-slate-100">
                <Link href="/">
                    <div className="px-5 py-4 rounded-2xl flex items-center gap-3.5 text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 cursor-pointer group">
                        <div className="p-2 rounded-lg group-hover:bg-red-500/10 transition-colors">
                            <LogOut size={18} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-[13px] uppercase tracking-wide">Sign Out</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
