import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import Glasscard from '@/components/shared/Glasscard';
import styles from './FeaturedSlideshow.module.css';

export default function FeaturedSlideshow({ photos }) {
  const [active, setActive] = useState(0);
  const hasMultiple = photos.length > 1;
  // Clamped via modulo (instead of an effect) so a change in photo count
  // between renders can never point at an out-of-range index.
  const activeIndex = photos.length ? active % photos.length : 0;

  const goTo = useCallback(
    (delta) => setActive((current) => (current + delta + photos.length) % photos.length),
    [photos.length]
  );

  const photo = photos[activeIndex];
  if (!photo) return null;

  return (
    <Glasscard className={styles.slideshow}>
      <div className={styles.frame}>
        {photo.src ? (
          <img
            className={`${styles.image} protect-image`}
            src={photo.src}
            alt={photo.caption || photo.albumTitle}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        ) : (
          <ImageOff className={styles.fallbackIcon} size={40} aria-hidden="true" />
        )}
        <div className={styles.label}>{photo.albumTitle}</div>

        {hasMultiple && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowLeft}`}
              aria-label="Previous featured photo"
              onClick={() => goTo(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowRight}`}
              aria-label="Next featured photo"
              onClick={() => goTo(1)}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className={styles.dots}>
          {photos.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
              aria-label={`Show featured photo ${index + 1}`}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      )}
    </Glasscard>
  );
}
