import Gallery from './Gallery';
import { galleryApi } from '../api';

export async function loader() {
  try {
    const albums = await galleryApi.list({ includeArchived: true });
    return { albums: Array.isArray(albums) ? albums : [], error: null };
  } catch (err) {
    console.error('Failed to load gallery:', err);
    return { albums: [], error: 'Could not load the gallery right now.' };
  }
}

export default Gallery;
