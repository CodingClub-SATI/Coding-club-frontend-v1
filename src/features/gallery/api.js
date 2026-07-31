import { request } from '@/services/api';
import { uploadImage } from '@/services/upload'; 

export const GALLERY_PAGE_SIZE = 9;

export const galleryApi = {
  list: ({ search, page, pageSize } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (page) params.set('page', String(page));
    if (pageSize) params.set('pageSize', String(pageSize));
    const qs = params.toString();
    return request(`/api/gallery${qs ? `?${qs}` : ''}`);
  },
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
