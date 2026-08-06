import styles from './Spinner.module.css';

export default function Spinner({ className = '', ...props }) {
  return (
    <span
      className={`${styles.spinner} ${className}`.trim()}
      aria-hidden="true"
      {...props}
    />
  );
}