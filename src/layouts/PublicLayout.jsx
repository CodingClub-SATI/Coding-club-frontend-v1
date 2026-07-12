import { Outlet } from 'react-router-dom';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ParticleBackground from '@/components/shared/ParticleBackground';

export default function PublicLayout() {
    return (
        <>
        <ParticleBackground />
        <Header />
        <main><Outlet /></main>
        <Footer />
        </>
    );
}