import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { AlertTriangle, ImageOff, Search } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import Glasscard from '@/components/shared/Glasscard';
import EmptyState from '@/components/shared/EmptyState';
import AlbumCard from '@/features/gallery/components/AlbumCard';
import FeaturedSlideshow from '@/features/gallery/components/FeaturedSlideshow';
import AlbumLightbox from '@/features/gallery/components/AlbumLightbox';
import styles from './Gallery.module.css';

export default function Gallery() {
  const { albums, highlights, error } = useLoaderData();
  const [search, setSearch] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      {/* Intro */}
      <section className="section">
        <div className="container">
          <Reveal Component="h1" className="section-title">
            Club <span className="text-primary-glow">Gallery</span>
          </Reveal>
          <p className="section-subtitle">
            Moments captured from our events, workshops, and achievements.
          </p>
        </div>
      </section>

      {/* Featured spotlight */}
      {!error && highlights.length > 0 && (
        <section className="section">
          <div className="container">
            <FeaturedSlideshow photos={highlights} />
          </div>
        </section>
      )}

      {/* Albums */}
      <section className="section" id="albums">
        <div className="container">
          <div className={styles.toolbar}>
            <h2 className={`section-title ${styles.toolbarTitle}`}>
              Event <span className="text-secondary-glow">Albums</span>
            </h2>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} aria-hidden="true" />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search albums..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search albums by title"
              />
            </div>
          </div>

          {error ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState 
                icon={AlertTriangle} 
                title={error} 
                subtitle="Try refreshing the page in a moment." 
              />
            </Glasscard>
          ) : filteredAlbums.length === 0 ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState
                icon={ImageOff}
                title={albums.length === 0 ? 'No albums yet' : 'No albums found'}
                subtitle={albums.length === 0 ? 'Check back soon for event photos.' : 'Try a different search term.'}
              />
            </Glasscard>
          ) : (
            <div className={`grid-3 ${styles.albumsGrid}`}>
              {filteredAlbums.map((album, i) => (
                <Reveal key={album.id} delay={i * 60}>
                  <AlbumCard album={album} onClick={setSelectedAlbum} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedAlbum && (
        <AlbumLightbox key={selectedAlbum.id} album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
      )}
    </div>
  );
}