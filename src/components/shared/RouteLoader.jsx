import styles from './RouteLoader.module.css';

export default function RouteLoader({
  message = 'Loading...',
  className = '',
}) {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner} />
      <p>{message}</p>
    </div>
  );
}