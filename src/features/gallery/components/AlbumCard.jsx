import { Image as ImageIcon } from 'lucide-react';
import Glasscard from '@/components/shared/Glasscard';
import styles from './AlbumCard.module.css';

export default function AlbumCard({ album, onClick }) {
  const photoCount = album.imageCount ?? album.images?.length ?? 0;

  // Enables keyboard users to open the album with Enter or Space
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(album);
    }
  };

  return (
    <Glasscard
      className={styles.albumCard}
      onClick={() => onClick(album)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${album.title} album`}
    >
      <div className={styles.cover}>
        {album.cover ? (
          <img
            className={`${styles.coverImg} protect-image`}
            src={album.cover}
            alt=""
            loading="lazy"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        ) : (
          <ImageIcon className={styles.coverIcon} size={32} aria-hidden="true" />
        )}
        <span className={styles.count}>{photoCount} {photoCount === 1 ? 'photo' : 'photos'}</span>
        <div className={styles.overlay} aria-hidden="true">Open Album →</div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{album.title}</h3>
        <p className={styles.date}>{album.date}</p>
      </div>
    </Glasscard>
  );
}
