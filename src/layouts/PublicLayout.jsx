import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ParticleBackground from '@/components/public/ParticleBackground';

export default function PublicLayout() {
    return (
        <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <ParticleBackground />
            <ScrollRestoration />
            <Header />
            <main><Outlet /></main>
            <Footer />
        </div>
    );
}