import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const contentRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => { contentRef.current?.scrollTo(0, 0);}, [pathname]);

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <main className={styles.main}>
        <AdminTopbar />
        <div className={styles.contentWrapper} ref={contentRef}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}