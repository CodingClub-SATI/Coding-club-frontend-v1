import styles from './PhotoTile.module.css';

export default function PhotoTile({ src, alt, isFeatured, onEdit, onDelete }) {
  return (
    <div className={styles.tile}>
      <img src={src} alt={alt} />

      {isFeatured && (
        <span className={styles.featuredStar}>★</span>
      )}

      <div className={styles.actions}>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}