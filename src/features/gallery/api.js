import { request } from '@/services/api';

export const galleryApi = {
  list: () => request('/api/gallery'),
};

// Route loader for the public Gallery page. Never throws — a failed fetch
// degrades to an empty list + error message instead of taking the route down.
export async function galleryLoader() {
  try {
    const albums = await galleryApi.list();
    return { albums: Array.isArray(albums) ? albums : [], error: null };
  } catch (err) {
    console.error('Failed to load gallery:', err);
    return { albums: [], error: 'Could not load the gallery right now.' };
  }
}
