import { Outlet, ScrollRestoration, useLoaderData } from 'react-router';
import ParticleBackground from '@/components/public/ParticleBackground';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import SocialSidebar from '@/components/public/SocialSidebar';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  const { contactInfo } = useLoaderData();

  return (
    <div className={styles.container}>
      <a href="#main-content" className={styles.skipLink}>Skip to main content</a>
      <ParticleBackground />
      <ScrollRestoration />
      <Header />
      <main className={styles.main} id="main-content">
        <Outlet context={{ contactInfo }} />
      </main>
      <SocialSidebar contactInfo={contactInfo} />
      <Footer contactInfo={contactInfo} />
    </div>
  );
}