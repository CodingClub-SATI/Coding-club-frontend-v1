import styles from './IconButton.module.css';

export default function IconButton({ children, className = '', type = 'button', ...props }) {
  return (
    <button type={type} className={`${styles.iconBtn} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}