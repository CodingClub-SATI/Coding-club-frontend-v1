import styles from './AdminTitle.module.css';

export default function AdminTitle({ title, subtitle, children }) {
  return (
    <div className={styles.title}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
