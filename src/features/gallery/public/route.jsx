import Gallery from './Gallery';
import { galleryApi, GALLERY_PAGE_SIZE } from '../api';

export async function loader({ request } = {}) {
  const url = request ? new URL(request.url) : null;
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

export default Gallery;
