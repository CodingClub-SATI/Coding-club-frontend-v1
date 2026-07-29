import { request } from '@/services/api';
import { uploadImage } from '@/services/upload'; 

export const galleryApi = {
  list: () => request('/api/gallery'),

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

// Route loader
export async function galleryLoader() {
  try {
    const albums = await galleryApi.list();
    return { albums: Array.isArray(albums) ? albums : [], error: null };
  } catch (err) {
    console.error('Failed to load gallery:', err);
    return { albums: [], error: 'Could not load the gallery right now.' };
  }
}