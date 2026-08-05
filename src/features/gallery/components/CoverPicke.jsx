import { Check } from 'lucide-react';
import styles from './CoverPicker.module.css';

/**
 * albumController.updateAlbum only accepts a `cover` that already matches
 * the `src` of a photo in that album — so picking a cover means choosing
 * among the album's existing photos, not uploading a new image.
 */
export default function CoverPicker({ images = [], value, onChange }) {
  if (images.length === 0) {
    return <p className={styles.empty}>Add photos to this album first, then choose one as the cover.</p>;
  }

  return (
    <div className={styles.grid} role="radiogroup" aria-label="Cover image">
      {images.map((img) => {
        const selected = img.src === value;
        return (
          <button
            key={img.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={img.caption ? `Use "${img.caption}" as cover` : 'Use this photo as cover'}
            className={`${styles.option} ${selected ? styles.selected : ''}`}
            onClick={() => onChange(img.src)}
          >
            <img src={img.src} alt={img.caption || ''} />
            {selected && (
              <span className={styles.check} aria-hidden="true">
                <Check size={14} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}