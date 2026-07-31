import { Outlet, ScrollRestoration, useLoaderData } from 'react-router';
import ParticleBackground from '@/components/public/ParticleBackground';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import SocialSidebar from '@/components/public/SocialSidebar';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  const { siteInfo } = useLoaderData();

  return (
    <div className={styles.container}>
      <a href="#main-content" className={styles.skipLink}>Skip to main content</a>
      <ParticleBackground />
      <ScrollRestoration getKey={(location) => location.pathname} />
      <Header />
      <main className={styles.main} id="main-content">
        <Outlet context={{ siteInfo }} />
      </main>
      <SocialSidebar siteInfo={siteInfo} />
      <Footer siteInfo={siteInfo} />
    </div>
  );
}