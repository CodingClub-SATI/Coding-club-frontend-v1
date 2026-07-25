import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, Calendar, Image as ImageIcon, Users,
  FolderGit2, BookOpen, Inbox, Settings, LogOut,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import IconButton from '@/components/shared/IconButton';
import styles from './AdminSidebar.module.css';

const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  { label: 'Team', path: '/admin/teams', icon: Users },
  { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
  { label: 'Learning', path: '/admin/learning', icon: BookOpen },
  { label: 'Inbox', path: '/admin/inbox', icon: Inbox },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  return (
    <aside className={`${styles.sidebar} ${open ? '' : styles.closed}`}>
      <div className={styles.header}>
        <div className={styles.logoText}>
          Club <span className="neon-blue">Admin</span>
        </div>
        <IconButton onClick={() => setOpen((o) => !o)} aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}>
          {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </IconButton>
      </div>

      <nav className={styles.nav}>
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={open ? undefined : item.label}
              className={`${styles.link} ${isActive ? styles.active : ''}`}
            >
              <Icon size={18} />
              <span className={styles.linkText}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <Link to="/admin/settings" title={open ? undefined : 'Settings'} className={styles.link}>
          <Settings size={18} />
          <span className={styles.linkText}>Settings</span>
        </Link>
        <button
          className={`${styles.link} ${styles.textRed} ${styles.logoutBtn}`.trim()}
          onClick={handleLogout}
          title={open ? undefined : 'Logout'}
        >
          <LogOut size={18} />
          <span className={styles.linkText}>Logout</span>
        </button>
      </div>
    </aside>
  );
}