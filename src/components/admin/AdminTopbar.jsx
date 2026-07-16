import styles from './AdminTopbar.module.css';

export default function AdminTopbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.user}>
        <span className={styles.userLabel}>Logged in as</span>
        <strong>Super Admin</strong>
      </div>
    </header>
  );
}
