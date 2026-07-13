import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ParticleBackground from '@/components/public/ParticleBackground';

export default function PublicLayout() {
    return (
        <div>
            <ParticleBackground />
            <ScrollRestoration />
            <Header />
            <main style={{ paddingTop: 'var(--header-height, 80px)'}}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}