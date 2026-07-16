import styles from './IconButton.module.css';

export default function IconButton({ children, className = '', ...props }) {
  return (
    <button className={`${styles.iconBtn} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
