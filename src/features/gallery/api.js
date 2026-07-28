import { request } from '@/services/api';

function toPhotosFormData(files) {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('photos', file));
  return formData;
}

export const galleryApi = {
  list: () => request('/api/gallery'),

  // ---- Admin: albums ----
  createAlbum: (payload) => request('/api/gallery', { method: 'POST', body: payload }),
  updateAlbum: (albumId, payload) => request(`/api/gallery/${albumId}`, { method: 'PUT', body: payload }),
  removeAlbum: (albumId) => request(`/api/gallery/${albumId}`, { method: 'DELETE' }),

  // ---- Admin: photos within an album ----
  // Real file upload (multipart), not a local object-URL placeholder — the
  // backend stores the files and returns the updated album with the new
  // photos merged in.
  addPhotos: (albumId, files) =>
    request(`/api/gallery/${albumId}/photos`, { method: 'POST', body: toPhotosFormData(files) }),
  // One generic patch endpoint covers both caption edits and the
  // featured-photo toggle, since both are just field updates on a photo.
  updatePhoto: (albumId, photoId, patch) =>
    request(`/api/gallery/${albumId}/photos/${photoId}`, { method: 'PUT', body: patch }),
  removePhoto: (albumId, photoId) =>
    request(`/api/gallery/${albumId}/photos/${photoId}`, { method: 'DELETE' }),
};

// Route loader shared by both the public Gallery page and the admin Gallery
// page — both just need the full album list; the admin page layers its own
// CRUD handlers on top locally. Never throws — a failed fetch degrades to
// an empty list + error message instead of taking the route down.
export async function galleryLoader() {
  try {
    const albums = await galleryApi.list();
    return { albums: Array.isArray(albums) ? albums : [], error: null };
  } catch (err) {
    console.error('Failed to load gallery:', err);
    return { albums: [], error: 'Could not load the gallery right now.' };
  }
}
