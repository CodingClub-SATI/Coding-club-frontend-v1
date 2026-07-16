import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {contentRef.current?.scrollTo(0, 0);}, [pathname]);

  return (
    <div className={styles.container}>
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />

      <main className={styles.main}>
        <AdminTopbar />
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
