import { Link, useRouteError } from 'react-router';
import Button from '@/components/shared/Button';
import styles from './ErrorPages.module.css';

export default function ErrorScreen() {
  const error = useRouteError();

  return (
    <div className={styles.wrap} role="alert">
      <p className={styles.code}>⚠</p>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.desc}>
        {error?.statusText || error?.message || 'An unexpected error occurred.'}
      </p>
      <Button Component={Link} to="/">Back to Home</Button>
    </div>
  );
}
