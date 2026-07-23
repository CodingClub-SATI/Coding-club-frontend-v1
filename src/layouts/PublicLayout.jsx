import { Outlet, ScrollRestoration } from 'react-router';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import SocialSidebar from '@/components/public/SocialSidebar';
import ParticleBackground from '@/components/public/ParticleBackground';

export default function PublicLayout() {
  return (
    <div style={{ position: 'relative', zIndex: 'var(--z-base)', minHeight: '100vh' }}>
      <ParticleBackground />
      <ScrollRestoration />
      <Header />
      <main style={{ paddingTop: 'var(--header-height, 80px)'}}>
        <Outlet />
      </main>
      <SocialSidebar />
      <Footer />
    </div>
  );
}