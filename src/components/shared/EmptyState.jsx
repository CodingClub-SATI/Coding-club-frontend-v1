import styles from './EmptyState.module.css';

export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
      <div className={styles.emptyState}>
        {Icon && <Icon size={28} />}
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
    );
}