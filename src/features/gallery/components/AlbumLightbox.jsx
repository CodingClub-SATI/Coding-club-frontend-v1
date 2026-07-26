import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import styles from './AlbumLightbox.module.css';

export default function AlbumLightbox({ album, onClose }) {
  const images = album.images || [];
  const hasMultiple = images.length > 1;
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (delta) => setCurrent((c) => (c + delta + images.length) % images.length),
    [images.length]
  );

  // Left/right arrow-key navigation between photos, on top of the Modal's
  // own Escape-to-close and focus-trap handling.
  useEffect(() => {
    if (!hasMultiple) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goTo(-1);
      if (e.key === 'ArrowRight') goTo(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goTo, hasMultiple]);

  const photo = images[current];

  return (
    <Modal
      title={
        <span className={styles.titleRow}>
          {album.title}
          {images.length > 0 && (
            <span className={styles.counter}>{current + 1} / {images.length}</span>
          )}
        </span>
      }
      onClose={onClose}
      size="lg"
      variant="glow"
    >
      {images.length === 0 ? (
        <p className={styles.empty}>No photos in this album yet.</p>
      ) : (
        <>
          <div className={styles.main}>
            {hasMultiple && (
              <button type="button" className={styles.arrow} aria-label="Previous photo" onClick={() => goTo(-1)}>
                <ChevronLeft size={20} />
              </button>
            )}

            <div className={styles.imageWrap}>
              {photo.src ? (
                <img
                  className={`${styles.image} protect-image`}
                  src={photo.src}
                  alt={photo.caption || album.title}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              ) : (
                <ImageOff className={styles.fallbackIcon} size={40} aria-hidden="true" />
              )}
              {photo.caption && <p className={styles.caption}>{photo.caption}</p>}
            </div>

            {hasMultiple && (
              <button type="button" className={styles.arrow} aria-label="Next photo" onClick={() => goTo(1)}>
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {hasMultiple && (
            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <button
                  key={img.id ?? i}
                  type="button"
                  className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`}
                  aria-label={`View photo ${i + 1}`}
                  aria-current={i === current}
                  onClick={() => setCurrent(i)}
                >
                  {img.src ? <img src={img.src} alt="" /> : <ImageOff size={16} aria-hidden="true" />}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
