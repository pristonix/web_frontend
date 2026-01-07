'use client';
import { usePathname } from 'next/navigation';
import VendorSidebar from '@/components/layout/VendorSidebar';

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Hide sidebar on register page
    if (pathname?.startsWith('/vendor/register')) {
        return <>{children}</>;
    }

    return (
        <div className="flex bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-amber-500/30">
            <VendorSidebar />
            <main className="flex-1 overflow-y-auto w-full h-full relative">
                <div className="max-w-7xl mx-auto p-8 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
