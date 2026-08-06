import { Link } from 'react-router';
import Button from '@/components/shared/Button';
import styles from './ErrorPages.module.css';

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.desc}>The page you're looking for doesn't exist or may have moved.</p>
      <Button Component={Link} to="/">Back to Home</Button>
    </div>
  );
}
