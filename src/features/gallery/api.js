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

// Public Gallery page loader 
export async function galleryLoader({ request: req } = {}) {
  const url = req ? new URL(req.url) : null;
  const search = url?.searchParams.get('search') || '';
  const page = Math.max(1, parseInt(url?.searchParams.get('page'), 10) || 1);

  const [albumsResult, highlightsResult] = await Promise.allSettled([
    galleryApi.list({ search, page, pageSize: GALLERY_PAGE_SIZE }),
    galleryApi.getHighlights(),
  ]);

  if (highlightsResult.status === 'rejected') {
    console.error('Failed to load gallery highlights:', highlightsResult.reason);
  }

  if (albumsResult.status === 'rejected') {
    console.error('Failed to load gallery:', albumsResult.reason);
    return { albums: [], highlights: [], page: 1, totalPages: 1, error: 'Could not load the gallery right now.' };
  }

  const result = albumsResult.value;
  const albums = Array.isArray(result) ? result : result.data;
  const highlights = highlightsResult.status === 'fulfilled' ? highlightsResult.value : [];

  return {
    albums: Array.isArray(albums) ? albums : [],
    highlights: Array.isArray(highlights) ? highlights : [],
    page: result.page || 1,
    totalPages: result.totalPages || 1,
    error: null,
  };
}