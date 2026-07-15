import styles from './EmptyState.module.css';

export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="admin-empty-state">
      {Icon && <Icon size={28} />}
      <div className="admin-empty-title">{title}</div>
      {subtitle && <div className="admin-empty-subtitle">{subtitle}</div>}
    </div>
  );
}