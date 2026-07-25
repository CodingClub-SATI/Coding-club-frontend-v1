import { Modal } from '@/components/shared/Modal';
import { useUpdates } from '@/hooks/useUpdates';
import styles from './Updates.module.css';
import Spinner from '@/components/shared/Spinner';

export default function Updates({ onClose }) {
  const { updates, isLoading, error } = useUpdates();

  return (
    <Modal title="System Alerts" onClose={onClose} size="md" variant="glow">
      <div className={styles.container} aria-live="polite">
        
        {isLoading && (
          <div className={styles.statusBox}>
            <Spinner className={styles.spinnerAccent} />
            <p>Fetching alerts...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className={styles.statusBox}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && updates.length === 0 && (
          <div className={styles.statusBox}>
            <p>No new updates right now.</p>
          </div>
        )}

        {/* Data State */}
        {!isLoading && !error && updates.map((update) => (
          <div key={update.id} className={styles.item}>
            <span className={styles.date}>
              {new Date(update.publishDate).toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric', year: 'numeric' 
              }).toUpperCase()}
            </span>
            <p className={styles.text}>{update.message}</p>
          </div>
        ))}

      </div>
    </Modal>
  );
}