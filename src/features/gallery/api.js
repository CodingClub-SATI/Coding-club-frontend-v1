import { request } from '@/services/api';
import { uploadImage } from '@/services/upload'; 

export const galleryApi = {
  list: () => request('/api/gallery'),
  getHighlights: () => request('/api/gallery/highlights'),

  // ---- Admin: albums ----
  createAlbum: (payload) => request('/api/gallery', { method: 'POST', body: payload }),
  updateAlbum: (albumId, payload) => request(`/api/gallery/${albumId}`, { method: 'PUT', body: payload }),
  removeAlbum: (albumId) => request(`/api/gallery/${albumId}`, { method: 'DELETE' }),

  // ---- Admin: photos within an album ----
  addPhotos: async (albumId, files) => {
    const uploadedUrls = await Promise.all(
      Array.from(files).map((file) => uploadImage(file))
    );

    const payload = {
      photos: uploadedUrls.map((url) => ({ 
        src: url, 
        caption: '', 
        featured: false 
      }))
    };

    return request(`/api/gallery/${albumId}/photos`, { 
      method: 'POST', 
      body: payload 
    });
  },

  updatePhoto: (albumId, photoId, patch) =>
    request(`/api/gallery/${albumId}/photos/${photoId}`, { method: 'PUT', body: patch }),
  removePhoto: (albumId, photoId) =>
    request(`/api/gallery/${albumId}/photos/${photoId}`, { method: 'DELETE' }),
};

// Admin panel loader
export async function galleryAdminLoader() {
  try {
    const albums = await galleryApi.list();
    return { albums: Array.isArray(albums) ? albums : [], error: null };
  } catch (err) {
    console.error('Failed to load gallery:', err);
    return { albums: [], error: 'Could not load the gallery right now.' };
  }
}

export async function galleryLoader() {
  const [albumsResult, highlightsResult] = await Promise.allSettled([
    galleryApi.list(),
    galleryApi.getHighlights(),
  ]);

  if (highlightsResult.status === 'rejected') {
    console.error('Failed to load gallery highlights:', highlightsResult.reason);
  }

  if (albumsResult.status === 'rejected') {
    console.error('Failed to load gallery:', albumsResult.reason);
    return { albums: [], highlights: [], error: 'Could not load the gallery right now.' };
  }

  const albums = albumsResult.value;
  const highlights = highlightsResult.status === 'fulfilled' ? highlightsResult.value : [];

  return {
    albums: Array.isArray(albums) ? albums : [],
    highlights: Array.isArray(highlights) ? highlights : [],
    error: null,
  };
}