import { request } from '@/services/api';

export const eventsApi = {
  list: () => request('/api/events?includeArchived=false'),
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
