import { request } from '@/services/api';

export const eventsApi = {
  list: ({ includeArchived = false, limit } = {}) => {
    const params = new URLSearchParams({ includeArchived: includeArchived ? 'true' : 'false' });
    if (limit) params.set('limit', String(limit));
    return request(`/api/events?${params.toString()}`);
  },
  create: (payload) => request('/api/events', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/events/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/events/${id}`, { method: 'DELETE' }),
};

export async function eventsLoader() {
  try {
    const events = await eventsApi.list();
    return { events: Array.isArray(events) ? events : [], error: null };
  } catch (err) {
    console.error('Failed to load events:', err);
    return { events: [], error: 'Could not load events right now.' };
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
