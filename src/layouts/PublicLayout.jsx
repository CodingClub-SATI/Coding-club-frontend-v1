import { Outlet } from 'react-router-dom';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

export default function PublicLayout() {
    return (
        <>
        <Header />
        <main><Outlet /></main>
        <Footer />
        </>
    );
}