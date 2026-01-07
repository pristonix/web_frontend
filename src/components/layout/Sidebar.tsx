'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingBag, Truck, Settings, LogOut, Package, Menu, X } from 'lucide-react';
import { useState } from 'react';

const adminLinks = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/vendors', label: 'Vendors', icon: Users },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/partners', label: 'Delivery Partners', icon: Truck },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-xl"
            >
                <Menu size={20} />
            </button>

            {/* Backdrop for Mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Shell */}
            <div className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-white border-r border-slate-200 text-slate-900 flex flex-col p-4 transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between lg:justify-start gap-3 px-2 mb-8 mt-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none tracking-tight">GourmetFlow</h1>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1 block">Super Admin</span>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-slate-900">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1">
                    {adminLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;

                        return (
                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                                <div className={`relative px-4 py-3 rounded-xl flex items-center gap-3 transition-all group ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-amber-50 border border-amber-200 rounded-xl"
                                        />
                                    )}
                                    <Icon size={20} className={isActive ? 'text-amber-600' : 'group-hover:text-amber-600'} />
                                    <span className="relative z-10 font-medium text-sm">{link.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-4 border-t border-slate-100">
                    <Link href="/">
                        <div className="px-4 py-3 rounded-xl flex items-center gap-3 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                            <LogOut size={20} />
                            <span className="font-medium text-sm uppercase tracking-wider">Sign Out</span>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}
