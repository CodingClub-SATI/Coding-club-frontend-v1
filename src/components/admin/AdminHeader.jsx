import styles from './AdminHeader.module.css';

export default function AdminHeader() {
  return (
    <header className={styles.topbar}>
      <div className={styles.user}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Logged in as</span>
        <strong>Super Admin</strong>
      </div>
    </header>
  );
}
