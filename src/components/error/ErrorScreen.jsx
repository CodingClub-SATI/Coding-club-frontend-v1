import { Link, useRouteError } from 'react-router';
import Button from '@/components/shared/Button';
import styles from './ErrorPages.module.css';

export default function ErrorScreen() {
  const error = useRouteError();
  
  return (
    <div className={styles.wrap} role="alert">
      <p className={styles.code}>Oops!</p>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.desc}>
        {error?.statusText || error?.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <div style={ styles.cta }>
        <Button onClick={() => window.location.reload()} variant="filled" tone="primary">
          Reload Page
        </Button>
        <Button Component={Link} to="/" variant="outline">
          Back to Home
        </Button>
      </div>
    </div>
  );
}