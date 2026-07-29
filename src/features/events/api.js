import { request } from '@/services/api';

export const eventsApi = {
  list: ({ includeArchived = false, limit, status, type, featured } = {}) => {
    const params = new URLSearchParams({ includeArchived: includeArchived ? 'true' : 'false' });
    if (limit) params.set('limit', String(limit));
    if (status) params.set('status', status);
    if (type) params.set('type', type);
    if (featured) params.set('featured', 'true');
    return request(`/api/events?${params.toString()}`);
  },
  create: (payload) => request('/api/events', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/events/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/events/${id}`, { method: 'DELETE' }),
};

// Reads the public Events page's tab ('upcoming' | 'completed' | 'all') and
// type-select ('All' | 'Workshop' | ...) straight from the URL's search
// params and asks the backend for exactly that slice via ?status=/?type=,
// instead of fetching every event and filtering it in the browser. The
// featured carousel is fetched separately via ?featured=true so it always
// shows every featured event regardless of which tab/type is selected.
export async function eventsLoader({ request: req }) {
  const url = new URL(req.url);
  const tab = url.searchParams.get('status') || 'upcoming';
  const type = url.searchParams.get('type') || 'All';

  const status = tab === 'all' ? undefined : tab;
  const typeFilter = type === 'All' ? undefined : type;

  try {
    const [events, featuredEvents] = await Promise.all([
      eventsApi.list({ status, type: typeFilter }),
      eventsApi.list({ featured: true }),
    ]);
    return {
      events: Array.isArray(events) ? events : [],
      featuredEvents: Array.isArray(featuredEvents) ? featuredEvents : [],
      error: null,
    };
  } catch (err) {
    console.error('Failed to load events:', err);
    return { events: [], featuredEvents: [], error: 'Could not load events right now.' };
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
