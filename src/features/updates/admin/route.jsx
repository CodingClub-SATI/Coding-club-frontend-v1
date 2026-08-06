import Updates from './Updates';
import { updatesApi } from '../api';
import { UPDATES_PAGE_SIZE } from '../constants';
import { parsePage } from '@/utils/pagination';

export async function loader({ request }) {
  const page = parsePage(request.url);
  try {
    const result = await updatesApi.list({ page, pageSize: UPDATES_PAGE_SIZE });
    return {
      updates: Array.isArray(result) ? result : (result.data || []),
      page: result.page || page,
      totalPages: result.totalPages || 1,
      total: Array.isArray(result) ? result.length : (result.total ?? result.length ?? 0),
      error: null,
    };
  } catch (err) {
    console.error('Failed to load alerts:', err);
    return { updates: [], page: 1, totalPages: 1, total: 0, error: 'Could not load alerts right now.' };
  }
}

export default Updates;