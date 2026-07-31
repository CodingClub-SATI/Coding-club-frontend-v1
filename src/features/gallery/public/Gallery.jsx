import { useEffect, useState } from 'react';
import { useLoaderData, useSearchParams, useNavigation } from 'react-router';
import { AlertTriangle, ImageOff, Search } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import Glasscard from '@/components/shared/Glasscard';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import AlbumCard from '@/features/gallery/components/AlbumCard';
import FeaturedSlideshow from '@/features/gallery/components/FeaturedSlideshow';
import AlbumLightbox from '@/features/gallery/components/AlbumLightbox';
import styles from './Gallery.module.css';

const SEARCH_DEBOUNCE_MS = 400;

export default function Gallery() {
  const { albums, highlights, page, totalPages, error } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const navigation = useNavigation();
  const isFiltering = navigation.state === 'loading';

  const urlSearch = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(urlSearch);

  const [syncedSearch, setSyncedSearch] = useState(urlSearch);
  if (urlSearch !== syncedSearch) {
    setSyncedSearch(urlSearch);
    setSearchInput(urlSearch);
  }

  useEffect(() => {
    if (searchInput === urlSearch) return;
    const handle = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (searchInput.trim()) next.set('search', searchInput.trim());
        else next.delete('search');
        next.delete('page'); 
        return next;
      }, { replace: true, preventScrollReset: true });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const setPage = (nextPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage <= 1) next.delete('page');
      else next.set('page', String(nextPage));
      return next;
    }, { replace: true, preventScrollReset: true });
  };

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
          ) : albums.length === 0 ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState
                icon={ImageOff}
                title={urlSearch ? 'No albums found' : 'No albums yet'}
                subtitle={urlSearch ? 'Try a different search term.' : 'Check back soon for event photos.'}
              />
            </Glasscard>
          ) : (
            <>
              <div
                className={`grid-3 ${styles.albumsGrid}`}
                aria-busy={isFiltering}
                style={isFiltering ? { opacity: 0.5, transition: 'opacity 150ms ease' } : undefined}
              >
                {albums.map((album, i) => (
                  <Reveal key={album.id} delay={i * 60}>
                    <AlbumCard album={album} onClick={setSelectedAlbum} />
                  </Reveal>
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </section>

      {selectedAlbum && (
        <AlbumLightbox key={selectedAlbum.id} album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
      )}
    </div>
  );
}