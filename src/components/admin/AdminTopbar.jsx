import { getUsername } from '@/services/authToken';
import styles from './AdminTopbar.module.css';

export default function AdminTopbar() {
  const username = getUsername() || 'Admin';

  return (
    <header className={styles.topbar}>
      <div className={styles.user}>
        <span className={styles.userLabel}>Logged in as</span>
        <strong>{username}</strong>
      </div>
    </header>
  );
}
