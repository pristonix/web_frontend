import AdminSidebar from '@/components/layout/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-amber-500/30">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto w-full h-full relative">
                <div className="max-w-7xl mx-auto p-8 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
