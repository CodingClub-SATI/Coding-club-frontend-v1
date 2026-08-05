import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { AlertTriangle, Archive, ArchiveRestore, ArrowLeft, Image as ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminTitle from '@/components/admin/AdminTitle';
import MultiImageAdd from '@/features/gallery/components/MultiImageAdd';
import PhotoTile from '@/features/gallery/components/PhotoTile';
import EmptyState from '@/components/shared/EmptyState';
import Button from '@/components/shared/Button';
import { Toggle } from '@/components/shared/Toggle';
import { ConfirmButton } from '@/components/shared/ConfirmButton';
import { galleryApi } from '@/features/gallery/api';
import { MAX_FEATURED_PER_ALBUM } from '@/features/gallery/constants';
import AlbumFormModal from '@/features/gallery/components/AlbumFormModal';
import PhotoEditModal from '@/features/gallery/components/PhotoEditModal';
import tileStyles from '@/components/admin/Tile.module.css';
import formStyles from '@/components/admin/AdminForm.module.css';
import filterBarStyles from '@/components/admin/FilterBar.module.css';
import badgeStyles from '@/components/admin/Badge.module.css';
import styles from './Gallery.module.css';

export default function Gallery() {
  const { albums: initialAlbums, error: loadError } = useLoaderData();

  const [albums, setAlbums] = useState(initialAlbums);
  const [openAlbumId, setOpenAlbumId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [formModal, setFormModal] = useState(null); // { mode: 'create' } | { mode: 'rename', album }
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [deletingAlbumId, setDeletingAlbumId] = useState(null);
  const [archivingAlbumId, setArchivingAlbumId] = useState(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);

  const openAlbum = albums.find((a) => a.id === openAlbumId) || null;
  const activeCount = albums.filter((a) => !a.archived).length;
  const visibleAlbums = albums.filter((a) => showArchived || !a.archived);

  // ---------- Albums ----------
  const handleCreateAlbum = async (values) => {
    const newAlbum = await galleryApi.createAlbum(values);
    setAlbums((prev) => [newAlbum, ...prev]);
  };

  const handleRenameAlbum = async (album, values) => {
    const updated = await galleryApi.updateAlbum(album.id, values);
    setAlbums((prev) => prev.map((a) => (a.id === album.id ? updated : a)));
  };

  const handleToggleArchive = async (album) => {
    setActionError('');
    setArchivingAlbumId(album.id);
    try {
      const updated = await galleryApi.setAlbumArchived(album.id, !album.archived);
      setAlbums((prev) => prev.map((a) => (a.id === album.id ? { ...a, ...updated } : a)));
    } catch (err) {
      console.error('Failed to update album:', err);
      setActionError('Could not update this album. Please try again.');
    } finally {
      setArchivingAlbumId(null);
    }
  };

  const handleDeleteAlbum = async (album) => {
    setActionError('');
    setDeletingAlbumId(album.id);
    try {
      await galleryApi.removeAlbum(album.id);
      setAlbums((prev) => prev.filter((a) => a.id !== album.id));
      if (openAlbumId === album.id) setOpenAlbumId(null);
    } catch (err) {
      console.error('Failed to delete album:', err);
      setActionError('Could not delete this album. Please try again.');
    } finally {
      setDeletingAlbumId(null);
    }
  };

  // ---------- Photos (scoped to the currently open album) ----------
  const handleAddPhotos = async (files) => {
    if (!openAlbum) return;
    setUploading(true);
    setActionError('');
    try {
      const { album: updatedAlbum, failedCount } = await galleryApi.addPhotos(openAlbum.id, files);
      setAlbums((prev) => prev.map((a) => (a.id === openAlbum.id ? updatedAlbum : a)));
      if (failedCount > 0) {
        setActionError(`${failedCount} photo${failedCount === 1 ? '' : 's'} failed to upload. The rest were added.`);
      }
    } catch (err) {
      console.error('Failed to upload photos:', err);
      setActionError('Could not upload photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdatePhoto = async (photo, patch) => {
    const updated = await galleryApi.updatePhoto(openAlbum.id, photo.id, patch);
    setAlbums((prev) =>
      prev.map((a) =>
        a.id !== openAlbum.id
          ? a
          : { ...a, images: a.images.map((img) => (img.id === photo.id ? updated : img)) }
      )
    );
  };

  const handleDeletePhoto = async (photo) => {
    setActionError('');
    setDeletingPhotoId(photo.id);
    try {
      await galleryApi.removePhoto(openAlbum.id, photo.id);
      setAlbums((prev) =>
        prev.map((a) =>
          a.id !== openAlbum.id
            ? a
            : {
                ...a,
                images: a.images.filter((img) => img.id !== photo.id),
                imageCount: Math.max(0, (a.imageCount ?? a.images.length) - 1),
              }
        )
      );
    } catch (err) {
      console.error('Failed to delete photo:', err);
      setActionError('Could not delete this photo. Please try again.');
    } finally {
      setDeletingPhotoId(null);
    }
  };

  // ============================================================
  // Album detail view — photos within one album
  // ============================================================
  if (openAlbum) {
    const featuredCount = openAlbum.images.filter((img) => img.featured).length;

    return (
      <div>
        <Button variant="ghost" size="sm" className={styles.backBtn} onClick={() => setOpenAlbumId(null)}>
          <ArrowLeft size={16} /> Back to Albums
        </Button>

        <AdminTitle
          title={openAlbum.title}
          subtitle={`${openAlbum.images.length} photo${openAlbum.images.length === 1 ? '' : 's'} · ${featuredCount}/${MAX_FEATURED_PER_ALBUM} featured${openAlbum.archived ? ' • Archived (hidden from public site)' : ''}`}
        >
          <MultiImageAdd onAdd={handleAddPhotos} disabled={uploading} />
        </AdminTitle>

        {actionError && <p className={formStyles.error} role="alert">{actionError}</p>}

        {openAlbum.images.length === 0 ? (
          <EmptyState icon={ImageIcon} title="No photos yet" subtitle='Use "Add Photos" to upload images into this album.' />
        ) : (
          <div className={styles.photoGrid}>
            {openAlbum.images.map((photo) => (
              <PhotoTile
                key={photo.id}
                src={photo.src}
                alt={photo.caption || openAlbum.title}
                isFeatured={photo.featured}
                isDeleting={deletingPhotoId === photo.id}
                onEdit={() => setEditingPhoto(photo)}
                onDelete={() => handleDeletePhoto(photo)}
              />
            ))}
          </div>
        )}

        {editingPhoto && (
          <PhotoEditModal
            photo={editingPhoto}
            featuredLimitReached={
              openAlbum.images.filter((img) => img.featured && img.id !== editingPhoto.id).length >=
              MAX_FEATURED_PER_ALBUM
            }
            onClose={() => setEditingPhoto(null)}
            onSubmit={(patch) => handleUpdatePhoto(editingPhoto, patch)}
          />
        )}
      </div>
    );
  }

  // ============================================================
  // Album grid view
  // ============================================================
  return (
    <div>
      <AdminTitle title="Gallery" subtitle={`${activeCount} album${activeCount === 1 ? '' : 's'}`}>
        <Button onClick={() => setFormModal({ mode: 'create' })}>
          <Plus size={16} /> Create Album
        </Button>
      </AdminTitle>

      <div className={filterBarStyles.filterBar}>
        <Toggle checked={showArchived} onChange={setShowArchived} label="Show archived" />
      </div>

      {actionError && <p className={formStyles.error} role="alert">{actionError}</p>}

      {loadError ? (
        <EmptyState icon={AlertTriangle} title={loadError} subtitle="Try refreshing the page in a moment." />
      ) : visibleAlbums.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title={albums.length === 0 ? 'No albums yet' : 'No albums match this filter'}
          subtitle={albums.length === 0 ? 'Use "Create Album" to start your first gallery album.' : 'Try turning on "Show archived" to see archived albums.'}
        />
      ) : (
        <div className={styles.albumGrid}>
          {visibleAlbums.map((album) => {
            const photoCount = album.imageCount ?? album.images?.length ?? 0;
            return (
              <div key={album.id} className={tileStyles.tile}>
                <button
                  type="button"
                  className={styles.tileOpenBtn}
                  onClick={() => setOpenAlbumId(album.id)}
                  aria-label={`Open ${album.title} album`}
                >
                  <div className={tileStyles.tileThumb}>
                    {album.cover ? (
                      <img src={album.cover} alt="" loading="lazy" />
                    ) : (
                      <ImageIcon size={26} aria-hidden="true" />
                    )}
                  </div>
                  <div className={tileStyles.tileBody}>
                    <div className={tileStyles.tileTitle}>
                      {album.title}
                      {album.archived && (
                        <span className={`${badgeStyles.badge} ${badgeStyles.archived} ${styles.inlineBadge}`}>Archived</span>
                      )}
                    </div>
                    <div className={tileStyles.tileSub}>
                      {album.date} · {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
                    </div>
                  </div>
                </button>

                <div className={styles.tileActions}>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deletingAlbumId === album.id || archivingAlbumId === album.id}
                    onClick={() => setFormModal({ mode: 'rename', album })}
                  >
                    <Pencil size={12} /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={archivingAlbumId === album.id || deletingAlbumId === album.id}
                    onClick={() => handleToggleArchive(album)}
                  >
                    {album.archived ? <><ArchiveRestore size={12} aria-hidden="true" /> Unarchive</> : <><Archive size={12} aria-hidden="true" /> Archive</>}
                  </Button>
                  <ConfirmButton
                    label={<><Trash2 size={12} /> Delete</>}
                    confirmLabel="Delete album?"
                    danger
                    onConfirm={() => handleDeleteAlbum(album)}
                    disabled={deletingAlbumId === album.id || archivingAlbumId === album.id}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formModal?.mode === 'create' && (
        <AlbumFormModal mode="create" onClose={() => setFormModal(null)} onSubmit={handleCreateAlbum} />
      )}

      {formModal?.mode === 'rename' && (
        <AlbumFormModal
          mode="rename"
          initialTitle={formModal.album.title}
          initialDate={formModal.album.date || ''}
          initialCover={formModal.album.cover || ''}
          images={formModal.album.images || []}
          onClose={() => setFormModal(null)}
          onSubmit={(values) => handleRenameAlbum(formModal.album, values)}
        />
      )}
    </div>
  );
}