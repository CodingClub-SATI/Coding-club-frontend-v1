import styles from './IconButton.module.css';

export default function IconButton({ children, className = '', type = 'button', ref, ...props }) {
  return (
    <button type={type} ref={ref} className={`${styles.iconBtn} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}