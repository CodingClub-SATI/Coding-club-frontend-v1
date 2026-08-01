import { ConfirmButton } from '@/components/shared/ConfirmButton';
import styles from './PhotoTile.module.css';

export default function PhotoTile({ src, alt = '', isFeatured, isDeleting = false, onEdit, onDelete }) {
  return (
    <div className={styles.tile}>
      <img src={src} alt={alt} />

      {isFeatured && (
        <span className={styles.featuredStar}>★</span>
      )}

      <div className={styles.actions}>
        <button type="button" onClick={onEdit} disabled={isDeleting} aria-label={`Edit photo ${alt}`}>Edit</button>
        <ConfirmButton
          label="Delete"
          confirmLabel="Delete?"
          danger
          onConfirm={onDelete}
          disabled={isDeleting}
          aria-label={`Delete photo ${alt}`}
        />
      </div>
    </div>
  );
}
