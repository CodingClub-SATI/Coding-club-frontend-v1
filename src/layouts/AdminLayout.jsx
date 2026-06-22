import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from '@/components/admin/AdminHeader';
import Sidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout() {
    return (
        <div>
            <ScrollRestoration />
            <Header />
            <Sidebar />
            <main><Outlet /></main>
        </div>
    );
}