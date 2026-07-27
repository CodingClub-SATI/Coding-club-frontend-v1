import { request } from '@/services/api';

export const eventsApi = {
  list: ({ includeArchived = false } = {}) =>
    request(includeArchived ? '/api/events?includeArchived=true' : '/api/events?includeArchived=false'),
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
