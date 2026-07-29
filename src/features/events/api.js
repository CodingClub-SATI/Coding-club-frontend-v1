import { request } from '@/services/api';

export const EVENTS_PAGE_SIZE = 9;

export const eventsApi = {
  list: ({ includeArchived = false, limit, status, type, featured, page, pageSize } = {}) => {
    const params = new URLSearchParams({ includeArchived: includeArchived ? 'true' : 'false' });
    if (limit) params.set('limit', String(limit));
    if (status) params.set('status', status);
    if (type) params.set('type', type);
    if (featured) params.set('featured', 'true');
    if (page) params.set('page', String(page));
    if (pageSize) params.set('pageSize', String(pageSize));
    return request(`/api/events?${params.toString()}`);
  },
  create: (payload) => request('/api/events', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/events/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/events/${id}`, { method: 'DELETE' }),
};

export async function eventsLoader({ request: req }) {
  const url = new URL(req.url);
  const tab = url.searchParams.get('status') || 'upcoming';
  const type = url.searchParams.get('type') || 'All';
  const page = Math.max(1, parseInt(url.searchParams.get('page'), 10) || 1);

  const status = tab === 'all' ? undefined : tab;
  const typeFilter = type === 'All' ? undefined : type;

  try {
    const [eventsResult, featuredEvents] = await Promise.all([
      eventsApi.list({ status, type: typeFilter, page, pageSize: EVENTS_PAGE_SIZE }),
      eventsApi.list({ featured: true }),
    ]);

    const events = Array.isArray(eventsResult) ? eventsResult : eventsResult.data;

    return {
      events: Array.isArray(events) ? events : [],
      featuredEvents: Array.isArray(featuredEvents) ? featuredEvents : [],
      page: eventsResult.page || 1,
      totalPages: eventsResult.totalPages || 1,
      error: null,
    };
  } catch (err) {
    console.error('Failed to load events:', err);
    return { events: [], featuredEvents: [], page: 1, totalPages: 1, error: 'Could not load events right now.' };
  }
}

export async function eventsAdminLoader() {
  try {
    const events = await eventsApi.list({ includeArchived: true });
    return { events: Array.isArray(events) ? events : [], error: null };
  } catch (err) {
    console.error('Failed to load events (admin):', err);
    return { events: [], error: 'Could not load events right now.' };
  }
}
